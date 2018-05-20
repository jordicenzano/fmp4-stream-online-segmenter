//Jordi Cenzano 2018
const treemodel = require('tree-model');
const enAtomNames = require('./mp4AtomParser.js').enAtomNames;
const enTrackTypes = require('./mp4AtomParser.js').enTrackTypes;

"use strict";


// Constructor
class mp4AtomTree {

    constructor(atom_parser, buffer , buffer_offset = 0, verbose = false) {

        this.verbose = verbose;
        this.atom_data_tree_root = this._parseAtom(atom_parser, buffer, buffer_offset);

        if (this.atom_data_tree_root === null)
            throw new Error("Processing atom tree");
    }

    getRootNode() {
        return this.atom_data_tree_root;
    }

    getTracksMediaTypes () {
        let ret = [];

        let hdlr_atoms = this.atom_data_tree_root.all(function (node) {
            return node.model.type === enAtomNames.HDLR;
          });

          for (let i = 0; i < hdlr_atoms.length; i++) {
            ret.push(hdlr_atoms[i].model.data.type);
          }

          return ret;
    }

    getVideoCodecStr() {
        let ret = "";
        const self = this;

        //avc1.[PROFILE in Hex][PROFILE compact][Level in HEX]
        //avc1.42 C0 0D

        let stsd_video_nodes = this.atom_data_tree_root.all(function (node) {
            let ret = false;
            if (node.model.type === enAtomNames.STSD) {
                if (self._getParentTrackType(node) === enTrackTypes.VIDEO.type) {
                    ret = true;
                }
            }

            return ret;
        });

        if (stsd_video_nodes.length > 0) {
            if (stsd_video_nodes[0].model.data.entry_count > 0) {
                const codec_entry = stsd_video_nodes[0].model.data.VisualSampleEntry[0];

                if ("format" in codec_entry) {
                    let codec_format_text = this._hex2a(codec_entry.format.toString(16));

                    if (("codec_data" in codec_entry) && ("codec_ini" in codec_entry.codec_data) && (codec_entry.codec_data.codec_ini.length > 3)) {
                        const codec_ini_buf = codec_entry.codec_data.codec_ini;

                        ret = codec_format_text + "." + this._padStr(codec_ini_buf[1].toString(16),2).toUpperCase() + this._padStr(codec_ini_buf[2].toString(16),2).toUpperCase() + this._padStr(codec_ini_buf[3].toString(16),2).toUpperCase();
                    }
                }
            }
        }

        return ret;
    }

    getVideoTimescale() {
        let ret = -1;
        const self = this;

        let mdhd_video_nodes = this.atom_data_tree_root.all(function (node) {
            let ret = false;
            if (node.model.type === enAtomNames.MDHD) {
                if (self._getParentTrackType(node) === enTrackTypes.VIDEO.type) {
                    ret = true;
                }
            }

            return ret;
        });

        if (mdhd_video_nodes.length > 0) {
            ret = mdhd_video_nodes[0].model.data.timescale
        }

        return ret;
    }

    getFragmentbaseMediaDecodeTime() {
        let dur_tb = -1;

        let tfdt_nodes = this.atom_data_tree_root.all(function (node) {
            let ret = false;
            if (node.model.type === enAtomNames.TFDT) {
                ret = true;
            }

            return ret;
        });

        if (tfdt_nodes.length > 0) {
            dur_tb = tfdt_nodes[0].model.data.baseMediaDecodeTime;
        }

        return dur_tb;
    }

    getFragmentDuration() {
        const sample_dur_s = this.getFragmentDefaultSampleDuration();

        const samples_num = this.getFragmentNumSamples();

        return sample_dur_s * samples_num;
    }

    getFragmentNumSamples() {
        let samples_num = 0;

        let trun_nodes = this.atom_data_tree_root.all(function (node) {
            let ret = false;
            if (node.model.type === enAtomNames.TRUN) {
                ret = true;
            }

            return ret;
        });

        if (trun_nodes.length > 0) {
            samples_num = trun_nodes[0].model.data.sample_count;
        }

        return samples_num;
    }

    getFragmentDefaultSampleDuration(timebase = 1) {
        let dur_tb = -1;

        let tfhd_nodes = this.atom_data_tree_root.all(function (node) {
            let ret = false;
            if (node.model.type === enAtomNames.TFHD) {
                ret = true;
            }

            return ret;
        });

        if (tfhd_nodes.length > 0) {
            dur_tb = tfhd_nodes[0].model.data.default_sample_duration;
        }


        return dur_tb / timebase;
    }

    _parseAtom(atom_parser, buffer , buffer_offset = 0) {
        if (typeof(buffer) !== 'object') {
            return null;
        }

        let ret = this._processAtom(atom_parser, buffer, buffer_offset, 0, new treemodel());

        if (this.verbose)
            console.log("Atom tree: " + JSON.stringify(ret.node.model));

        return ret.node;
    }

    _hex2a(hexx) {
        let hex = hexx.toString();//force conversion
        let str = "";
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== "00"); i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }

        return str;
    }

    _padStr (str, size) {
        let s = str.toString();
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }

    _getParentTrackType(node) {
        let ret = enTrackTypes.UNKNOWN;

        let node_path = node.getPath();

        let n = node_path.length - 1;
        while ((n >= 0) && (ret === enTrackTypes.UNKNOWN)) {
            let curr_node = node_path[n];

            //Find MDIA parent
            if (curr_node.model.type === enAtomNames.MDIA) {
                //Get MDIA childs
                for (let child_elem in curr_node.children) {
                    let mdia_child = curr_node.children[child_elem];
                    if (mdia_child.model.type === enAtomNames.HDLR) //Return track type
                        return mdia_child.model.data.type;
                }
            }

            n--;
        }

        return ret;
    }

    _addTreeChildAtom(atom_tree, atom, node) {
        let ret_node = null;

        if (node === null) { //Add root element
            ret_node = atom_tree.parse(atom);
        }
        else {
            ret_node = node.addChild(atom_tree.parse(atom));
        }

        if (this.verbose) {
            let dest_str = "ROOT";
            if (node !== null)
                dest_str = node.model.type;

            console.log("Added: " + atom.type + " -> " + dest_str);
        }

        return ret_node;
    }

    _processAtom(atom_parser, buffer, buffer_offset, buffer_pos, tree, atom_node = null) {
        
        if ((buffer_pos + 8) > buffer.length) {
            throw new Error("Error reading the atom, the buffer is smaller than the atom size")
        }

        let read = 0;

        //Parse atom header
        let atom = atom_parser.enAtomTypes.getParser(enAtomNames.HEADER).parse(buffer.slice(buffer_pos));
        atom.start_pos_rel = buffer_pos;
        atom.start_pos = buffer_pos + buffer_offset;
        atom.data = {};
        read += 8;

        //Create atom tree node
        let new_node = this._addTreeChildAtom(tree, atom, atom_node);

        if (atom_parser.enAtomTypes.isContanier(atom.type)) {
            //Childs of the same parent
            while (read < atom.size) {
                let ret = this._processAtom(atom_parser, buffer, buffer_offset, buffer_pos + read, tree, new_node);

                read += ret.read;
            }
        }
        else {
            //Parse that atom data
            let atom_sel_parser = atom_parser.enAtomTypes.getParser(atom.type, this._getParentTrackType(new_node));
            if (atom_sel_parser != null) {
                atom.data = atom_sel_parser.parse(buffer.slice(buffer_pos + read));
            }

            read = atom.size;
        }

        return {read: read, node: new_node};
    }
}

//Export class
module.exports.mp4AtomTree = mp4AtomTree;
