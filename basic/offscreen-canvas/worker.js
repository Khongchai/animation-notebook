let context;
let canvas;
let tick = 0;

let objectForTransferringData;

onmessage = function (message) {
  canvas = message.data.drawingSurface;
  context = canvas.getContext("2d");

  // Returns the data for the current context back to the main thread.
  // But this doesn't work....for some reason.
  this.postMessage(JSON.parse(JSON.stringify(context)));

  objectForTransferringData = message.data.objectForTransferringData;

  draw();
};

function draw() {
  console.log(objectForTransferringData.foo.a);

  tick += 0.1;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    100,
    0 + tick,
    Math.PI + tick,
    true
  );
  context.stroke();

  /*
    By doing this, we commit changes to the the main canvas.
    The worker.requestAnimationFrame is a new version for the old 
    offscreenContextcommit().then(draw);
  */
  requestAnimationFrame(draw);
}
