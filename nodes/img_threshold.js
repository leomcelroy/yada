import { render, html, svg } from '../uhtml.js';

function workerInternal() {

  self.onmessage = function(e) {
    const inputs = e.data;

    const buf = inputs.buf;
    const w = inputs.w;
    const h = inputs.h;
    const t = inputs.threshold;

    let r, g, b, a, i;
    for (var row = 0; row < h; ++row) {
      for (var col = 0; col < w; ++col) {
        r = buf[(h - 1 - row) * w * 4 + col * 4 + 0];
        g = buf[(h - 1 - row) * w * 4 + col * 4 + 1];
        b = buf[(h - 1 - row) * w * 4 + col * 4 + 2];
        a = buf[(h - 1 - row) * w * 4 + col * 4 + 3];
        i = (r + g + b) / (3 * 255);

        let val;
        if (a === 0) {
          val = 255;
        } else if (i > t) {
          val = 255;
        } else {
          val = 0;
        }

        buf[(h - 1 - row) * w * 4 + col * 4 + 0] = val;
        buf[(h - 1 - row) * w * 4 + col * 4 + 1] = val;
        buf[(h - 1 - row) * w * 4 + col * 4 + 2] = val;
        buf[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
      }
    }

    self.postMessage([buf, w, h]);

    self.close();
  };

}

export default {
  name: "thresholdRGBA",
  inputs: [
    { name: "imageRGBA", type: "img_uint8" },
    { name: "threshold", type: "number", input: "box" }
  ],
  outputs: [
    { name: "imageRGBA", type: "img_uint8" }
  ],
  view(node, container) {
    const img = node.outputs[0];
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(img, 0, 0);

    container.querySelectorAll("canvas").forEach(el => el.remove());
    container.appendChild(canvas)
    return "";
  },
  func: async (img, thresh) => {

    const blob = new Blob(["(" + workerInternal.toString() + "())"]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);

    const result = new Promise(resolve => {
      worker.onmessage = e => {
        const message = e.data;

        const img = new ImageData(message[0], message[1], message[2]);

        resolve(img);

        // redundant to call this because I call self.close() in internal function
        // worker.terminate();
      };
    })

    const buf = img.data;
    const w = img.width;
    const h = img.height;

    worker.postMessage({buf, w, h, "threshold": thresh});

    return await Promise.all([result]);
  }
}
