var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

const gravity = 1;
const loss = 0.99;
const circleAmount = 300;
const suspendDistance = 50;
var colorArray = ["#1445D9", "#325CD9", "#203B8C", "#F29580", "#D91C0B"];
var circleArray = [];
var mouse = {
  x: undefined,
  y: undefined
};

function Circle(x, y, radius, color, dx, dy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.dx = dx;
  this.dy = dy;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    c.fillStyle = this.color;

    c.stroke();
    c.fill();
  };

  this.move = function() {
    if (
      Math.abs(this.x - mouse.x) <= suspendDistance &&
      Math.abs(this.y - mouse.y) <= suspendDistance
    ) {
      // in the beginning no mouse movement is detected, mouse.x and y are undefined, this will always be false
      if (this.dy < 0) {
        this.dy = -this.dy;
      }
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
  circleArray = [];
  generateCircles(circleAmount);
});

generateCircles(circleAmount);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  circleArray.forEach(current => {
    current.move();
  });
}

animate();
