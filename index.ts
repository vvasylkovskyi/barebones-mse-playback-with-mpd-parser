import { getParsedManifest } from "./src/mpd-parser";

const startPlayback = async () => {
  const video: HTMLVideoElement = document.createElement("video");
  video.style.width = "640px";
  video.setAttribute("controls", "");
  document.getElementsByTagName("body")[0].appendChild(video);

  const { codecs, segments, initializationSegment } = await getParsedManifest(
    "./segments/BigBuckBunny.mpd"
  );

  const mp4InitializationUri = initializationSegment;
  const mimeCodec = `video/mp4; codecs="${codecs}"`;

  if (!MediaSource.isTypeSupported(mimeCodec)) {
    console.error("Unsupported media format");
    return;
  }

  const mediaSource: MediaSource = new MediaSource(); // mediaSource.readyState === 'closed'
  const url = window.URL.createObjectURL(mediaSource);
  video.src = url;

  async function getMp4Data(mp4Uri: string): Promise<ArrayBuffer> {
    const mp4Response: Response = await fetch(mp4Uri);
    return mp4Response.arrayBuffer();
  }

  async function onSourceOpen() {
    let i = 0;
    URL.revokeObjectURL(video.src); // Revoke Object URL for garbage collection
    const sourceBuffer: SourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

    sourceBuffer.addEventListener("updateend", async function () {
      if (!sourceBuffer.updating && i !== segments.length) {
        const nextSegmentUri = segments[i];
        const nextSegment = await getMp4Data(nextSegmentUri); // Next segments
        sourceBuffer.appendBuffer(nextSegment);
        i++;
      }
      if (mediaSource.readyState === "open" && i === segments.length) {
        mediaSource.endOfStream();
      }
    });

    const firstSegment = await getMp4Data(mp4InitializationUri); // First segment is here
    sourceBuffer.appendBuffer(firstSegment);
  }

  mediaSource.addEventListener("sourceopen", onSourceOpen.bind(mediaSource));
};

startPlayback();
