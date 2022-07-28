function getLimits(view, endian, delta) {
  var triangles = view.getUint32(80, endian);
  var offset = 80 + 4;
  var x0, x1, x2, y0, y1, y2, z0, z1, z2;
  var xmin = Number.MAX_VALUE;
  var xmax = -Number.MAX_VALUE;
  var ymin = Number.MAX_VALUE;
  var ymax = -Number.MAX_VALUE;
  var zmin = Number.MAX_VALUE;
  var zmax = -Number.MAX_VALUE;
  for (var t = 0; t < triangles; ++t) {
    ({ x0, y0, z0, x1, y1, z1, x2, y2, z2, offset } = getPoints(
      view,
      offset,
      endian,
      delta
    ));
    var p0 = { x: x0, y: y0, z: z0 };
    if (p0.x > xmax) xmax = p0.x;
    if (p0.x < xmin) xmin = p0.x;
    if (p0.y > ymax) ymax = p0.y;
    if (p0.y < ymin) ymin = p0.y;
    if (p0.z > zmax) zmax = p0.z;
    if (p0.z < zmin) zmin = p0.z;
    var p1 = { x: x1, y: y1, z: z1 };
    if (p1.x > xmax) xmax = p1.x;
    if (p1.x < xmin) xmin = p1.x;
    if (p1.y > ymax) ymax = p1.y;
    if (p1.y < ymin) ymin = p1.y;
    if (p1.z > zmax) zmax = p1.z;
    if (p1.z < zmin) zmin = p1.z;
    var p2 = { x: x2, y: y2, z: z2 };
    if (p2.x > xmax) xmax = p2.x;
    if (p2.x < xmin) xmin = p2.x;
    if (p2.y > ymax) ymax = p2.y;
    if (p2.y < ymin) ymin = p2.y;
    if (p2.z > zmax) zmax = p2.z;
    if (p2.z < zmin) zmin = p2.z;
  }
  var dx = xmax - xmin;
  var dy = ymax - ymin;
  var dz = zmax - zmin;

  return { dx, dy, dz, xmin, xmax, ymin, ymax, zmin, zmax };
}

function getPoints(view, offset, endian, delta = 0) {
  offset += 3 * 4;
  let x0 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let y0 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let z0 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let x1 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let y1 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let z1 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let x2 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let y2 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  let z2 = view.getFloat32(offset, endian) + delta;
  offset += 4;
  offset += 2;

  return {
    x0,
    y0,
    z0,
    x1,
    y1,
    z1,
    x2,
    y2,
    z2,
    offset,
  };
}

