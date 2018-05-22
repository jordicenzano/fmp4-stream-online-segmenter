#!/usr/bin/env node

//Jordi Cenzano 2018

const fs = require('fs');
const path = require('path');
const dashGenerator = require('./src/fmp4DashGenerator');

"use strict";

// Check input arguments
if (process.argv.length < 4) {
    console.log("Use: ./fmp4-stream-segmenter-cli.js INPUT_TS OUTPUT_MANIFEST [TARGET_DUR_S]");
    console.log("Example: ./fmp4-stream-segmenter-cli.js /tmp/input.fmp4 /tmp/out.mpd 4");
    process.exit(1);
}

//Get conf filename
const input_fmp4_file = process.argv[2];
const out_manifest_file = process.argv[3];
let target_dur_s = 4; //Default
if (process.argv.length > 4)
    target_dur_s = Number.parseInt(process.argv[4], 10);

const base_path = path.dirname(out_manifest_file);

//Instantiate class
let segmenter = new dashGenerator.fmp4DashGenerator(false, base_path, input_fmp4_file, target_dur_s);

//Create file reader
const readStream = fs.createReadStream(input_fmp4_file);

readStream.on('data', function (chunk) {

    segmenter.processDataChunk(chunk, function (err) {
        if (err) {
            readStream.destroy();
            console.error(err);
            return 1;
        }
    });
});

readStream.on('end', function () {
    segmenter.processDataEnd(function (err, manifest) {
        if (err) {
            console.error(err);
            return 1;
        }

        fs.writeFileSync(out_manifest_file, manifest);

        console.log("Finished! Created: " + out_manifest_file);
        return 0;
    });
});

readStream.on('error', function (err) {
    console.error(err);
    return 1;
});

