const rotate = ({rx, ry, rz}, {x, y, z}) => {
  var x1 = x
  var y1 = Math.cos(rx)*y-Math.sin(rx)*z
  var z1 = Math.sin(rx)*y+Math.cos(rx)*z
  var x2 = Math.cos(ry)*x1-Math.sin(ry)*z1
  var y2 = y1
  var z2 = Math.sin(ry)*x1+Math.cos(ry)*z1
  var x3 = Math.cos(rz)*x2-Math.sin(rz)*y2
  var y3 = Math.sin(rz)*x2+Math.cos(rz)*y2
  var z3 = z2
  //return([x3,y3,z3])
  return { x:x3, y:y3, z:z3 }
}

export function rotateMesh(mesh, angles) {
  var endian = true;
  var view = new DataView(mesh);
  var triangles = view.getUint32(80, endian);

  // copy mesh
  var newBuf = mesh.slice(0);
  var newview = new DataView(newBuf);

  // rotate points
  var newoffset = 80+4;
  let offset = 80+4;
  for (var t = 0; t < triangles; ++t) {
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

    let p0 = rotate({ rx: angles[0]/180*Math.PI, ry: angles[1]/180*Math.PI, rz: angles[2]/180*Math.PI }, { x: x0, y: y0, z: z0 });
    let p1 = rotate({ rx: angles[0]/180*Math.PI, ry: angles[1]/180*Math.PI, rz: angles[2]/180*Math.PI }, { x: x1, y: y1, z: z1 });
    let p2 = rotate({ rx: angles[0]/180*Math.PI, ry: angles[1]/180*Math.PI, rz: angles[2]/180*Math.PI }, { x: x2, y: y2, z: z2 });
    
    newoffset += 3*4
    newview.setFloat32(newoffset,p0.x,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p0.y,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p0.z,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p1.x,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p1.y,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p1.z,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p2.x,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p2.y,endian)
    newoffset += 4
    newview.setFloat32(newoffset,p2.z,endian)
    newoffset += 4
    newoffset += 2
  }


  return newBuf;
}