export function sliceMesh({ mesh, depth, border, width }) {
  // get variables
  let delta = 0.000001;
  var endian = true;
  // var image = imageBuffer;
  var view = new DataView(mesh);
  var triangles = view.getUint32(80, endian);

  // find limits
  let { dx, dy, dz, xmin, xmax, ymin, ymax, zmin, zmax } = getLimits(
    view,
    endian,
    delta
  );

  xmin -= border;
  xmax += border;
  ymin -= border;
  ymax += border;

  let height = Math.round((width * dy) / dx);

  let xfactor, yfactor;
  if (dx / width > dy / height) {
    xfactor = dx;
    yfactor = (dx * height) / width;
  } else {
    xfactor = (dy * width) / height;
    yfactor = dy;
  }

  // draw mesh
  let x0, y0, z0, x1, y1, z1, x2, y2, z2;

  var buf = new Uint8ClampedArray(4 * width * height);

  for (var row = 0; row < height; ++row) {
    for (var col = 0; col < width; ++col) {
      buf[(height - 1 - row) * width * 4 + col * 4 + 0] = 0;
      buf[(height - 1 - row) * width * 4 + col * 4 + 1] = 0;
      buf[(height - 1 - row) * width * 4 + col * 4 + 2] = 0;
      buf[(height - 1 - row) * width * 4 + col * 4 + 3] = 255;
    }
  }
  let segs = [];
  let offset = 80 + 4;
  for (var t = 0; t < triangles; ++t) {
    ({ x0, y0, z0, x1, y1, z1, x2, y2, z2, offset } = getPoints(
      view,
      offset,
      endian,
      delta
    ));

    // assemble vertices
    var v = [
      [x0, y0, z0],
      [x1, y1, z1],
      [x2, y2, z2],
    ];

    // sort z
    v.sort(function (a, b) {
      if (a[2] < b[2]) return -1;
      else if (a[2] > b[2]) return 1;
      else return 0;
    });

    // check for crossings
    if (v[0][2] < zmax - depth && v[2][2] > zmax - depth) {
      //
      //  crossing found, check for side and save
      //
      let x0_, y0_, x1_, y1_;
      if (v[1][2] < zmax - depth) {
        x0_ =
          v[2][0] +
          ((v[0][0] - v[2][0]) * (v[2][2] - (zmax - depth))) /
            (v[2][2] - v[0][2]);
        y0_ =
          v[2][1] +
          ((v[0][1] - v[2][1]) * (v[2][2] - (zmax - depth))) /
            (v[2][2] - v[0][2]);
        x1_ =
          v[2][0] +
          ((v[1][0] - v[2][0]) * (v[2][2] - (zmax - depth))) /
            (v[2][2] - v[1][2]);
        y1_ =
          v[2][1] +
          ((v[1][1] - v[2][1]) * (v[2][2] - (zmax - depth))) /
            (v[2][2] - v[1][2]);
      } else if (v[1][2] >= zmax - depth) {
        x0_ =
          v[2][0] +
          ((v[0][0] - v[2][0]) * (v[2][2] - (zmax - depth))) /
            (v[2][2] - v[0][2]);
        y0_ =
          v[2][1] +
          ((v[0][1] - v[2][1]) * (v[2][2] - (zmax - depth))) /
            (v[2][2] - v[0][2]);
        x1_ =
          v[1][0] +
          ((v[0][0] - v[1][0]) * (v[1][2] - (zmax - depth))) /
            (v[1][2] - v[0][2]);
        y1_ =
          v[1][1] +
          ((v[0][1] - v[1][1]) * (v[1][2] - (zmax - depth))) /
            (v[1][2] - v[0][2]);
      }

      // is it possible one could be undefined
      if (y0_ < y1_) segs.push({ x0: x0_, y0: y0_, x1: x1_, y1: y1_ });
      else segs.push({ x0: x1_, y0: y1_, x1: x0_, y1: y0_ });
    }
  }

  // fill

  for (var row = 0; row < height; ++row) {
    var y = ymin + ((ymax - ymin) * row) / (height - 1);
    let rowsegs = segs.filter((p) => p.y0 <= y && p.y1 >= y);
    var xs = rowsegs.map(
      (p) => p.x0 + ((p.x1 - p.x0) * (y - p.y0)) / (p.y1 - p.y0)
    );
    xs.sort((a, b) => a - b);
    for (var col = 0; col < width; ++col) {
      var x = xmin + ((xmax - xmin) * col) / (width - 1);
      var index = xs.findIndex((p) => p >= x);
      if (index == -1) var i = 0;
      else var i = 255 * (index % 2);

      buf[(height - 1 - row) * width * 4 + col * 4 + 0] = 0;
      buf[(height - 1 - row) * width * 4 + col * 4 + 1] = 0;
      buf[(height - 1 - row) * width * 4 + col * 4 + 2] = 0;
      buf[(height - 1 - row) * width * 4 + col * 4 + 3] = i;
    }
  }

  const mapx = x => (x-xmin)/xfactor*width;
  const mapy = y => (y-ymin)/yfactor*height;

  let canvas = new OffscreenCanvas(width, height);
  var ctx = canvas.getContext("2d");
  segs.forEach((seg, i) => {
    ctx.beginPath();
    ctx.moveTo(mapx(seg.x0), mapy(seg.y0));
    ctx.lineTo(mapx(seg.x1), mapy(seg.y1));
    ctx.stroke();
  })

  const result = ctx.getImageData(0, 0, width, height);

  return {
    image: result, //new ImageData(buf, width, height),
    segs: segs.map(s => [[mapx(s.x0), mapy(s.y0)], [mapx(s.x1), mapy(s.y1)]])
  }
}
