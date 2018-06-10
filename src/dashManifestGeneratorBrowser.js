const http = require("http");
const https = require("https");
const dashGenerator = require('./fmp4DashGenerator.js');

"use strict";

const enUITracks = {
    UI_VIDEO: 'video',
    UI_AUDIO_01: 'audio01'
};

function checkFileAPI() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    }
    else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

function manifestGeneratorBrowser(is_url, source, target_duration, final_callback, progress_callback) {
    let file_name_url = source.name;
    let processFunction = parseFile;
    if (is_url === true) {
        file_name_url = source;
        processFunction = parseURL
    }

    //Instantiate class
    let segmenter = new dashGenerator.fmp4DashGenerator(false, './', file_name_url, target_duration);

    processFunction(source, function (err, data_chunk, read, total) {
        if (err) {
            return final_callback(err, null);
        }
        else {
            if (data_chunk !== null) {
                //Process data chunk
                segmenter.processDataChunk(data_chunk, function (err) {
                    if (err)
                        return final_callback(err, null);

                    if (typeof (progress_callback) === 'function')
                        return progress_callback(read, total);
                });
            }
            else {
                //END
                segmenter.processDataEnd(function (err, chunklist) {
                    if (err)
                        return final_callback(err, null);

                    return final_callback(null, chunklist);
                });
            }
        }
    });
}

function onFileSelectHandle(evt) {
    let elememt_src_name = null;
    let elememt_dst_name = null;

    if (this.ui_track_type === enUITracks.UI_VIDEO) {
        elememt_src_name = 'input-video-file';
        elememt_dst_name = 'input-video-file-label';

        //Enable process
        document.getElementById('input-process').removeAttribute('disabled')
    }
    else if (this.ui_track_type === enUITracks.UI_AUDIO_01) {
        elememt_src_name = 'input-audio-file';
        elememt_dst_name = 'input-audio-file-label';
    }

    if ((elememt_src_name !== null) && (elememt_dst_name !== null)) {
        let source = document.getElementById(elememt_src_name).files[0];

        //Show file name
        if (source !== null)
            document.getElementById(elememt_dst_name).value = source.name;
    }
}

function onProcessClick() {
    let video_is_url = false;
    let video_source = null;
    let audio_is_url = false;
    let audio_source = null;

    //Get video
    if (document.getElementById('input-video-file-local').checked === true) {
        video_is_url = false;
        video_source = document.getElementById('input-video-file').files[0];

    }
    else if (document.getElementById('input-video-file-url').checked === true) {
        video_is_url = true;
        video_source = document.getElementById('input-video-url').value;
    }

    //Get audio
    if (document.getElementById('input-audio-file-local').checked === true) {
        audio_is_url = false;
        audio_source = document.getElementById('input-audio-file').files[0];

    }
    else if (document.getElementById('input-audio-file-url').checked === true) {
        audio_is_url = true;
        audio_source = document.getElementById('input-audio-url').value;
    }

    //TODO: Add audio file data

    if (video_source !== null)
        startfmp4WebProcess(video_is_url, video_source);
}

function startfmp4WebProcess(is_url, source) {

    let elemTargetDur = document.getElementById('target_dur_s');
    let target_dur = elemTargetDur.options[elemTargetDur.selectedIndex].value;

    if (source !== null) {
        console.log("Reading source!");

        let final_callback = function (err, data) {
            if (err) {
                showError(err);
            }
            else {
                showResult(data);
            }
        };

        let progress_callback = function (read, total) {
            showResult('Processed: ' + read.toString() + '/' + total.toString());
        };

        manifestGeneratorBrowser(is_url, source, target_dur, final_callback, progress_callback);
    }
}

