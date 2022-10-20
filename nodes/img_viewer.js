
export default {
  name: "img viewer",
  inputs: [
    { name: "imageRGBA", type: "img_uint8" },
  ],
  outputs: [
    { name: "imageRGBA", type: "img_uint8" }
  ],
  onUpdate(node) {
    const img = node.inputs[0];
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const imageData = new ImageData(img.data, img.width);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  },
  func: (x) => {
    return [ x ];
  }
}
