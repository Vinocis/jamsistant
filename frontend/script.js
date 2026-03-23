import { PitchDetector } from "https://esm.sh/pitchy@4";

function updatePitch(analyserNode, detector, input, sampleRate) {
  analyserNode.getFloatTimeDomainData(input);
  const [pitch, clarity] = detector.findPitch(input, sampleRate);
  let normalizedPitch = Math.round(pitch * 10) / 10;
  let normalizedClarity = Math.round(clarity * 100);

  document.getElementById("pitch").textContent = `${normalizedPitch}Hz`;
  document.getElementById("clarity").textContent = `${normalizedClarity}%`;

  return [normalizedPitch, normalizedClarity];
}

function getLocalStream() {
  const socket = new WebSocket("ws://localhost:4000/notes_socket");
  const audioContext = new window.AudioContext();
  const analyserNode = audioContext.createAnalyser();

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      detector.minVolumeDecibels = -10;
      const input = new Float32Array(detector.inputLength);
      setInterval(() => {
        [normalizedPitch, normalizedClarity] = updatePitch(
          analyserNode,
          detector,
          input,
          audioContext.sampleRate,
        );

        if (socket.readyState === 1) {
          socket.send(
            JSON.stringify({
              pitch: normalizedPitch,
              clarity: normalizedClarity,
            }),
          );
        }
      }, 100);
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });

  socket.addEventListener("message", (event) => {
    note = JSON.parse(event).note ?? "";

    document.getElementById("note").textContent = note.toUpperCase();
  });
}

getLocalStream();
