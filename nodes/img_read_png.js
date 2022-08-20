import { render, html } from '../uhtml.js';

export default {
  name: "read png",
  inputs: [
    // FIXME: fake input, see `func` and `png_URL_handler`
    { name: "imageRGBA", type: "img_uint8" },
  ],
  outputs: [
    { name: "imageRGBA", type: "img_uint8" }
  ],

  func: (img) => {
    // FIXME: this doesn't do any calculation, the image is already read. but we need to get it from somewhere....
    console.log("func for ",img);
    return [img];
  },

  onUpdate(node, container) {

    // FIXME: this pattern is "setup ui". Need another step in the protocol for that.
    // thus this .state hack

    if (node['state']) {
      return;
      }
    node.state = true;

    //
    // file input control
    //
    let canvas;
    let children = render(
      container,
      html`
        <input type="file" @change=${(e) => {read(e, node, canvas)}}>
        <canvas name='canvas'>
      `
    );

    // this value gets passed into read()
    canvas = children.getElementsByTagName('canvas')[0];
  },

};

// FIXME: could be a nested function in the above to close on vars.

function read(event,node,canvas) {

  function png_URL_handler(load_event) {
      var img = new Image()
      img.setAttribute("src", load_event.target.result)
      img.onload = function() {
          console.log("  png_URL loaded", img);
          // FIXME: should the image be scroll-bar'd if it is "large"? or scaled?
          canvas.height = img.height;
          canvas.width = img.width;
          if (img.width > img.height) {
              var x0 = 0
              var y0 = canvas.height * .5 * (1 - img.height / img.width)
              var w = canvas.width
              var h = canvas.width * img.height / img.width
          } else {
              var x0 = canvas.width * .5 * (1 - img.width / img.height)
              var y0 = 0
              var w = canvas.height * img.width / img.height
              var h = canvas.height
          }
          var ctx = canvas.getContext("2d")
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, x0, y0, w, h)
          var ctx = canvas.getContext("2d")
          ctx.canvas.width = img.width
          ctx.canvas.height = img.height
          ctx.drawImage(img, 0, 0)

        // FIXME: Neil determined "dpi" info. is that important or useful?
      }

      // FIXME: we need to put this image somewhere. but where? fake input.
      node.inputs[0] = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
  }

  let file_reader = new FileReader();
  let input_file = event.target.files[0];
  let file_name = input_file.name;
  console.log("  read",file_name);

  file_reader.onload = png_URL_handler
  file_reader.readAsDataURL(input_file)
}
