// Image with gradient block
// and some shapes

var default_height=100;
var default_width=100;


function transform(h,w) {

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  //const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  
 
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fillStyle = "black";
  ctx.fill();

  var gradient_size = 40;
  var my_gradient = ctx.createLinearGradient(0, 0, gradient_size, 0);
  my_gradient.addColorStop(0, "black");
  my_gradient.addColorStop(0.5 ,"red");
  my_gradient.addColorStop(1, "green");
  ctx.fillStyle = my_gradient;
  ctx.fillRect(0, 0, gradient_size, gradient_size); 

  const margin = 10;
  ctx.beginPath();
  ctx.strokeStyle = "#AAAAAA";
  ctx.arc(h/2, w/2, w/2-margin, 0, 2 * Math.PI);
  ctx.stroke();

  return ctx.getImageData(0,0,w,h);
};

export default {
  name: "img offset",
  inputs: [
    { name: "height", type: "number", input: "box" },
    { name: "width", type: "number", input: "box" }
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
  func: async (height,width) => {

    // default sizes
    if (height==0) {
      height = default_height;
      }
    if (width==0) {
      width = default_height;
      }

    // can't do worker, because OffscreenCanvas is poorly supported
    // and I want to draw shapes
    var rez= transform(height,width);
    return [rez];
  }
}
