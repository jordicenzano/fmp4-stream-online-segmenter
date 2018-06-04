//Jordi Cenzano 2018

const Cfmp4Chunk = require('./fmp4Chunk.js');
const mp4AtomParser = require('./mp4AtomParser.js');
const mp4AtomTree = require('./mp4AtomTree.js');
const dashManifest = require('./dashManifest.js');
const extErr = require('./extendedError');
const enAtomNames = require('./mp4AtomParser.js').enAtomNames;
const enTrackTypes = require('./mp4AtomParser.js').enTrackTypes;
const path = require('path');

"use strict";

const CHUNK_TOLERANCE_DUR_S = 0.2;

const enChunkType = {
    LAST: 'last',
    INIT: 'init',
    REGULAR: 'regular'
};

class fmp4DashGenerator {

    constructor(is_creating_chunks = false, base_path = "", chunk_base_filename = "chunk", target_segment_dur_s = 0, manifest_type = dashManifest.enManifestType.SegmentList) {
        this.is_creating_chunks = is_creating_chunks;
        this.base_path = base_path;
        this.chunk_base_filename = chunk_base_filename;
        this.target_segment_dur_s = target_segment_dur_s; //0 means create one chunk at each moof

        this.verbose = true;

        this.atoms_to_save = [enAtomNames.MOOV];
        this.current_chunk = {
            chunk_data: null,
            index: 0,
            type: enChunkType.INIT
        };

        this.timebase = 1;

        this.callback_moov = null;
        this.callback_moof = null;
        this.callback_data_that = null;

        this.callback_manifest = null;
        this.callback_manifest_that = null;

        this.src_file_offset_abs = 0;

        this.result_manifest = "";

        this.err_to_return = null;

        //TODO: Segment list NOT supported for live. See https://github.com/Dash-Industry-Forum/dash.js/issues/1677
        //TODO: implement others as timeline

        //Create packet parsers. According to the docs it is compiled at first call, so we can NOT create it inside atom (time consuming)
        this.mp4_atom_parser = new mp4AtomParser.mp4AtomParser(this.verbose);

        let manifest_options = {
            is_splitting_chunks: is_creating_chunks,
            is_using_relative_path: true
        };

        //Create dash manifest generator
        this.dash_manifest_generator = new dashManifest.dash_manifest(manifest_type, path.basename(chunk_base_filename), manifest_options);
    }

    setDataCallbacks(that, func_moov, func_moof = null) {
        this.callback_moov = func_moov;
        this.callback_moof = func_moof;

        this.callback_data_that = that;
    }

    setManifestCallback(that, func_manifest) {
        this.callback_manifest = func_manifest;

        this.callback_manifest_that = that;
    }

    processDataChunk(data, callback) {
        try {
            this._process_data_chunk(data);
        }
        catch (err) {
            if (("isFatal" in err) && (err.isFatal() === true)) {
                this.err_to_return = err;
            }

            return callback(err);
        }
    }

    processDataEnd(callback) {
        try {
            //Process remaining mp4 data
            this._process_data_finish();

            this.result_manifest = this.dash_manifest_generator.toString();

            if (this.verbose)
                console.log('Manifest:\n' + this.result_manifest)
        }
        catch (err) {
            //Return the 1st fatal error
            if (this.err_to_return !== null)
                err = this.err_to_return;

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

                if (this.verbose)
                    console.log("Created new media ini chunk!");
            }
            else {
                this.dash_manifest_generator.addVideoChunk(this.current_chunk);

                if (this.verbose)
                    console.log("Created new media chunk. Duration[s]: " + (this.current_chunk.chunk_data.getDurationSec()).toString());
            }
        }

        //Create new chunk if necessary
        if ((typeof (type) === 'undefined') || (type !== enChunkType.LAST)) {
            const chunk_options = {
                base_path: this.base_path,
                chunk_base_file_name: this.chunk_base_filename,
                is_writing_chunks: this.is_creating_chunks,
                verbose: this.verbose
            };

            //Create new chunk
            this.current_chunk.chunk_data = new Cfmp4Chunk.fmp4Chunk(this.current_chunk.index, this.timebase, chunk_options);
            this.current_chunk.type = type;
            this.current_chunk.index++;
        }

        if (this.callback_manifest !== null) {
            this.callback_manifest(this.callback_manifest_that, this.dash_manifest_generator.toString());
        }
    }

    _checkInputFormatConstraints(moov_data_tree) {
        let tracks = moov_data_tree.getTracksIds();
        
        if (this.verbose)
            console.log("Found following tracks: " + JSON.stringify(tracks));

        if (tracks.total <= 0)
            throw new extErr.extendedError("No tracks found", true);

        //TODO: Get any track as a timebase. For now video[0] is used
        if (tracks[enTrackTypes.VIDEO.type].length < 1)
            throw new extErr.extendedError("We need at least one video track in this version", true);

        if (tracks[enTrackTypes.VIDEO.type].length > 1)
            throw new extErr.extendedError("More than one video track found. Only 1 video track supported", true);
    }

    _process_data_chunk(data) {

        //TODO:
        // Idea share moov between video / audio files (probably will NOT work)
        // Create N ini files (1 video + N Audios)
        // Select what chunk belongs video or audio based in trackID
        // We need 2 different chunk video / audio. Also save the chunk when it is decoded (except mdat)

        if (this.current_chunk.chunk_data === null) {
            this._createNewChunk(enChunkType.INIT);
            this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, 0);
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
                    const moov_data_tree = new mp4AtomTree.mp4AtomTree(this.mp4_atom_parser, currentAtom.getBuffer());

                    //For future segmentation
                    this.timebase = moov_data_tree.getTimescale();

                    //Callback for moov atom
                    if (this.callback_moov !== null)
                        this.callback_moov(this.callback_data_that, moov_data_tree.getRootNode());

                    //Error if we break the constraints
                    this._checkInputFormatConstraints(moov_data_tree);

                    //Start a new chunk now
                    this._createNewChunk(enChunkType.REGULAR, moov_data_tree);

                    //Now save to disk only MOOF and MDAT atoms
                    this.atoms_to_save = [enAtomNames.MOOF, enAtomNames.MDAT];
                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs);
                }
                else if (currentAtom.getType() === enAtomNames.MOOF) {
                    const moof_data_tree = new mp4AtomTree.mp4AtomTree(this.mp4_atom_parser, currentAtom.getBuffer());

                    //Callback for moof atom
                    if (this.callback_moof !== null)
                        this.callback_moof(this.callback_data_that, moof_data_tree.getRootNode());

                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs, moof_data_tree.getFragmentDuration(), moof_data_tree.getFragmentbaseMediaDecodeTime());
                }
                else if (currentAtom.getType() === enAtomNames.MDAT) {//Break chunk here, just MDAT saved
                    if (this.target_segment_dur_s <= 0) {
                        //Create a chunk to each moof
                        this._createNewChunk(enChunkType.REGULAR);
                    }
                    else {
                        //If we assume the next is will be outside chunk dur
                        const chunkdur_s = this.current_chunk.chunk_data.getDurationSec() + CHUNK_TOLERANCE_DUR_S;

                        if (chunkdur_s > this.target_segment_dur_s) {
                            this._createNewChunk(enChunkType.REGULAR);
                        }
                    }

                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save, this.src_file_offset_abs);

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
