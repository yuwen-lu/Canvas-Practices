var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initCircles();
});

var radius = 5;
var maxRadius = 50;

function Circle(xcoord, ycoord, dxcoord, dycoord, colorString, radius) {
  this.x = xcoord;
  this.y = ycoord;
  this.dx = dxcoord;
  this.dy = dycoord;
  this.colorString = colorString;
  this.radius = radius;
  this.minRadius = radius;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    c.strokeStyle = this.colorString;
    c.fillStyle = this.colorString;

    c.stroke();
    c.fill();
  };

  this.move = function() {
    if (this.x <= this.radius || this.x >= innerWidth - this.radius) {
      this.dx = -this.dx;
    }
    if (this.y <= this.radius || this.y >= innerHeight - this.radius) {
      this.dy = -this.dy;
    }
    if (
      Math.abs(this.x - mouse.x) < 50 &&
      Math.abs(this.y - mouse.y) < 50 &&
      this.radius < maxRadius
    ) {
      this.radius += 1;
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }
    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };
}

var circleArray = [];
var colorArray = ["#1445D9", "#325CD9", "#203B8C", "#F29580", "#D91C0B"];

function initCircles() {
  circleArray = [];
  for (var i = 0; i < 800; i++) {
    var xcoord = Math.random() * (window.innerWidth - radius * 2) + radius;
    var ycoord = Math.random() * (window.innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 2;
    var dy = (Math.random() - 0.5) * 2;
    // set the random color for the circles
    var red = String(Math.floor(Math.random() * 255));
    var green = String(Math.floor(Math.random() * 255));
    var blue = String(Math.floor(Math.random() * 255));
    var alpha = 1; // or some random value
    var colorString =
      "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
    var color = colorArray[Math.floor(Math.random() * colorArray.length)];
    var radius = Math.random() * 5 + 1;
    circleArray.push(new Circle(xcoord, ycoord, dx, dy, color, radius));
  }
}
initCircles();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  circleArray.forEach(function(current) {
    current.move();
  });
}
animate();
