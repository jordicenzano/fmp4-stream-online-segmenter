# fmp4-stream-online-segmenter

This is a tool that allows you to create a DASH manifest from any fmp4 stream or file (just 1 h264 / AAC track allowed)
For the online version all the process is done inside the browser, so the input fmp4 file is NOT uploaded anywhere making segmentation process fast and secure.
We use byte ranges request inside the DASH manifest so that allows you to use the same fmp4 file as a source without having to modify it / split it.

You can also execute the same segmenter in the CLI (nodeJS), and then you can also use it to segment a live fmp4 TCP stream or a local fmp4 file, in that case the chunks can be generated and saved to the local disc and we will not use byte ranges.

# Usage in the browser

* Click here [online-segmenter](https://jordicenzano.github.io/fmp4-stream-online-segmenter/)
* Select the desired target duration (by default it creates a new item at every moof atom), and select a .mp4 (fragmented) file from your local computer (see note 1), or put a URL of any fmp4 file (remember should have a proper CORS policy)
* The .mp4 file will be processed in YOUR browser and the resulting DASH manifest will be displayed

## Testing the results:
* Copy the resulting manifest data in a file in the *same directory* where your .mp4 file is, for example `dash.mpd`
* Put a webserver in front of those files, for instance [node-static](https://github.com/cloudhead/node-static), and play that manifest with any DASH player (I recommend you to use [DASH-IF referece player](http://reference.dashif.org/dash.js/v2.6.8/samples/dash-if-reference-player/index.html) ). Remember you will need to fake CORS since you will be serving the manifest and media from `localhost`

# Usage in the console to process files

* Use the following syntax, see note 1 or testing:
```
./fmp4-stream-segmenter-cli.js /your_path/input.mp4 /your_path/dash.mpd
```
You can execute `./fmp4-stream-segmenter-cli.js` (without arguments) to get help about input parameters


//TODO: live - tcp mode
# TODO: Usage in the console to process TCP streams (live)

It provides a server TCP socket to ingest a TS TCP stream, and it generates a live EVENT or WINDOW chunklist, it also saves the chunk files indicating them as growing files, useful if you want to implement [LHLS](https://medium.com/@periscopecode/introducing-lhls-media-streaming-eb6212948bef) or reduce latency using chunked transfer. See Note 2 if you want to test it.

* Use the following syntax, see note 2 for testing:
```
./transport-stream-segmenter-tcp.js ./transport-stream-segmenter-tcp.js 5000 /tmp media_ out.m3u8 4 127.0.0.1 event
```
You can execute `./transport-stream-segmenter-tcp.js` (without arguments) to get help about accepted parameters

Note 1: If you do not have any ts file you can generate one by using `ffmpeg`:
```
# This will generate a 15s video only fmp4
# Generate video real time (remove -re if you just want to generate the file quicker)
ffmpeg -f lavfi -re -i smptebars=duration=15:size=320x200:rate=30 \
-pix_fmt yuv420p -c:v libx264 -b:v 250k -g 30 -keyint_min 120 -profile:v baseline -preset veryfast \
-f mp4 -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof demo_video.mp4

# This will generate a 15s audio only fmp4
# Generate audio real time (remove -re if you just want to generate the file quicker)
ffmpeg -f lavfi -re -i sine=frequency=1000:duration=15:sample_rate=44100 \
-c:a libfdk_aac -b:a 96k \
-f mp4 -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof demo_audio,mp4
```

//TODO live - tcp mode
Note 2: If you do not have any encoder able to generate a TS TCP stream, you can execute the following script included in this repo (it uses `ffmpeg` behind the scenes):
```
./test/scripts/./videoTestToLiveTSTSCP.sh 1000 120 9000 127.0.0.1
```

