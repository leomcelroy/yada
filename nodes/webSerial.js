import { render, html, svg } from '../uhtml.js';

export default {
  name: "web serial",
  inputs: [],
  outputs: [],
  onUpdate(node, container) {
    console.log("updating");
    render(
      container, 
      html`
        <button @click=${startSerialPort}>ports</button>
      `
    )
  },
  func: (x, y) => {

    return [x + y];
  }
}

async function startSerialPort() {
  // navigator.serial.addEventListener('connect', (e) => {
  //   // Connect to `e.target` or add it to a list of available ports.
  // });

  // navigator.serial.addEventListener('disconnect', (e) => {
  //   // Remove `e.target` from the list of available ports.
  // });

  const ports = await navigator.serial.getPorts();


  console.log("ports", ports);
}

async function getPort() {
  if (navigator.serial === undefined)
    throw "your browser does not support the Web Serial API. please try again in a recent version of Chrome.";
  const ports = await navigator.serial.getPorts();
  if (ports.length !== 1) {
    dispatch("UPLOAD_LOG", "please pick a device.");
    return await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0x2e8a, usbProductId: 10 },
      ]
    });
  } else {
    return ports[0];
  }
}


