import nodeList from "./nodeList.js";


export function onUpload(event, node, name, value, wired, index) {
  const files = event.target.files;
  // console.log(node, name, value, wired, index);
  upload(files);

  function upload(files, extensions = []) {
    let file = files[0];
    let fileName = file.name.split(".");
    let name = fileName[0];
    const extension = fileName[fileName.length - 1];

    if (extensions.length > 0 && extensions.includes(enxtension))
      throw "Extension not recongized: " + fileName;

    readFile(file);
  }

  function readFile(file) {
    const nodeType = nodeList[node.type];
    const inputType = nodeType.inputs[index].type;
    if (inputType === "img_uint8") {
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = png_URL_handler
    }
  }

  function png_URL_handler(load_event) {
    var img = new Image()
    img.setAttribute("src", load_event.target.result)
    img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.height = img.height;
        canvas.width = img.width;
        if (img.width > img.height) {
            var x0 = 0
            var y0 = canvas.height * .5 * (1 - img.height / img.width)
            var w = canvas.width
            var h = canvas.width * img.height / img.width
        } else {
            var x0 = canvas.width * .5 * (1 - img.width / img.height)
            var y0 = 0
            var w = canvas.height * img.width / img.height
            var h = canvas.height
        }
        var ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, x0, y0, w, h)
        var ctx = canvas.getContext("2d")
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)

      // FIXME: Neil determined "dpi" info. is that important or useful?

      const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      node.inputs[index] = {
        data: imgData.data,
        width: imgData.width,
        height: imgData.height
      }
    }
  }
}

