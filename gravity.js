var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var successVid = document.querySelector("video");

const gravity = 1;
const loss = 0.99;
const circleAmount = 10;
const suspendDistance = 50;
var colorArray = ["#1445D9", "#325CD9", "#203B8C", "#F29580", "#D91C0B"];
var circleArray = [];
var mouse = {
  x: undefined,
  y: undefined
};
var success = false;

function Circle(x, y, radius, color, dx, dy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dx = dx;
  this.dy = dy;
  this.disToMouse = {
    xdis: 100,
    ydis: 100 // initial distance, some random number greater than suspendDistance
  };
  this.hooked = false;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    c.fillStyle = this.color;

    c.stroke();
    c.fill();
  };

  this.move = function() {
    if (!this.hooked) {
      this.disToMouse.xdis = this.x - mouse.x;
      this.disToMouse.ydis = this.y - mouse.y;
    }
    if (
      Math.abs(this.disToMouse.xdis) <= suspendDistance &&
      Math.abs(this.disToMouse.ydis) <= suspendDistance
    ) {
      // in the beginning no mouse movement is detected, mouse.x and y are undefined, this will always be false

      // to let the balls fall down instead of flying up after release
      // if (this.dy < 0) {
      //   this.dy = -this.dy;
      // }
      this.x = mouse.x + this.disToMouse.xdis;
      this.y = mouse.y + this.disToMouse.ydis;
      this.hooked = true;
    } else {
      if (this.x < this.radius || this.x > innerWidth - this.radius) {
        this.dx = -this.dx;
      }
      if (this.y + this.dy > innerHeight - this.radius) {
        this.dy = -this.dy * loss;
      } else {
        this.dy += gravity;
      }
      this.x += this.dx;
      this.y += this.dy;
    }
    this.draw();
  };
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateCircles(amount) {
  for (var i = 0; i < amount; i++) {
    var radius = randomNumber(5, 50);

    var x = randomNumber(radius, window.innerWidth - radius);
    var y = randomNumber(radius, window.innerHeight - radius);
    var color = colorArray[randomNumber(0, colorArray.length)];
    var dx = randomNumber(-5, 5);
    var dy = randomNumber(-5, 5);

    circleArray.push(new Circle(x, y, radius, color, dx, dy));
  }
}

function checkSuccess() {
  var numOfHooked = 0;
  circleArray.forEach(current => {
    if (current.hooked) {
      numOfHooked++;
    }
  });
  if (numOfHooked == circleArray.length && numOfHooked != 0) {
    success = true;
  }
}

window.addEventListener("resize", function() {
  circleArray = [];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateCircles(circleAmount);
});

window.addEventListener("mousemove", event => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("click", () => {
  if (canvas.style.display == "none") {
    success = !success;
    canvas.style.display = "";
    // load the video again, which will also make it pause
    successVid.load();
    successVid.style.display = "none";
    console.log("hey");
  }
  circleArray = [];
  generateCircles(circleAmount);
});

// generateCircles(circleAmount);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  circleArray.forEach(current => {
    current.move();
  });
  checkSuccess();
  if (success) {
    successVid.style.display = "block";
    successVid.volume = 1;
    successVid.play();
    canvas.style.display = "none";
  }
}

animate();
