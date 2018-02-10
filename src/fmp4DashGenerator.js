const Cfmp4Chunk = require('./fmp4Chunk.js');
const mp4Atom = require('./mp4Atom.js');

const enChunkType = {
    LAST: 'last',
    INIT: 'init',
    REGULAR: 'regular'
};

class fmp4DashGenerator {

    constructor(is_creating_chunks, base_path, chunk_base_filename, target_segment_dur_s, chunklist_type, live_window_size) {
        this.is_creating_chunks = is_creating_chunks;
        this.base_path = base_path;
        this.chunk_base_filename = chunk_base_filename;
        this.target_segment_dur_s = target_segment_dur_s;

        this.verbose = true;

        this.atoms_to_save = [mp4Atom.enAtomTypes.MOOV];
        this.current_chunk = {
            chunk_data: null,
            current_index: 0
        };

        this.is_moov_header_saved = false;
        this.tmp_moof_counter = 0; //TODO:
    }

    processDataChunk(data, callback) {
        try {
            this._process_data_chunk_v2(data);
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

            //this.result_chunklist = this.chunklist_generator.toString(true);
        }
        catch (err) {
            return callback(err, null);
        }

        return callback(null, this.result_chunklist);
    }

    _createNewChunk(type) {
        //Close current chunk
        if (this.current_chunk.chunk_data != null)
            this.current_chunk.chunk_data.close();

        this.tmp_moof_counter = 0;

        //Create new chunk if necessary
        if ((typeof (type) === 'undefined') || (type != enChunkType.LAST)) {
            const chunk_options = {
                base_path: this.base_path,
                chunk_base_file_name: this.chunk_base_filename,
                is_writing_chunks: this.is_creating_chunks,
            };

            this.current_chunk.chunk_data = new Cfmp4Chunk.fmp4Chunk(this.current_chunk.current_index, chunk_options);
            this.current_chunk.current_index++;
        }
    }

    _process_data_chunk_v2(data) {
        if (this.current_chunk.chunk_data === null) {
            this._createNewChunk(enChunkType.INIT);
            this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save);
        }

        let currentPosReader = 0;

        while (currentPosReader < data.length) {
            const added = this.current_chunk.chunk_data.addAtomData(data, currentPosReader);
            currentPosReader += added;

            const currentAtom = this.current_chunk.chunk_data.getCurrentAtom();
            if (currentAtom.isAtomComplete()) {

                if (this.verbose) {
                    if (currentAtom.isSaved())
                        console.log("Atom saved: " + currentAtom.getType());
                    else
                        console.log("Atpm skipped: " + currentAtom.getType());
                }

                if ((currentAtom.getType() === mp4Atom.enAtomTypes.MOOV) && (this.atoms_to_save.indexOf(mp4Atom.enAtomTypes.MOOV) >= 0)) {
                    this.atoms_to_save = [mp4Atom.enAtomTypes.MOOF,mp4Atom.enAtomTypes.MDAT];
                    this._createNewChunk(enChunkType.REGULAR);
                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save);
                }
                else if (currentAtom.getType() === mp4Atom.enAtomTypes.MOOF) {
                    if (this.tmp_moof_counter > 7) {//TODO: Max MOOF per chunk should be 1 to avoid problems in players
                        this._createNewChunk(enChunkType.REGULAR);
                        this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save);
                    }
                    else {
                        this.tmp_moof_counter++;
                        this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save);
                    }
                }
                else {
                    this.current_chunk.chunk_data.createNewAtom(this.atoms_to_save);
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
