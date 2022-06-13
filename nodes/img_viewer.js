import { render, html, svg } from '../uhtml.js';

export default {
  name: "img viewer",
  inputs: [
    { name: "imageRGBA", type: "img_uint8" },
  ],
  outputs: [
    { name: "imageRGBA", type: "img_uint8" }
  ],
  view(node, container) {

    const img = node.inputs[0];
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(img, 0, 0);

    container.querySelectorAll("canvas").forEach(el => el.remove());
    container.appendChild(canvas)
    return "";
  },
  func: (x) => {
    return [ x ];
  }
}
