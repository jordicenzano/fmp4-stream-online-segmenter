const builder = require('xmlbuilder');
const path = require('path');

"use strict";

//Allowed manifest types
const enManifestType = {
    SegmentList: "segment_list"
};

class dashManifest {
    constructor(manifest_type, media_file_url, options) {

        this.chunks_info = [];
        this.media_info_chunk_info = null;
        this.moov_data_tree = null;

        this.media_file_url = media_file_url;
        this.is_splitting_chunks = false;
        this.is_using_relative_path = false;

        if (manifest_type !== enManifestType.SegmentList) {
            throw new Error("No supported manifest type: " + manifest_type)
        }
        this.manifest_type = manifest_type;

        if (typeof (options) === 'object') {
            if (options.is_splitting_chunks === true)
                this.is_splitting_chunks = true;

            if (options.is_using_relative_path === true)
                this.is_using_relative_path = true;
        }

        this.dash_data = {
            type: "static",
            xmlns: "urn:mpeg:dash:schema:mpd:2011",
            minBufferTime: 1.5,  //"PT2S"
            profiles: "urn:mpeg:dash:profile:isoff-main:2011",

            mediaPresentationDuration: 0,//"PT0H0M15S"

            video: {
                id: "video01",
                mime_type: "video/mp4",
                codec_str: "",
                bandwidth: -1,
                timebase: -1
            },

            video_chunks: []
        };
    }

    _getChunkInfo(chunk) {
        //Get chunk info
        const chunk_info = {
            filename: chunk.chunk_data.getFileName(),
            //filename_ghost: chunk.chunk_data.getFileNameGhost(),
            index: chunk.chunk_data.getIndex(),
            start_offset: chunk.chunk_data.getOriginalFileOffset(),
            size: chunk.chunk_data.getSize(),
            type: chunk.type,
            duration_tb: chunk.chunk_data.getDuration(),
            base_media_decode_time_tb: chunk.chunk_data.getBaseMediaDecodeTime(),
        };

        return chunk_info;
    }

    _getRangeStr(offset, size) {
        return offset.toString() + '-' + (offset + (size -1)).toString();
    }

    _calcDuration() {
        let dur_tb = 0;

        for (let n = 0; n < this.chunks_info.length; n++) {
            dur_tb += this.chunks_info[n].duration_tb;
        }

        return dur_tb;
    }

    _caclBW(duration_s) {
        let size_b = 0;

        for (let n = 0; n < this.chunks_info.length; n++) {
            size_b += this.chunks_info[n].size;
        }

        return Math.ceil(size_b / duration_s);
    }

    _getChunkLongerDuration() {
        let chunk_longer_dur_tb = 0;

        for (let n = 0; n < this.chunks_info.length; n++) {
            chunk_longer_dur_tb = Math.max(chunk_longer_dur_tb, this.chunks_info[n].duration_tb);
        }

        return chunk_longer_dur_tb;
    }

    setMediaIniInfo (chunk, moov_data_tree) {
        this.media_info_chunk_info = this._getChunkInfo(chunk);
        this.moov_data_tree = moov_data_tree;

        //TODO: Get audio data too
        this.dash_data.video.timebase = this.moov_data_tree.getVideoTimescale();
        this.dash_data.video.codec_str = this.moov_data_tree.getVideoCodecStr();
    }

    addVideoChunk (chunk) {
        this.chunks_info.push(this._getChunkInfo(chunk));
    }

    toString() {
        let ret = "";

        if ((this.media_info_chunk_info === null) || (this.moov_data_tree === null) || (this.chunks_info.length <= 0))
            return ret;

        const duration_tb = this._calcDuration();
        const duration_s = duration_tb / this.dash_data.video.timebase;
        const video_bw = this._caclBW(duration_s);

        const chunk_longer_duration_tb = this._getChunkLongerDuration();

        const root = builder.create('MPD', { encoding: 'utf-8' });
        root.att('type', this.dash_data.type);
        root.att('xmlns', this.dash_data.xmlns);
        root.att('minBufferTime', 'PT' + Math.min(duration_s, this.dash_data.minBufferTime).toString() + 'S');
        root.att('mediaPresentationDuration', 'PT' + duration_s.toString() + 'S');
        root.att('profiles', this.dash_data.profiles);
        root.ele('BaseURL', './').up();

        const period0 = root.ele('Period', {'start': 'PT0S'});
        const adaptation_set = period0.ele('AdaptationSet');

        const representation = adaptation_set.ele('Representation');
        representation.att('id', this.dash_data.video.id);
        representation.att('mimeType', this.dash_data.video.mime_type);
        representation.att('codecs', this.dash_data.video.codec_str);
        representation.att('bandwidth', video_bw.toString());

        const segment_list = representation.ele('SegmentList');
        segment_list.att('timescale', this.dash_data.video.timebase);
        segment_list.att('duration', chunk_longer_duration_tb);
        const segment_list_ini = segment_list.ele('Initialization');

        if (this.is_splitting_chunks === false) {
            segment_list_ini.att('sourceURL', this.media_file_url);
            segment_list_ini.att('range', this._getRangeStr(this.media_info_chunk_info.start_offset, this.media_info_chunk_info.size));
        }
        else {
            let filename = this.media_info_chunk_info.filename;

            if (this.is_using_relative_path)
                filename = path.basename(filename);

            segment_list_ini.att('sourceURL', filename);
        }
        segment_list_ini.up();

        for (let n = 0; n < this.chunks_info.length; n++) {
            const seg_url = segment_list.ele('SegmentURL');

            const chunk_info = this.chunks_info[n];
            let filename = chunk_info.filename;

            if (this.is_splitting_chunks === false) {
                seg_url.att('media', this.media_file_url);
                seg_url.att('mediaRange', this._getRangeStr(chunk_info.start_offset, chunk_info.size));
            }
            else {
                let filename = chunk_info.filename;
                if (this.is_using_relative_path)
                    filename = path.basename(filename);

                seg_url.att('media', filename);
            }

            seg_url.up();
        }

        segment_list.up();

        representation.up();
        adaptation_set.up();
        period0.up();

        return root.end({ pretty: true });
    }
}

//Export class
module.exports.dash_manifest = dashManifest;
module.exports.enManifestType = enManifestType;
