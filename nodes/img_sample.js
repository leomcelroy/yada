// Image with gradient block
// and some shapes

var default_height=100;
var default_width=100;

function workerInternal() {

  function transform(h,w) {

    var buffer = new Uint8ClampedArray(4*h*w);
    let img = new ImageData(buffer, w, h)

    function setpix(buffer, r,c,color) {
        i = (r*w + c)*4;
        for(ci=0;ci<4;ci++) { // r,g,b,a
          buffer[i+ci] = color[ci]
        }
    };

    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d');
    
   
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.fill();

    gradient_size = 40;
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

  console.log("worker setup");

  self.onmessage = function(e) {
    const inputs = e.data;
    console.log('workerInternal.onmessage',inputs);

    buf = transform(inputs.width, inputs.height );

    self.postMessage([buf]);

    self.close();
  };

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

    // default sizes
    if (height==0) {
      height = default_height;
      }
    if (width==0) {
      width = default_height;
      }

    console.log("work,postMessage", {height,width});
    worker.postMessage({height,width});
    console.log("after work,postMessage");

    return await Promise.all([result]);
  }
}
