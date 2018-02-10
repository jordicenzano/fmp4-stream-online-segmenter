//Jordi Cenzano 2018
const fs = require('fs');

"use strict";

//Atom header size
const ATOM_SHORT_HEADER_SIZE = 8;

//Atoms IDs
const enAtomTypes = {
    ALL: 'ALL',
    MOOV: 'moov',
    MOOF: 'moof',
    MDAT: 'mdat'
};

// Constructor
class mp4Atom {

    constructor(atom_types_to_save) {

        this.header = null;
        this.header_data = new Buffer.alloc(ATOM_SHORT_HEADER_SIZE);
        this.header_data_length = 0;
        this.is_header_saved = false;
        this.atom_types_to_save = atom_types_to_save;

        this.bytes_to_next = -1;

        this.data = null;
    }

    static decodeAtomHeader(atomHeader) {
        return {
            size: atomHeader.readInt32BE(0),
            type: atomHeader.toString('ascii', 4, 8)
        };
    }

    getHeaderSize() {
        let ret = -1;

        if (this.header_data != null)
            ret = this.header_data_length;

        return ret;
    }

    getSize() {
        let ret = -1;

        if (this.header_data_length >= ATOM_SHORT_HEADER_SIZE)
            ret = this.header_data_length + this.data.length;

        return ret;
    }

    getType() {
        let ret = '';

        if (this.header != null)
            ret = this.header.type;

        return ret;
    }

    _addBytesToAtomHeader(src, src_pos) {
        let src_pos_int = 0;
        if (typeof (src_pos) === 'number')
            src_pos_int = src_pos;

        //Add all header bytes, or all bytes to the end of the chunk
        const added_length = Math.min(ATOM_SHORT_HEADER_SIZE - this.header_data_length, src.length - src_pos_int);
        src.copy(this.header_data, this.header_data_length, src_pos_int, src_pos_int + added_length);

        this.header_data_length += added_length;

        //Decode header if complete
        if (this.header_data_length >= ATOM_SHORT_HEADER_SIZE) {
            this.header = mp4Atom.decodeAtomHeader(this.header_data);
            this.bytes_to_next = this.header.size;
        }

        return added_length;
    }

    _addBytes(file, src, start, end) {
        let ret = 0;

        if ((typeof (start) === 'number') && (typeof (end) === 'number')) {
            ret = end - start;

            if ((ret > 0) && (file != null))
                fs.writeSync(file, src, start, ret);
        }
        else if ((typeof (start) === 'number') && (typeof (end) != 'number')) {
            ret = src.length - start;

            if ((ret > 0)&& (file != null))
                fs.writeSync(file, src, start);
        }
        else {
            ret = src.length;

            if ((ret > 0) && (file != null))
                fs.writeSync(file, src);
        }

        return ret;
    }

    isAtomHeaderComplete() {
        return (this.header_data_length >= ATOM_SHORT_HEADER_SIZE);
    }

    isAtomComplete() {
        return (this.bytes_to_next === 0);
    }

    isSaved() {
        return this._saveAtom();
    }

    _saveAtom() {
        let ret = false;

        if ((this.header != null) && (this.atom_types_to_save.indexOf(this.header.type) >= 0))
            ret = true;

        return ret;
    }

    addBytesToAtom (file, src, start, end) {
        let written_header = 0;
        let written_data = 0;

        if (!this.isAtomHeaderComplete())
            written_header = this._addBytesToAtomHeader(src, start);

        //The only reason header is not complete is hit the end of the chunk
        if (this.isAtomHeaderComplete()) {
            if (!this.is_header_saved) {
                this.bytes_to_next -= ATOM_SHORT_HEADER_SIZE;
                this.is_header_saved = true;

                if (this._saveAtom())
                    this._addBytes(file, this.header_data);
            }


            let start_int = written_header;
            if (typeof (start) === 'number')
                start_int = start + written_header;

            let end_int = src.length;
            if (typeof (end) === 'number')
                end_int = end;

            const end_atom_int = Math.min(start_int + this.bytes_to_next, end_int);

            if (this._saveAtom())
                written_data = this._addBytes(file, src, start_int, end_atom_int);
            else
                written_data = (end_atom_int - start_int);

            this.bytes_to_next -= written_data;
        }

        return written_data + written_header;
    }
}

//Export class
module.exports.mp4Atom = mp4Atom;
module.exports.enAtomTypes = enAtomTypes;
