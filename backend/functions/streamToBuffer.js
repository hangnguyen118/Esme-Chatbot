import { Buffer } from "buffer";

async function streamToBuffer(nodeStream) {
  const chunks = [];

  return new Promise((resolve, reject) => {
    nodeStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    nodeStream.on("end", () => resolve(Buffer.concat(chunks)));
    nodeStream.on("error", (err) => reject(err));
  });
}

export default streamToBuffer;
