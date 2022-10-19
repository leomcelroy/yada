import asyncio
import websockets
import serial


async def hello(websocket, path):
    global serial_obj

    c = await websocket.recv()

    print(c)

    serial_obj.write(c.encode("utf-8"))


start_server = websockets.serve(hello, 'localhost', 3000)

com_port = "/dev/tty.usbmodem141101"
serial_obj = serial.Serial(com_port, baudrate=115200)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

