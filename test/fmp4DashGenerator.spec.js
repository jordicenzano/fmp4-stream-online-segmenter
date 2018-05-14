const fs = require('fs');
const path = require('path');

const assert = require('assert');

const underTest = require('../src/fmp4DashGenerator.js');

const moduleDir = __dirname;

describe('fmp4-chunklist-generator', function() {

    let input_v_vod_file_name = path.join(moduleDir,'fixtures/source_15s_fmp4.mp4');
    let input_av_vod_file_name = path.join(moduleDir,'fixtures/sourceAV_15s_fmp4.mp4');
    let base_path = moduleDir; //Test dir
    let out_path = path.join(base_path, 'results');

    //Clean results directory
    before(function() {
        fs.readdir(out_path, function (err, files) {
            if (!err) {
                for (var i = 0, len = files.length; i < len; i++) {
                    var match = files[i].match(/.*\.mp4|.*\.mpd/);
                    if(match !== null)
                        fs.unlinkSync(path.join(out_path,match[0]));
                }
            }
        });
    });

    describe('generate a live event chunklist and chunks from video file', function () {

        it('ffmpeg generated fmp4 - read by big chunks', function (done) {
            let chunk_base_filename = 'test_with_chunks_event_';
            let chunklist_filename = path.join(out_path, path.parse(input_v_vod_file_name).name + '_event.mpd');

            let segmenter = new underTest.fmp4DashGenerator(true, out_path, chunk_base_filename, 4);

            let readFileStream = new fs.createReadStream(input_v_vod_file_name);

            readFileStream.on("error", function() {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function(ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    assert.equal(err, null);
                });
            });

            readFileStream.on("end", function() {
                segmenter.processDataEnd(function (err, data) {
                    assert.equal(err, null);

                    //Check chunklist
                    //assert.equal(data,'');

                    //Save chunklist (for testing purposes)
                    //fs.writeFileSync(chunklist_filename, data);

                    //Check chunk files
                    const chunk0_init_filename = path.join(out_path, chunk_base_filename + '00000.mp4');
                    const chunk1_filename = path.join(out_path, chunk_base_filename + '00001.mp4');
                    const chunk2_filename = path.join(out_path, chunk_base_filename + '00002.mp4');

                    assert.equal(fs.existsSync(chunk0_init_filename), true, "File init existence");
                    assert.equal(fs.existsSync(chunk1_filename), true, "File chunk0 existence");
                    assert.equal(fs.existsSync(chunk2_filename), true, "File chunk1 existence");

                    assert.equal(fs.statSync(chunk0_init_filename).size, 743);
                    assert.equal(fs.statSync(chunk1_filename).size, 170171);
                    assert.equal(fs.statSync(chunk2_filename).size, 198432);

                    done();
                });
            });
        });

        it('ffmpeg generated fmp4 - read byte by byte', function (done) {
            //Allow time to read & save a file byte by byte
            this.timeout(60000);

            let chunk_base_filename = 'test_with_chunks_byte_event_';
            let chunklist_filename = path.join(out_path, path.parse(input_v_vod_file_name).name + '_event.mpd');

            let segmenter = new underTest.fmp4DashGenerator(true, out_path, chunk_base_filename, 4);

            let readFileStream = new fs.createReadStream(input_v_vod_file_name, { highWaterMark: 1 });

            readFileStream.on("error", function() {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function(ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    assert.equal(err, null);
                });
            });

            readFileStream.on("end", function() {
                segmenter.processDataEnd(function (err, data) {
                    assert.equal(err, null);

                    //Check chunklist
                    //assert.equal(data,'');

                    //Save chunklist (for testing purposes)
                    //fs.writeFileSync(chunklist_filename, data);

                    //Check chunk files
                    //Check chunk files
                    const chunk0_init_filename = path.join(out_path, chunk_base_filename + '00000.mp4');
                    const chunk1_filename = path.join(out_path, chunk_base_filename + '00001.mp4');
                    const chunk2_filename = path.join(out_path, chunk_base_filename + '00002.mp4');

                    assert.equal(fs.existsSync(chunk0_init_filename), true, "File init existence");
                    assert.equal(fs.existsSync(chunk1_filename), true, "File chunk0 existence");
                    assert.equal(fs.existsSync(chunk2_filename), true, "File chunk1 existence");

                    assert.equal(fs.statSync(chunk0_init_filename).size, 743);
                    assert.equal(fs.statSync(chunk1_filename).size, 170171);
                    assert.equal(fs.statSync(chunk2_filename).size, 198432);

                    done();
                });
            });
        });
    });

    //TODO: AV interleaved in NOT working we need to generate 2 files
    //TODO: We need to extract (see mater_min.xml):
    // codec_tags from media
    // timestamps to indicate the TS
    // BW easy calculating 1st chunk size

    /*describe('generate a live event chunklist and chunks from video-audio file', function () {

        it('ffmpeg generated fmp4 - read by big chunks', function (done) {
            let chunk_base_filename = 'test_with_chunks_event_av_';
            let chunklist_filename = path.join(out_path, path.parse(input_av_vod_file_name).name + '_event.mpd');

            let segmenter = new underTest.fmp4DashGenerator(true, out_path, chunk_base_filename, 4);

            let readFileStream = new fs.createReadStream(input_av_vod_file_name);

            readFileStream.on("error", function() {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function(ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    assert.equal(err, null);
                });
            });

            readFileStream.on("end", function() {
                segmenter.processDataEnd(function (err, data) {
                    assert.equal(err, null);

                    //Check chunklist
                    //assert.equal(data,'');

                    //Save chunklist (for testing purposes)
                    //fs.writeFileSync(chunklist_filename, data);

                    //Check chunk files
                    const chunk0_init_filename = path.join(out_path, chunk_base_filename + '00000.mp4');
                    const chunk1_filename = path.join(out_path, chunk_base_filename + '00001.mp4');
                    const chunk2_filename = path.join(out_path, chunk_base_filename + '00002.mp4');

                    assert.equal(fs.existsSync(chunk0_init_filename), true, "File init existence");
                    assert.equal(fs.existsSync(chunk1_filename), true, "File chunk0 existence");
                    assert.equal(fs.existsSync(chunk2_filename), true, "File chunk1 existence");

                    //assert.equal(fs.statSync(chunk0_init_filename).size, 743);
                    //assert.equal(fs.statSync(chunk1_filename).size, 170171);
                    //assert.equal(fs.statSync(chunk2_filename).size, 198432);

                    done();
                });
            });
        });

        it('ffmpeg generated fmp4 - read byte by byte', function (done) {
            //Allow time to read & save a file byte by byte
            this.timeout(60000);

            let chunk_base_filename = 'test_with_chunks_byte_event_av_';
            let chunklist_filename = path.join(out_path, path.parse(input_av_vod_file_name).name + '_event.mpd');

            let segmenter = new underTest.fmp4DashGenerator(true, out_path, chunk_base_filename, 4);

            let readFileStream = new fs.createReadStream(input_av_vod_file_name, { highWaterMark: 1 });

            readFileStream.on("error", function() {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function(ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    assert.equal(err, null);
                });
            });

            readFileStream.on("end", function() {
                segmenter.processDataEnd(function (err, data) {
                    assert.equal(err, null);

                    //Check chunklist
                    //assert.equal(data,'');

                    //Save chunklist (for testing purposes)
                    //fs.writeFileSync(chunklist_filename, data);

                    //Check chunk files
                    //Check chunk files
                    const chunk0_init_filename = path.join(out_path, chunk_base_filename + '00000.mp4');
                    const chunk1_filename = path.join(out_path, chunk_base_filename + '00001.mp4');
                    const chunk2_filename = path.join(out_path, chunk_base_filename + '00002.mp4');

                    assert.equal(fs.existsSync(chunk0_init_filename), true, "File init existence");
                    assert.equal(fs.existsSync(chunk1_filename), true, "File chunk0 existence");
                    assert.equal(fs.existsSync(chunk2_filename), true, "File chunk1 existence");

                    //assert.equal(fs.statSync(chunk0_init_filename).size, 743);
                    //assert.equal(fs.statSync(chunk1_filename).size, 170171);
                    //assert.equal(fs.statSync(chunk2_filename).size, 198432);

                    done();
                });
            });
        });
    });*/
});
