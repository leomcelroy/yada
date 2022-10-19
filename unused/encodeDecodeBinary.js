// {
//   "number": 0,
//   "img_uint8": { data, width, height },
//   "img_float32": { data, width, height }
// }


export function encode() {

}

export function decode() {

}

// image.data = image.data.reduce(
//   (data, byte) => data + String.fromCharCode(byte)
// , '');

// image.data = btoa(image.data);

// const decode = ({ data, width }) => {
//   const decodedString = atob(data);
//   const l = decodedString.length;
//   const buf = new Uint8ClampedArray(l);
//   for (let i = 0; i < l; i++) {
//     const char = decodedString[i];
//     const byte = char.charCodeAt(0);
//     buf[i] = byte;
//   }

//   return new ImageData(buf, width);
// }