//From: https://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks
function parseFile(file, callback) {
    let fileSize   = file.size;
    let chunkSize  = 64 * 1024; // 64Kbytes
    let offset     = 0;
    let chunkReaderBlock = null;

    let readEventHandler = function(evt) {
        if (evt.target.error !== null) {
            console.error("Read error: " + evt.target.error);
            return  callback(evt.target.error, null);
        }

        offset += evt.target.result.byteLength;

        if (offset > 0) {
            let buff= Buffer.from(evt.target.result);

            callback(null, buff, offset, fileSize); // callback for handling read chunk
        }

        if (offset >= fileSize) {
            console.log("Done reading file");
            return callback(null, null, offset, fileSize);
        }

        //Next chunk
        chunkReaderBlock(offset, chunkSize, file);
    };

    chunkReaderBlock = function(_offset, length, _file) {
        let r = new FileReader();
        let blob = _file.slice(_offset, length + _offset);
        r.onload = readEventHandler;
        r.readAsArrayBuffer(blob);
    };

    // now let's start the read with the first block
    chunkReaderBlock(offset, chunkSize, file);
}

function parseURL(url, callback) {
    let fileSize   = -1;
    let offset     = 0;

    let prot = https;
    if (url.toLowerCase().search("http:") === 0)
        prot = http;

    return prot.get(url, function (response) {
        if (fileSize < 0)
            fileSize = parseInt(response.headers['content-length']);

        //NO redirects
        if (response.statusCode >= 300) {
            let err = new Error("Response status:" + response.statusCode);
            return callback(err); // callback for handling read chunk
        }

        response.on('data', function (chunk) {
            offset += chunk.length;

            callback(null, chunk, offset, fileSize); // callback for handling read chunk
        });

        response.on('end', function () {
            console.log("Done reading file");
            return callback(null, null, offset, fileSize);
        });

        response.on('end', function () {
            console.log("Done reading file");
            return callback(null, null, offset, fileSize);
        });
    });
}

function showError(msg) {
    showResult(msg);
}

function showResult(data) {

    document.getElementById('result').innerHTML = '<pre><code>' +  escapeHtml(data.toString()) + '</code></pre>';
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function onFileSourceChange() {
    let element_chk_local_name = null;
    let element_chk_url_name = null;
    let element_file_name = null;
    let element_url_name = null;

    if (this.ui_track_type === enUITracks.UI_VIDEO) {
        element_chk_local_name = 'input-video-file-local';
        element_chk_url_name = 'input-video-file-url';
        element_file_name = 'input-video-file-grp';
        element_url_name = 'input-video-url-grp';
    }
    else if (this.ui_track_type === enUITracks.UI_AUDIO_01) {
        element_chk_local_name = 'input-audio-file-local';
        element_chk_url_name = 'input-audio-file-url';
        element_file_name = 'input-audio-file-grp';
        element_url_name = 'input-audio-url-grp';
    }

    if ((element_chk_local_name !== null) && (element_chk_url_name !== null) && (element_file_name !== null) && (element_url_name !== null)) {
        if (document.getElementById(element_chk_local_name).checked === true) {
            document.getElementById(element_file_name).style.display = "table";
            document.getElementById(element_url_name).style.display = "none";
        }
        else if (document.getElementById(element_chk_url_name).checked === true) {
            document.getElementById(element_file_name).style.display = "none";
            document.getElementById(element_url_name).style.display = "block";
        }
    }
}

//Start execution

document.getElementById('input-video-file').ui_track_type = enUITracks.UI_VIDEO;
document.getElementById('input-video-file').addEventListener('change', onFileSelectHandle, false);
document.getElementById('input-audio-file').ui_track_type = enUITracks.UI_AUDIO_01;
document.getElementById('input-audio-file').addEventListener('change', onFileSelectHandle, false);


document.getElementById('input-video-file-selector').ui_track_type = enUITracks.UI_VIDEO;
document.getElementById('input-video-file-selector').addEventListener('click', onFileSourceChange, false);
document.getElementById('input-audio-file-selector').ui_track_type = enUITracks.UI_AUDIO_01;
document.getElementById('input-audio-file-selector').addEventListener('click', onFileSourceChange, false);

document.getElementById('input-process').setAttribute('disabled', true);
document.getElementById('input-process').addEventListener('click', onProcessClick, false);

checkFileAPI();