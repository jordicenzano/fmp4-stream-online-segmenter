const fs = require('fs');
const path = require('path');
const Cmp4Atom = require('./mp4Atom.js');
const enAtomNames = require('./mp4AtomParser.js').enAtomNames;

"use strict";

const GHOST_PREFIX_DEFAULT = ".growing_";
const FILE_NUMBER_LENGTH_DEFAULT = 5;
const FILE_CHUNK_EXTENSION_DEFAULT = ".mp4";

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};

class fmp4Chunk {

    constructor(index, timebase, options) {

        this.index = index;

        this.duration_tb = 0;
        this.timebase = timebase;
        this.base_media_decode_time_tb = 0;

        this.is_writing_chunks = false;

        this.currentAtom = null;

        this.file_offset = -1;
        this.size = 0;

        if ((options != null) && (typeof (options) === 'object')) {

            if (("is_writing_chunks" in options) && (typeof(options.is_writing_chunks) === 'boolean'))
                this.is_writing_chunks = options.is_writing_chunks;

            let ghost_prefix = GHOST_PREFIX_DEFAULT;
            if (("ghost_prefix" in options) && (typeof(options.ghost_prefix) === 'string'))
                ghost_prefix = options.ghost_prefix;

            let file_number_length = FILE_NUMBER_LENGTH_DEFAULT;
            if (("file_number_length" in options) && (typeof(options.file_number_length) === 'number'))
                file_number_length = options.file_number_length;

            let file_extension = FILE_CHUNK_EXTENSION_DEFAULT;
            if (("file_extension" in options) && (typeof(options.file_extension) === 'string'))
                file_extension = options.file_extension;

            this.filename = this._createFilename(options.base_path, options.chunk_base_file_name, index, file_number_length, file_extension);
            this.filename_ghost = this._createFilename(options.base_path, options.chunk_base_file_name, index, file_number_length, file_extension, ghost_prefix);

            this.verbose = false;
            if (("verbose" in options) && (options.verbose === true)) 
                this.verbose = true;

            if (this.is_writing_chunks) {
                //Create ghost file indicting is growing
                fs.writeFileSync(this.filename_ghost, "");

                if (this.verbose)
                    console.log("Creating new chunk file: " + this.filename);
            }

            //Create growing file
            this.curr_file = null;
        }
    }

    close() {
        if (this.is_writing_chunks === true) {
            if (this.curr_file != null) {
                fs.closeSync(this.curr_file);
                this.curr_file = null;
            }

            if (this.filename_ghost != null) {
                if (fs.existsSync(this.filename_ghost))
                    fs.unlinkSync(this.filename_ghost);
            }
        }
    }

    createNewAtom(atom_types_to_save, file_offset, aggregated_dur_tb = 0, base_media_decode_time_tb = 0) {
        if (this.currentAtom != null)
            this._closeAtom();

        if (!Array.isArray(atom_types_to_save))
            atom_types_to_save = [enAtomNames.ALL];

        if (this.file_offset < 0)
            this.file_offset = file_offset;

        this.duration_tb += aggregated_dur_tb;

        this.base_media_decode_time_tb = base_media_decode_time_tb;

        this.currentAtom = new Cmp4Atom.mp4Atom(atom_types_to_save, file_offset, this.verbose);
    }

    _closeAtom() {
        this.currentAtom = null;
    }

    closeAtom() {
        //Process if necessary

        this._closeAtom();
    }

    getCurrentAtom(){
        return this.currentAtom;
    }

    addAtomData(data, start, end) {
        let written = 0;

        if ( this.currentAtom != null) {

            //Create chunkfile if is not there
            if (this.is_writing_chunks === true) {
                if (this.curr_file === null) {
                    //Create growing file
                    this.curr_file = fs.openSync(this.filename, 'w');

                    if (this.verbose)
                        console.log("Starting adding data to: " + this.filename);
                }
            }

            //Save data to atom / file
            written = this.currentAtom.addBytesToAtom(this.curr_file, data, start, end);

            this.size = this.size + written;
        }

        return written;
    }

    getIndex() {
        return this.index;
    }

    getFileName() {
        return this.filename;
    }

    getDurationSec() {
        return this.duration_tb / this.timebase;
    }

    getDuration() {
        return this.duration_tb;
    }

    getTimeBase() {
        return this.timebase;
    }

    getBaseMediaDecodeTime() {
        return this.base_media_decode_time_tb;
    }

    getFileNameGhost() {
        return this.filename_ghost;
    }

    _createFilename(base_path, chunk_base_file_name, index, file_number_length, file_extension, ghost_prefix) {
        let ret = "";

        if (typeof (ghost_prefix) === 'string')
            ret = path.join(base_path, ghost_prefix + chunk_base_file_name + index.pad(file_number_length) + file_extension);
        else
            ret = path.join(base_path, chunk_base_file_name + index.pad(file_number_length) + file_extension);

        return ret;
    }

    getOriginalFileOffset () {
        return this.file_offset;
    }

    getSize () {
        return this.size;
    }
}

//Export class
module.exports.fmp4Chunk = fmp4Chunk;
