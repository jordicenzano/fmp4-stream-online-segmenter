const fs = require('fs');
const path = require('path');

const assert = require('assert');

const underTest = require('../src/fmp4DashGenerator.js');
const enManifestType = require('../src/dashManifest.js').enManifestType;


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

    describe('generate a vod event manifest using range requests from video file and SegmentList', function () {

        it('ffmpeg generated fmp4 - read by big chunks and 4s chunk target dur', function (done) {
            let manifest_filename = path.join(out_path, path.parse(input_v_vod_file_name).name + '_event_block.mpd');

            let segmenter = new underTest.fmp4DashGenerator(false, "./", path.basename(input_v_vod_file_name), 4, enManifestType.SegmentList);

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

                    //Check manifest
                    assert.equal(data,`<?xml version="1.0" encoding="utf-8"?>
<MPD type="static" xmlns="urn:mpeg:dash:schema:mpd:2011" minBufferTime="PT1.5S" mediaPresentationDuration="PT15S" profiles="urn:mpeg:dash:profile:isoff-main:2011">
  <BaseURL>./</BaseURL>
  <Period start="PT0S">
    <AdaptationSet>
      <Representation id="video01" mimeType="video/mp4" codecs="avc1.42C00D" bandwidth="24596">
        <SegmentList timescale="15360" duration="61440">
          <Initialization sourceURL="source_15s_fmp4.mp4" range="0-766"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="767-69798"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="69799-170713"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="170714-282026"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="282027-369702"/>
        </SegmentList>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>`);

                    //Save manifest (for testing purposes)
                    //fs.writeFileSync(manifest_filename, data);

                    done();
                });
            });
        });

        it('ffmpeg generated fmp4 - read byte by byte and 4s chunk target dur', function (done) {
            let manifest_filename = path.join(out_path, path.parse(input_v_vod_file_name).name + '_event_byte.mpd');

            //Allow time to read & save a file byte by byte
            this.timeout(60000);

            let segmenter = new underTest.fmp4DashGenerator(false, "./", path.basename(input_v_vod_file_name), 4, enManifestType.SegmentList);

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

                    //Check manifest
                    assert.equal(data,`<?xml version="1.0" encoding="utf-8"?>
<MPD type="static" xmlns="urn:mpeg:dash:schema:mpd:2011" minBufferTime="PT1.5S" mediaPresentationDuration="PT15S" profiles="urn:mpeg:dash:profile:isoff-main:2011">
  <BaseURL>./</BaseURL>
  <Period start="PT0S">
    <AdaptationSet>
      <Representation id="video01" mimeType="video/mp4" codecs="avc1.42C00D" bandwidth="24596">
        <SegmentList timescale="15360" duration="61440">
          <Initialization sourceURL="source_15s_fmp4.mp4" range="0-766"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="767-69798"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="69799-170713"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="170714-282026"/>
          <SegmentURL media="source_15s_fmp4.mp4" mediaRange="282027-369702"/>
        </SegmentList>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>`);

                    //Save manifest (for testing purposes)
                    //fs.writeFileSync(manifest_filename, data);

                    done();
                });
            });
        });
    });

    describe('generate a VOD event chunklist and chunks from video file', function () {

        it('ffmpeg generated fmp4 - read by big chunks and 4s target dur', function (done) {
            let chunk_base_filename = 'test_with_chunks_event_';
            let manifest_filename = path.join(out_path, path.parse(input_v_vod_file_name).name + '_event.mpd');

            let segmenter = new underTest.fmp4DashGenerator(true, out_path, chunk_base_filename, 4);

            let readFileStream = new fs.createReadStream(input_v_vod_file_name);

            readFileStream.on("error", function () {
                assert.fail('error reading the file');
            });

            readFileStream.on("data", function (ts_packet_chunk) {

                segmenter.processDataChunk(ts_packet_chunk, function (err) {
                    assert.equal(err, null);
                });
            });

            readFileStream.on("end", function () {
                segmenter.processDataEnd(function (err, data) {
                    assert.equal(err, null);

                    //Check manifest
                    assert.equal(data,`<?xml version="1.0" encoding="utf-8"?>
<MPD type="static" xmlns="urn:mpeg:dash:schema:mpd:2011" minBufferTime="PT1.5S" mediaPresentationDuration="PT15S" profiles="urn:mpeg:dash:profile:isoff-main:2011">
  <BaseURL>./</BaseURL>
  <Period start="PT0S">
    <AdaptationSet>
      <Representation id="video01" mimeType="video/mp4" codecs="avc1.42C00D" bandwidth="24596">
        <SegmentList timescale="15360" duration="61440">
          <Initialization sourceURL="test_with_chunks_event_00000.mp4"/>
          <SegmentURL media="test_with_chunks_event_00001.mp4"/>
          <SegmentURL media="test_with_chunks_event_00002.mp4"/>
          <SegmentURL media="test_with_chunks_event_00003.mp4"/>
          <SegmentURL media="test_with_chunks_event_00004.mp4"/>
        </SegmentList>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>`);

                    //Save chunklist (for testing purposes)
                    fs.writeFileSync(manifest_filename, data);

                    //Check chunk files
                    const chunk0_init_filename = path.join(out_path, chunk_base_filename + '00000.mp4');
                    const chunk1_filename = path.join(out_path, chunk_base_filename + '00001.mp4');
                    const chunk2_filename = path.join(out_path, chunk_base_filename + '00002.mp4');
                    const chunk3_filename = path.join(out_path, chunk_base_filename + '00003.mp4');
                    const chunk4_filename = path.join(out_path, chunk_base_filename + '00004.mp4');

                    assert.equal(fs.existsSync(chunk0_init_filename), true, "File init existence");
                    assert.equal(fs.existsSync(chunk1_filename), true, "File chunk1 existence");
                    assert.equal(fs.existsSync(chunk2_filename), true, "File chunk2 existence");
                    assert.equal(fs.existsSync(chunk3_filename), true, "File chunk3 existence");
                    assert.equal(fs.existsSync(chunk4_filename), true, "File chunk4 existence");

                    assert.equal(fs.statSync(chunk0_init_filename).size, 743);
                    assert.equal(fs.statSync(chunk1_filename).size, 69032);
                    assert.equal(fs.statSync(chunk2_filename).size, 100915);
                    assert.equal(fs.statSync(chunk3_filename).size, 111313);
                    assert.equal(fs.statSync(chunk4_filename).size, 87343);

                    done();
                });
            });
        });
    });

    //TODO: add more time line & tests. And add audio
    /*
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

    describe('generate a live event chunklist and chunks from video-audio file', function () {

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
