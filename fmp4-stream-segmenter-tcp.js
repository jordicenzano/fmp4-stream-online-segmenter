#!/usr/bin/env node

//Jordi Cenzano 2017

const fs = require('fs');
const path = require('path');
const net = require('net');
const dashGenerator = require('./src/fmp4DashGenerator');

"use strict";

// Check input arguments
if (process.argv.length < 4) {
    console.log('Use: ./fmp4-stream-segmenter-tcp.js PORT BASE_OUTPUT_PATH CHUNK_BASE_FILENAME MANIFEST_FILENAME [TARGET_DUR_S] [BIND_ADDRESS] [CHUNKLIST_TYPE]');
    console.log('Example: ./fmp4-stream-segmenter-tcp.js 5000 /tmp media_ out.dash 4 127.0.0.1 SegmentList');
    process.exit(1);
}

//TODO: Not tested yet
//TODO: Create correct manifest for live

//Get conf filename
const port = process.argv[2];
const base_path = process.argv[3];
const chunk_base_filename = process.argv[4];
const manifest_file_name = process.argv[5];

let target_dur_s = 4; //Default
if (process.argv.length > 6)
    target_dur_s = Number.parseInt(process.argv[6], 10);

let bind_addr = "";
if (process.argv.length > 7)
    bind_addr = process.argv[7];

let manifest_type = "SegmentList";
if (process.argv.length > 8)
    manifest_type = process.argv[8];

//Manifest full path
const out_manifest_file = path.join(base_path, manifest_file_name);

//Function saves chunklist file
function saveChunklist(file_name, data) {
    fs.writeFileSync(file_name, data);

    console.log ("Saved new manifest on: " + file_name);
}

//Create TCP server
const server = net.createServer(function(socket) {
    //NEW CONNECTION!

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;

    console.log("Connected: " + socket.name);

    //Instantiate class
    let segmenter = new dashGenerator.fmp4DashGenerator(true, base_path, chunk_base_filename, target_dur_s, manifest_type);

    //Add chunk listener
    //TODO: create callback for ech chunk
    segmenter.setDataCallbacks(this, null, function (data) {
        saveChunklist(out_manifest_file, data);
    });

    // Handle incoming messages from clients.
    socket.on('data', function (chunk) {
        segmenter.processDataChunk(chunk, function (err) {
            if (err) {
                socket.destroy();
                console.error(err);
            }
        });
    });

    // Remove the client from the list when it leaves
    socket.on('end', function () {
        segmenter.processDataEnd(function (err, data) {
            if (err)
                console.error(err);

            saveChunklist(out_manifest_file, data);

            console.log("Finished! Created: " + out_manifest_file);
        });
    });

    // Error
    socket.on('error', function (err) {
        console.error(err);
    });
});

if (bind_addr != "") {
    server.listen(port, bind_addr);
    console.log("Server listening on port: " + port.toString());
}
else {
    server.listen(port);
    console.log("Server listening on port: " + port.toString() + ". BindAddr: " + bind_addr);
}
