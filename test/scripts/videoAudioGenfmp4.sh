#!/usr/bin/env bash

if [ "$#" -ne 3 ]
then
  echo "Usage: ./videoAudioGenfMp4.sh VIDEO_BITRATE(Kbps) DURATION(s) FILE"
  echo "Example: ./videoAudioGenfMp4.sh 1000 5 out.mp4"
  exit 1
fi

#Check if ffmpeg is installed
if ! [ -x "$(command -v ffmpeg)" ]; then
  echo 'Error: ffmpeg is not installed.' >&2
  exit 1
fi

VIDEO_BITRATE=$1
DURATION_S=$2
OUT_FILE=$3

#Select font path based in OS
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    FONT_PATH='/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'
elif [[ "$OSTYPE" == "darwin"* ]]; then
    FONT_PATH='/Library/Fonts/Arial.ttf'
fi

ffmpeg -f lavfi -re -i smptebars=duration=${DURATION_S}:size=320x200:rate=30 \
-f lavfi -re -i sine=frequency=1000:duration=${DURATION_S}:sample_rate=44100 \
-vf "drawtext=fontfile=${FONT_PATH}: text=fMP4 %{n}: x=50: y=30: fontsize=35: fontcolor=white: box=1: boxcolor=0x00000099" \
-pix_fmt yuv420p -c:v libx264 -b:v ${VIDEO_BITRATE}k -g 30 -keyint_min 120 -profile:v baseline -preset veryfast \
-c:a libfdk_aac -b:a 96k \
-f mp4 -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof $OUT_FILE
