#!/usr/bin/env bash

if [ "$#" -ne 3 ]
then
  echo "Usage: ./audioGenfMp4.sh AUDIO_BITRATE(Kbps) DURATION(s) FILE"
  echo "Example: ./audioGenfMp4.sh 96 5 out.mp4"
  exit 1
fi

#Check if ffmpeg is installed
if ! [ -x "$(command -v ffmpeg)" ]; then
  echo 'Error: ffmpeg is not installed.' >&2
  exit 1
fi

AUDIO_BITRATE=$1
DURATION_S=$2
OUT_FILE=$3

ffmpeg -f lavfi -re -i sine=frequency=1000:duration=${DURATION_S}:sample_rate=44100 \
-c:a libfdk_aac -b:a 96k \
-f mp4 -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof $OUT_FILE
