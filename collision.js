var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.border = "solid 1px black";

var c = canvas.getContext("2d");

var circleAmount = 20;
var colorArray = ["#1445D9", "#325CD9", "#203B8C", "#F29580", "#D91C0B"];

function randomNumber(min, max) {
  if (min < max) {
    let num = Math.floor(Math.random() * (max - min)) + min;
    if (num != 0) {
      return num;
    } else {
      randomNumber(min, max);
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
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.Draw();
  };
}

var circleArray = [];

function initCircles(amount) {
  for (var i = 0; i < amount; i++) {
    var radius = randomNumber(5, 50);

    var x = randomNumber(radius, window.innerWidth - radius);
    var y = randomNumber(radius, window.innerHeight - radius);
    var dx = randomNumber(-3, 3);
    var dy = randomNumber(-3, 3);
    var color = colorArray[randomNumber(0, colorArray.length)];
    circleArray.push(new Circle(x, y, radius, dx, dy, color));
  }
}

function init() {
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

animate();
