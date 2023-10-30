import { parse } from "mpd-parser";

const fetchManifest = async (manifestUri: string) => {
  const manifestResponse = await fetch(manifestUri);
  const manifest = await manifestResponse.text();

  return parse(manifest);
};

export const getVideoFromManifest = async (manifestUri: string) => {
  const parsedManifest = await fetchManifest(manifestUri);

  const playlistIndex = 1;

  const codecs = parsedManifest.playlists[playlistIndex].attributes.CODECS;
  const segments = parsedManifest.playlists[playlistIndex].segments.map(
    (segment: any) => `${segment.uri}`
  );
  const initializationSegment = `${parsedManifest.playlists[playlistIndex].segments[0].map.uri}`;
  const duration = parsedManifest.duration;

  return { codecs, segments, initializationSegment, duration };
};

export const getAudioFromManifest = async (manifestUri: string) => {
  const parsedManifest = await fetchManifest(manifestUri);

  const playlistIndex = 1;

  const codecs =
    parsedManifest.mediaGroups.AUDIO.audio["en-US (main)"].playlists[
      playlistIndex
    ].attributes.CODECS;
  const segments = parsedManifest.mediaGroups.AUDIO.audio[
    "en-US (main)"
  ].playlists[playlistIndex].segments.map((segment: any) => `${segment.uri}`);

  const initializationSegment = `${parsedManifest.mediaGroups.AUDIO.audio["en-US (main)"].playlists[playlistIndex].segments[0].map.uri}`;

  return { codecs, segments, initializationSegment };
};
