import { render, html } from '../uhtml.js';

//vectorize -> image: RGBA, vectorFit: pixels => path: array
//input is red 128:north,64:south, green 128:east,64:west, blue 128:start,64:stop
function workerInternal() {

  function transform(imageRGBA, vectorFit = 1, sort = true) {
    // FIXME: is this a closed path? a set? is [from,to] redundant for each entry?
    var h = imageRGBA.height;
    var w = imageRGBA.width;
    var input = imageRGBA.data;
    var northsouth = 0;
    var north = 128;
    var south = 64;
    var eastwest = 1;
    var east = 128;
    var west = 64;
    var startstop = 2;
    var start = 128;
    var stop = 64;
    var path = [];
    //
    // edge follower
    //
    function follow_edges(row, col) {
      if (
        input[(h - 1 - row) * w * 4 + col * 4 + northsouth] != 0 ||
        input[(h - 1 - row) * w * 4 + col * 4 + eastwest] != 0
      ) {
        path[path.length] = [[col, row]];
        while (1) {
          if (input[(h - 1 - row) * w * 4 + col * 4 + northsouth] & north) {
            input[(h - 1 - row) * w * 4 + col * 4 + northsouth] =
              input[(h - 1 - row) * w * 4 + col * 4 + northsouth] & ~north;
            row += 1;
            path[path.length - 1][path[path.length - 1].length] = [col, row];
          } else if (
            input[(h - 1 - row) * w * 4 + col * 4 + northsouth] & south
          ) {
            input[(h - 1 - row) * w * 4 + col * 4 + northsouth] =
              input[(h - 1 - row) * w * 4 + col * 4 + northsouth] & ~south;
            row -= 1;
            path[path.length - 1][path[path.length - 1].length] = [col, row];
          } else if (input[(h - 1 - row) * w * 4 + col * 4 + eastwest] & east) {
            input[(h - 1 - row) * w * 4 + col * 4 + eastwest] =
              input[(h - 1 - row) * w * 4 + col * 4 + eastwest] & ~east;
            col += 1;
            path[path.length - 1][path[path.length - 1].length] = [col, row];
          } else if (input[(h - 1 - row) * w * 4 + col * 4 + eastwest] & west) {
            input[(h - 1 - row) * w * 4 + col * 4 + eastwest] =
              input[(h - 1 - row) * w * 4 + col * 4 + eastwest] & ~west;
            col -= 1;
            path[path.length - 1][path[path.length - 1].length] = [col, row];
          } else break;
        }
      }
    }
    //
    // follow boundary starts
    //
    for (var row = 1; row < h - 1; ++row) {
      col = 0;
      follow_edges(row, col);
      col = w - 1;
      follow_edges(row, col);
    }
    for (var col = 1; col < w - 1; ++col) {
      row = 0;
      follow_edges(row, col);
      row = h - 1;
      follow_edges(row, col);
    }
    //
    // follow interior paths
    //
    for (var row = 1; row < h - 1; ++row) {
      for (var col = 1; col < w - 1; ++col) {
        follow_edges(row, col);
      }
    }
    //
    // vectorize path
    //
    var error = vectorFit;
    var vecpath = [];
    for (var seg = 0; seg < path.length; ++seg) {
      var x0 = path[seg][0][0];
      var y0 = path[seg][0][1];
      vecpath[vecpath.length] = [[x0, y0]];
      var xsum = x0;
      var ysum = y0;
      var sum = 1;
      for (var pt = 1; pt < path[seg].length; ++pt) {
        var xold = x;
        var yold = y;
        var x = path[seg][pt][0];
        var y = path[seg][pt][1];
        if (sum == 1) {
          xsum += x;
          ysum += y;
          sum += 1;
        } else {
          var xmean = xsum / sum;
          var ymean = ysum / sum;
          var dx = xmean - x0;
          var dy = ymean - y0;
          var d = Math.sqrt(dx * dx + dy * dy);
          var nx = dy / d;
          var ny = -dx / d;
          var l = Math.abs(nx * (x - x0) + ny * (y - y0));
          if (l < error) {
            xsum += x;
            ysum += y;
            sum += 1;
          } else {
            vecpath[vecpath.length - 1][vecpath[vecpath.length - 1].length] = [
              xold,
              yold
            ];
            x0 = xold;
            y0 = yold;
            xsum = xold;
            ysum = yold;
            sum = 1;
          }
        }
        if (pt == path[seg].length - 1) {
          vecpath[vecpath.length - 1][vecpath[vecpath.length - 1].length] = [
            x,
            y
          ];
        }
      }
    }
    //
    // sort path
    //
    if (vecpath.length > 1 && sort == true) {
      var dmin = w * w + h * h;
      var segmin = null;
      for (var seg = 0; seg < vecpath.length; ++seg) {
        var x = vecpath[seg][0][0];
        var y = vecpath[seg][0][0];
        var d = x * x + y * y;
        if (d < dmin) {
          dmin = d;
          segmin = seg;
        }
      }
      if (segmin != null) {
        var sortpath = [vecpath[segmin]];
        vecpath.splice(segmin, 1);
      }
      while (vecpath.length > 0) {
        var dmin = w * w + h * h;
        var x0 =
          sortpath[sortpath.length - 1][
            sortpath[sortpath.length - 1].length - 1
          ][0];
        var y0 =
          sortpath[sortpath.length - 1][
            sortpath[sortpath.length - 1].length - 1
          ][1];
        segmin = null;
        for (var seg = 0; seg < vecpath.length; ++seg) {
          var x = vecpath[seg][0][0];
          var y = vecpath[seg][0][1];
          var d = (x - x0) * (x - x0) + (y - y0) * (y - y0);
          if (d < dmin) {
            dmin = d;
            segmin = seg;
          }
        }
        if (segmin != null) {
          sortpath[sortpath.length] = vecpath[segmin];
          vecpath.splice(segmin, 1);
        }
      }
    } else if ((vecpath.length > 1 && sort == false) || vecpath.length == 1)
      sortpath = vecpath;
    else sortpath = [];

    console.log("rez",sortpath);
    return sortpath;
  };

  self.onmessage = function(e) {
    const inputs = e.data;
    console.log('workerInternal.onmessage',inputs);

    buf = transform(inputs.img, inputs.vectorFit, inputs.sort );

    self.postMessage([buf]);

    self.close();
  };

};


export default {
  name: "img vectorize",
  inputs: [
    { name: "imageRGBA", type: "img_uint8" },
    { name: "vectorFit", type: "number", input: "box" },
    { name: "sort", type: "boolean", input: "check" }
  ],
  outputs: [
    { name: "vectors", type: "path" }
  ],
  onUpdate(node, container) {
    const path = node.outputs[0];
    render(
      container,
      html`
        <div><span>paths</span> <span>${path.length}</span></div>
        `
      );
  },
  func: async (img, vectorFit, sort) => {

    console.log("Vectorize Sort",sort);
    const blob = new Blob(["(" + workerInternal.toString() + "())"]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);
    console.log("after new Worker");

    const result = new Promise(resolve => {
      worker.onmessage = e => {
        console.log("receive worker.onmessage",e.data[0]);

        resolve(e.data[0]);
      };
    })

    console.log("work,postMessage");
    // FIXME: defaults
    if (vectorFit==0) {
      vectorFit=1;
      }
    worker.postMessage({img, vectorFit, sort});

    return await Promise.all([result]);
  }
}
