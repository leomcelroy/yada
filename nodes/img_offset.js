// FIXME: what does this "offset" do?

function workerInternal() {

  function transform(img, offset ) { //##
    console.log('transform() offset',offset,img);
    var buf = img.data;
    var w = img.width;
    var h = img.height;

    var output = new Uint8ClampedArray(4 * h * w);
    for (var row = 0; row < h; ++row) {
      for (var col = 0; col < w; ++col) {
        if (buf[(h - 1 - row) * w + col] <= offset) {
          output[(h - 1 - row) * w * 4 + col * 4 + 0] = 255;
          output[(h - 1 - row) * w * 4 + col * 4 + 1] = 255;
          output[(h - 1 - row) * w * 4 + col * 4 + 2] = 255;
          output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
        } else {
          output[(h - 1 - row) * w * 4 + col * 4 + 0] = 0;
          output[(h - 1 - row) * w * 4 + col * 4 + 1] = 0;
          output[(h - 1 - row) * w * 4 + col * 4 + 2] = 0;
          output[(h - 1 - row) * w * 4 + col * 4 + 3] = 255;
        }
      }
    }

    const imgData = new ImageData(output, w, h);

    return imgData;
  };

  console.log("worker setup");

  self.onmessage = function(e) {
    const inputs = e.data;
    console.log('workerInternal.onmessage',inputs);

    buf = transform(inputs.img, inputs.offset ); //##

    self.postMessage([buf]);

    self.close();
  };

};


export default {
  name: "img offset",
  inputs: [ //##
    { name: "imageRGBA", type: "img_uint8" },
    { name: "offset", type: "number", input: "box" }
  ],
  outputs: [
    { name: "imageRGBA", type: "img_uint8" }
  ],
  onUpdate(node, container) {
    const img = node.outputs[0];

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const imageData = new ImageData(img.data, img.width);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    container.innerHTML = "";
    container.appendChild(canvas);
  },
  func: async (img, offset) => { //##

    const blob = new Blob(["(" + workerInternal.toString() + "())"]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);
    console.log("after new Worker");

    const result = new Promise(resolve => {
      worker.onmessage = e => {
        console.log("receive worker.onmessage",e.data[0]);

        resolve(e.data[0]);
      };
    })

    console.log("work,postMessage");
    worker.postMessage({img, offset}); //##

    return await Promise.all([result]);
  }
}
