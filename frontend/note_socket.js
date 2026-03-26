import { Socket } from "phoenix";

let socket = new Socket("ws://localhost:4000/note_socket", {});
socket.connect();

let channel = socket.channel("frequency:to_note", {});
// TODO:
// CHANGE THIS FORMATTER!!! THIS IS HORRIFYING I CAN'T
channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

export { channel };
export default socket;
