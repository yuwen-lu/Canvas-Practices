var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.style.border = "solid 1px black";

var c = canvas.getContext("2d");

const circleAmount = 200;
// const gravity = 1;
const fraction = 0.9;
const distance = 50; // the activation distance of mouse to the circles
const colorArray = ["#1445D9", "#325CD9", "#203B8C", "#F29580", "#D91C0B"];
let mouse = {
  x: undefined,
  y: undefined
};

window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

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
  this.opacity = 0; //initial opacity, 0

  this.Draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    c.save();
    // the following line sets the global opacity of the canvas, which only affects the current
    // circle cuz it's only filling the current circle.
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();

    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  };

  this.Update = circleArray => {
    // the following code is for moving and (gravity)
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
    // this.dy += gravity;

    // check if the circle is close to the mouse, if so increase opacity
    if (
      CircleDistance(this.x, this.y, mouse.x, mouse.y) <= distance &&
      this.opacity < 0.4
    ) {
      this.opacity += 0.02;
    }

    if (
      CircleDistance(this.x, this.y, mouse.x, mouse.y) > distance &&
      this.opacity > 0
    ) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
      console.log(this.opacity);
    }

    // check if the circle is colliding with other circles
    circleArray.forEach(current => {
      if (current !== this) {
        // console.log(CircleDistance(this.x, current.x, this.y, current.y));
        if (
          CircleDistance(this.x, this.y, current.x, current.y) <=
          this.radius + current.radius
        ) {
          //collide
          this.dx = -this.dx;
          this.dy = -this.dy;
          current.dx = -current.dx;
          current.dy = -current.dy;
        }
      }
    });

    this.Draw();
  };
}

function CircleDistance(x1, y1, x2, y2) {
  let xdis = x1 - x2;
  let ydis = y1 - y2;
  return Math.sqrt(xdis * xdis + ydis * ydis);
}

var circleArray = [];

function initCircles(amount) {
  for (var i = 0; i < amount; i++) {
    let radius = randomNumber(5, 50);

    let x = randomNumber(radius, window.innerWidth - radius);
    let y = randomNumber(radius, window.innerHeight - radius);
    var dx = randomNumber(-2, 2);
    var dy = randomNumber(-2, 2);
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
    current.Update(circleArray);
  });
}

animate();
