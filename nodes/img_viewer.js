import { render, html, svg } from '../uhtml.js';

export default {
  name: "img viewer",
  inputs: [
    { name: "imageRGBA", type: "img" },
  ],
  outputs: [
    { name: "imageRGBA", type: "img" }
  ],
  view(node, container) {
    if (container == null) {
        return "";
    }
      
    const img = node.inputs[0];
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(img, 0, 0);

    container.innerHTML = "";
    container.append(canvas)
    return "";
  },
  func: (x) => {
    return x;
  }
}