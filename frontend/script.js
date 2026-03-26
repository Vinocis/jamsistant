import { PitchDetector } from "pitchy";
import socket, { channel } from "./note_socket.js";

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
        const [normalizedPitch, normalizedClarity] = updatePitch(
          analyserNode,
          detector,
          input,
          audioContext.sampleRate,
        );

        channel
          .push("frequency_to_note", {
            pitch: normalizedPitch,
            clarity: normalizedClarity,
          })
          .receive("ok", (payload) => {
            console.log("Payload: ", payload);
            const note = payload.note ?? "";
            console.log("Parsed note: ", note);
            document.getElementById("note").textContent = note.toUpperCase();
          })
          .receive("error", (err) => console.log(`Phoenix errored ${err}`))
          .receive("timeout", (err) => console.log("Phoenix errored", err));
      }, 100);
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}

getLocalStream();
