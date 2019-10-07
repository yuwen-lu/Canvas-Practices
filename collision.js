var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.border = "solid 1px black";

var c = canvas.getContext("2d");

var circleAmount = 20;
var gravity = 1;
var fraction = 0.9;
var colorArray = ["#1445D9", "#325CD9", "#203B8C", "#F29580", "#D91C0B"];

function randomNumber(min, max) {
  if (min < max) {
    let num = Math.floor(Math.random() * (max - min)) + min;
    if (num != 0) {
      return num;
    } else {
      return randomNumber(min, max);
    }
  } else {
    console.log("error for function randomNumber: min value not smaller max");
  }
}

function Circle(x, y, radius, dx, dy, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.dx = dx;
  this.dy = dy;
  this.color = color;

  this.Draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.stroke();
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  this.Update = function() {
    // the following code is for moving and gravity
    if (
      this.x + this.dx <= this.radius ||
      this.x + this.dx >= canvas.width - this.radius
    ) {
      this.dx = -this.dx;
    }
    if (
      this.y + this.dy <= this.radius ||
      this.y + this.dy >= canvas.height - this.radius
    ) {
      this.dy = -this.dy * fraction;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.dy += gravity;

    this.Draw();
  };
}

function CircleDistance(x1, y1, x2, y2) {
  let xdis = x1 - x2;
  let ydis = y1 - y2;
  return Math.sqrt(xdis * xdis + ydis * ydis);
}
console.log(CircleDistance(1, 2, 3, 3));

var circleArray = [];

function initCircles(amount) {
  for (var i = 0; i < amount; i++) {
    let radius = randomNumber(5, 50);

    let x = randomNumber(radius, window.innerWidth - radius);
    let y = randomNumber(radius, window.innerHeight - radius);
    var dx = randomNumber(-3, 3);
    var dy = randomNumber(-3, 3);
    var color = colorArray[randomNumber(0, colorArray.length)];

    // if it's not the first circle, avoid it overlapping with any other circle
    if (i != 0) {
      for (let j = 0; j < circleArray.length; j++) {
        if (
          CircleDistance(x, y, circleArray[j].x, circleArray[j].y) <=
          radius + circleArray[j].radius
        ) {
          x = randomNumber(radius, window.innerWidth - radius);
          y = randomNumber(radius, window.innerHeight - radius);
          j = -1;
        }
      }
    }

    circleArray.push(new Circle(x, y, radius, dx, dy, color));
  }
  console.log(circleArray);
}

function init() {
  circleArray = [];
  initCircles(circleAmount);
}

init();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  circleArray.forEach(current => {
    current.Update();
  });
}

// animate();
