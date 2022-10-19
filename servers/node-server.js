import { SerialPort } from 'serialport';
import { WebSocketServer } from 'ws';

// Create a port
const port = new SerialPort({
  path: "/dev/tty.usbmodem141101",
  baudRate: 57600,
})

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {

  ws.on('message', (data) => {
    port.write(data);
  });



});

