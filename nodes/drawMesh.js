function getLimits(view, endian) {
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
    ({
      x0, y0, z0,
      x1, y1, z1,
      x2, y2, z2,
      offset
    } = getPoints(view, offset, endian));
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

function getPoints(view, offset, endian) {
    offset += 3 * 4;
    let x0 = view.getFloat32(offset, endian);
    offset += 4;
    let y0 = view.getFloat32(offset, endian);
    offset += 4;
    let z0 = view.getFloat32(offset, endian);
    offset += 4;
    let x1 = view.getFloat32(offset, endian);
    offset += 4;
    let y1 = view.getFloat32(offset, endian);
    offset += 4;
    let z1 = view.getFloat32(offset, endian);
    offset += 4;
    let x2 = view.getFloat32(offset, endian);
    offset += 4;
    let y2 = view.getFloat32(offset, endian);
    offset += 4;
    let z2 = view.getFloat32(offset, endian);
    offset += 4;
    offset += 2;

    return {
      x0, y0, z0,
      x1, y1, z1,
      x2, y2, z2,
      offset
    }
}


export function drawMesh({ height, width, mesh }) {
  // get variables
  var endian = true;
  // var image = imageBuffer;
  var view = new DataView(mesh);
  var triangles = view.getUint32(80, endian);

  // find limits
  const { 
    dx, dy, dz, 
    xmin, xmax, 
    ymin, ymax, 
    zmin, zmax
  } = getLimits(view, endian);

  let xfactor, yfactor;
  if (dx/width > dy/height) {
    xfactor = dx;
    yfactor = dx*height/width;
  } else {
    xfactor = dy*width/height;
    yfactor = dy;
  }

  const mapx = x => (x-xmin)/xfactor*width + (width - dx/xfactor*width)/2;
  const mapy = y => (y-ymin)/yfactor*height + (height - dy/yfactor*height)/2;

  // draw mesh
  let offset = 80 + 4;
  let x0, y0, z0, 
      x1, y1, z1, 
      x2, y2, z2;

  let canvas = new OffscreenCanvas(width, height);
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  for (var t = 0; t < triangles; ++t) {
    ({
      x0, y0, z0,
      x1, y1, z1,
      x2, y2, z2,
      offset
    } = getPoints(view, offset, endian));

    ctx.moveTo(mapx(x0), mapy(y0));
    ctx.lineTo(mapx(x1), mapy(y1));
    ctx.lineTo(mapx(x2), mapy(y2));
  }
  ctx.stroke();

  let image =  ctx.getImageData(0, 0, width, height);

  return {
    dx,
    dy,
    dz,
    image
  };
}
