var buffer = new Uint8ClampedArray(result.image);
let img = new ImageData(buffer, width, height)

let w = width, h = height;
const buf = new Uint8ClampedArray(4 * h * w);
for (var row = 0; row < h; ++row) {
	for (var col = 0; col < w; ++col) {
	  // const [r, g, b, a] = getColor(row, col);

	  buf[((row*w) + col)*4 + 0] = 0; // r
	  buf[((row*w) + col)*4 + 1] = 0; // g
	  buf[((row*w) + col)*4 + 2] = 255; // b
	  buf[((row*w) + col)*4 + 3] = 155; // a
	}
}

img = new ImageData(buf, width, height)
console.log(img);