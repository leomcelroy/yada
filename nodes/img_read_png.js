import { render, html } from '../uhtml.js';

export default {
  name: "read png",
  inputs: [
    { name: "imageRGBA", type: "img_uint8", input: "upload" },
  ],
  outputs: [
    { name: "imageRGBA", type: "img_uint8" }
  ],
  func: (img) => {
    return [img];
  },
};
