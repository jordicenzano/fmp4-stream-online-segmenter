//Jordi Cenzano 2018

const Cfmp4Chunk = require('./fmp4Chunk.js');
const mp4AtomParser = require('./mp4AtomParser.js');
const mp4AtomTree = require('./mp4AtomTree.js');
const dashManifest = require('./dashManifest.js');
const enAtomNames = require('./mp4AtomParser.js').enAtomNames;
const enTrackTypes = require('./mp4AtomParser.js').enTrackTypes;
const path = require('path');

"use strict";

const enChunkType = {
    LAST: 'last',
    INIT: 'init',
    REGULAR: 'regular'
};

class fmp4DashGenerator {

    constructor(is_creating_chunks = false, base_path = "", chunk_base_filename = "chunk", target_segment_dur_s = 4, manifest_type = dashManifest.enChunklistType.SegmentList) {
        this.is_creating_chunks = is_creating_chunks;
        this.base_path = base_path;
        this.chunk_base_filename = chunk_base_filename;
        this.target_segment_dur_s = target_segment_dur_s;

        this.verbose = true;

        this.atoms_to_save = [enAtomNames.MOOV];
        this.current_chunk = {
            chunk_data: null,
            current_index: 0,
            type: enChunkType.INIT
        };

        this.moov_data_callback = null;

        this.tmp_moof_counter = 0; //TODO:

        this.src_file_offset_abs = 0;

        this.result_manifest = "";

        //Create packet parsers. According to the docs it is compiled at first call, so we can NOT create it inside atom (time consuming)
        this.mp4_moov_atom_parser = new mp4AtomParser.mp4AtomParser(this.verbose);

        //Create dash manifest generator
        this.dash_manifest_generator = new dashManifest.dash_manifest(manifest_type, path.basename(chunk_base_filename), {});
    }

    setMoovDataCallback(func) {
        this.moov_data_callback = func;
    }

    processDataChunk(data, callback) {
        try {
            this._process_data_chunk(data);
        }
        catch (err) {
            return callback(err);
        }

        return callback(null);
    }

    processDataEnd(callback) {
        try {
            //Process remaining mp4 data
            this._process_data_finish();

            //TODO: Finish implementation of dash_manifest_generator
            this.result_manifest = this.dash_manifest_generator.toString();
        }
        catch (err) {
            return callback(err, null);
        }

        return callback(null, this.result_manifest);
    }

    _createNewChunk(type, moov_data_tree = null) {
        //Close current chunk
        if (this.current_chunk.chunk_data != null) {
            this.current_chunk.chunk_data.close();

            //Add chunk to chunklist
            if (this.current_chunk.type === enChunkType.INIT) {
                this.dash_manifest_generator.setMediaIniInfo(this.current_chunk, moov_data_tree);
            }
            else {
                this.dash_manifest_generator.addVideoChunk(this.current_chunk);
            }
        }

        this.tmp_moof_counter = 0;

        //Create new chunk if necessary
        if ((typeof (type) === 'undefined') || (type !== enChunkType.LAST)) {
            const chunk_options = {
                base_path: this.base_path,
                chunk_base_file_name: this.chunk_base_filename,
                is_writing_chunks: this.is_creating_chunks,
                verbose: this.verbose
            };

            this.current_chunk.chunk_data = new Cfmp4Chunk.fmp4Chunk(this.current_chunk.current_index, chunk_options);
            this.current_chunk.type = type;
            this.current_chunk.current_index++;
        }
    }

    _checkInputFormatConstraints(moov_data_tree) {
        let tracks = moov_data_tree.getTracksMediaTypes();
        
        if (this.verbose)
            console.log("Found following tracks: " + JSON.stringify(tracks));

        if (tracks.length !== 1)
            throw new Error ("Number of tracks found != 1. Only 1 video track is allowed in this version");

        if (tracks[0] !== enTrackTypes.VIDEO.type)
            throw new Error ("Found a track type different than video. Only 1 video track is allowed in this version");
    }

    _process_data_chunk(data) {

        if (this.current_chunk.chunk_data === null) {
            this._createNewChunk(enChunkType.INIT);
            this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, 0, this.verbose);
        }

        let currentPosReader = 0;

        while (currentPosReader < data.length) {
            const added = this.current_chunk.chunk_data.addAtomData(data, currentPosReader);
            currentPosReader += added;

            //Update the abs pos for the src file (only used for nonn chunk generated)
            this.src_file_offset_abs += added;

            const currentAtom = this.current_chunk.chunk_data.getCurrentAtom();
            if (currentAtom.isAtomComplete()) {
                if (this.verbose) {
                    if (currentAtom.isSaved())
                        console.log("Atom saved: " + currentAtom.getType());
                    else
                        console.log("Atom skipped: " + currentAtom.getType());
                }

                if ((currentAtom.getType() === enAtomNames.MOOV) && (this.atoms_to_save.indexOf(enAtomNames.MOOV) >= 0)) {
                    const moov_data_tree = new mp4AtomTree.mp4AtomTree(this.mp4_moov_atom_parser, currentAtom.getBuffer());

                    if (this.moov_data_callback !== null)
                        this.moov_data_callback(moov_data_tree.getRootNode());

                    //Error if we break the constraints
                    this._checkInputFormatConstraints(moov_data_tree);

                    this.atoms_to_save = [enAtomNames.MOOF, enAtomNames.MDAT];
                    this._createNewChunk(enChunkType.REGULAR, moov_data_tree);

                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs);
                }
                else if (currentAtom.getType() === enAtomNames.MOOF) {//TODO: Count by time
                    if (this.tmp_moof_counter > 7) {//TODO: Max MOOF per chunk should be 1 to avoid problems in players
                        this._createNewChunk(enChunkType.REGULAR);

                        this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs);
                    }
                    else {
                        this.tmp_moof_counter++;
                        this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs);
                    }
                }
                else {
                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs);
                }
            }
        }
    }

    _process_data_finish() {
        this._createNewChunk(enChunkType.LAST);
    }
}

//Export class
module.exports.fmp4DashGenerator = fmp4DashGenerator;
