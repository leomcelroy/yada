function workerInternal() {

  self.onmessage = function(e) {
    const inputs = e.data;

    const input = inputs.buf;
    const nx = inputs.w;
    const ny = inputs.h;

    var output = new Float32Array(nx * ny);
    function distance(g, x, y, i) {
      return (y - i) * (y - i) + g[i][x] * g[i][x];
    }
    function intersection(g, x, y0, y1) {
      return (
        (g[y0][x] * g[y0][x] - g[y1][x] * g[y1][x] + y0 * y0 - y1 * y1) /
        (2.0 * (y0 - y1))
      );
    }
    //
    // allocate arrays
    //
    var g = [];
    for (var y = 0; y < ny; ++y) g[y] = new Uint32Array(nx);
    var h = [];
    for (var y = 0; y < ny; ++y) h[y] = new Uint32Array(nx);
    var distances = [];
    for (var y = 0; y < ny; ++y) distances[y] = new Uint32Array(nx);
    var starts = new Uint32Array(ny);
    var minimums = new Uint32Array(ny);
    var d;
    //
    // column scan
    //
    for (var y = 0; y < ny; ++y) {
      //
      // right pass
      //
      var closest = -nx;
      for (var x = 0; x < nx; ++x) {
        if (input[(ny - 1 - y) * nx * 4 + x * 4 + 0] != 0) {
          g[y][x] = 0;
          closest = x;
        } else g[y][x] = x - closest;
      }
      //
      // left pass
      //
      closest = 2 * nx;
      for (var x = nx - 1; x >= 0; --x) {
        if (input[(ny - 1 - y) * nx * 4 + x * 4 + 0] != 0) closest = x;
        else {
          d = closest - x;
          if (d < g[y][x]) g[y][x] = d;
        }
      }
    }
    //
    // row scan
    //
    for (var x = 0; x < nx; ++x) {
      var segment = 0;
      starts[0] = 0;
      minimums[0] = 0;
      //
      // down
      //
      for (var y = 1; y < ny; ++y) {
        while (
          segment >= 0 &&
          distance(g, x, starts[segment], minimums[segment]) >
            distance(g, x, starts[segment], y)
        )
          segment -= 1;
        if (segment < 0) {
          segment = 0;
          minimums[0] = y;
        } else {
          var newstart = 1 + intersection(g, x, minimums[segment], y);
          if (newstart < ny) {
            segment += 1;
            minimums[segment] = y;
            starts[segment] = newstart;
          }
        }
      }
      //
      // up
      //
      for (var y = ny - 1; y >= 0; --y) {
        d = Math.sqrt(distance(g, x, y, minimums[segment]));
        output[(ny - 1 - y) * nx + x] = d;
        if (y == starts[segment]) segment -= 1;
      }
    }

    self.postMessage([output, inputs.w, inputs.h]);

    self.close();
  };

}

export default {
  name: "img distance",
  inputs: [
    { name: "imageRGBA", type: "img_uint8" },
  ],
  outputs: [
    { name: "distances", type: "img_float32" }
  ],
  func: async (img) => {

    const blob = new Blob(["(" + workerInternal.toString() + "())"]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);

    const result = new Promise(resolve => {
      worker.onmessage = e => {
        const message = e.data;

        const array = {"data": message[0], "width": message[1], "height": message[2]};

        resolve(array);

        // redundant to call this because I call self.close() in internal function
        // worker.terminate();
      };
    })

    const buf = img.data;
    const w = img.width;
    const h = img.height;

    worker.postMessage({buf, w, h});

    return await Promise.all([result]);
  }
}
