

function getShape(matrix) {
  let el = matrix;
  const dimension = [];
  while (Array.isArray(el)) {
    dimension.push(el.length);
    el = el[0];
  }

  return dimension;
}

function resultingShape(shape0, shape1) {
  let match = true;

  // const lengths = shapes.map(x => x.length);

  const lengths = [ shape0.length, shape1.length ];

  const upper = Math.max(...lengths);
  const lower = Math.min(...lengths);
  const dimensions = [];
  // console.log("bounds", lower, upper);
  for (let i = 0; i < upper; i++) {
    const dimension0 = shape0.at(-(i+1));
    const dimension1 = shape1.at(-(i+1));

    if (i >= lower) {
      dimensions.push(dimension0 || dimension1);
      continue;
    }

    // console.log("dims", dimension0, dimension1);
    dimensions.push(dimension0 === dimension1 ? dimension0 : dimension0 * dimension1);

    if (dimension0 === 1 || dimension1 === 1) continue;
    if (dimension0 !== dimension1) match = false;

  }

  // console.log(dimensions.reverse());
  
  return match
    ? dimensions.reverse()
    : null;
}

const broadcast = (...matrices) => fn => {

  const shapes = matrices.map(getShape);

  // all scalar
  if (shapes.every(x => x.length === 0)) return fn(...matrices);

  const compatible = shapes.slice(1).reduce( (acc, cur) => 
    acc === null ? null : resultingShape(acc, cur)
    , shapes[0])

  if (compatible === null) {
    console.log("ValueError: operands could not be broadcast together");
    return null;
  }

  const maxDepth = Math.max(...shapes.map(x => x.length));

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    while (shape.length < maxDepth) {
      shape.unshift(1);
      matrices[i] = [ matrices[i] ];
    }
  }

  // console.log({ shapes, matrices, compatible });

  const result = [];
  const n = compatible.reduce((acc, cur) => acc * cur, 1);
  for (let i = 0; i < n; i++) {
    let index = [];
    let x = i;
    for (let d = 0; d < compatible.length; d++) {
      const divisor = compatible.slice(d+1).reduce((acc, cur) => acc * cur, 1);
      index.push(Math.floor(x/divisor));
      x = x%divisor;
    }

    let vals = [...matrices];

    index.forEach((x, i) => {

      for (let j = 0; j < vals.length; j++) {

        if (!Array.isArray(vals[j])) continue;

        const index = shapes[j][i] === 1 ? 0 : x;
        vals[j] = vals[j][index];
      }

    });
  
    result.push(fn(...vals));
  }

  return unflattenArray(result, compatible);
}

// https://stackoverflow.com/questions/69583254/how-to-reshape-a-flattened-array-to-a-multidimensional-array-in-arbitray-shape-i
function unflattenArray(arr, dim) {
  let elemIndex = 0;

  if (!dim || !arr) return [];

  function _nest(dimIndex) {
    let result = [];

    if (dimIndex === dim.length - 1) {
      result = result.concat(arr.slice(elemIndex, elemIndex + dim[dimIndex]));
      elemIndex += dim[dimIndex];
    } else {
      for (let i = 0; i < dim[dimIndex]; i++) {
        result.push(_nest(dimIndex + 1));
      }
    }

    return result;
  }
  return _nest(0);
}

// const test = broadcast(
//   [ 
//     [1], 
//     [4], 
//     [6]
//   ], 
//   [ 2, 1, 6 ]
// )((x, y) => x+y);

// console.log(test);



