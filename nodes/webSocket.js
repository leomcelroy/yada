import { render, html, svg } from '../uhtml.js';

export default {
  name: "web socket",
  inputs: [
    { name: "msg", type: "string", input: "box" },
  ],
  outputs: [],
  onUpdate(node, container) {
    node.state.count = 0;
    render(
      container, 
      html`
        <button @click=${() => testSocket(node.state)}>start socket</button>
      `
    )
  },
  func: (msg) => {
    console.log(msg);
    return [];
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

function WebSocketTest() {
            
  if ("WebSocket" in window) {
     // alert("WebSocket is supported by your Browser!");
     
     // Let us open a web socket
     var ws = new WebSocket("ws://localhost:3000");

     ws.onopen = function() {
        
        // Web Socket is connected, send data using send()
        ws.send("Message to send");
        // alert("Message is sent...");
     };

     ws.onmessage = function (evt) { 
        var received_msg = evt.data;
        // alert("Message is received...");
     };

     ws.onclose = function() { 
        
        // websocket is closed.
        // alert("Connection is closed..."); 
     };
  } else {
    
     // The browser doesn't support WebSocket
     alert("WebSocket NOT supported by your Browser!");
  }
}

function testSocket(state) {
  var ws = new WebSocket("ws://localhost:3000");
  ws.onopen = () => {
    ws.send("r");
    state.count++;
  }

  ws.onclose = function() { 
    
    // websocket is closed.
    console.log("web socket closed");
  };
}








