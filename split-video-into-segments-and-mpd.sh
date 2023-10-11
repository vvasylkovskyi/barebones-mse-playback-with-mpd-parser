#!/usr/bin/env bash

packager in=./BigBuckBunny.mp4,stream=video,init_segment='./segments/BigBuckBunny_0.mp4',segment_template='./segments/BigBuckBunny_$Number%01d$.mp4' \
--segment_duration 2 \
--mpd_output ./segments/BigBuckBunny.mpd