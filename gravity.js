var canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var c = canvas.getContext("2d");

var time = 0; // the time that the circle has traveled
var timeInterval = 0.05; // timeInterval is the defined interval of time for each refresh
const g = 9.8; // the gravitition constant
var movingDirection = true; // the moving direction for the ball, downwards as true, upwards as false, default downwards
// the initial speed for each period
var vyInitial = 0;

function Circle(x, y, radius, vx, vy) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.vx = vx;
  this.vy = vy;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.stroke();
    c.fill();
  };

  this.move = function() {
    // 500 is the height of the land
    // first condition: if it's moving downwards
    if (movingDirection) {
      if (this.y + this.radius <= 500) {
        this.y +=
          this.vy * timeInterval +
          g * time * timeInterval +
          (g * timeInterval * timeInterval) / 2; // some math and physics
        this.vy = g * time;
        console.log("1");
      } else {
        this.y = 500 - this.radius; // make sure the circle is in place
        vyInitial = this.vy;
        time = 0;
        movingDirection = false;
        // this.vy = 0.8 * this.vy;
      }
    } else {
      if (this.vy > 0) {
        // the direction of the speed changed, which makes it a bit tricky
        this.y -=
          vyInitial * timeInterval -
          g * time * timeInterval -
          (g * timeInterval * timeInterval) / 2;
        console.log(
          vyInitial * timeInterval -
            g * time * timeInterval -
            (g * timeInterval * timeInterval) / 2
        );
        this.vy -= g * time;
        console.log("3", this.vy);
      } else {
        vyInitial = 0;
        time = 0;
        movingDirection = true;
      }
    }

    this.draw();
  };
}

var x = 400;
var y = 100;
var radius = 40;
// initial speed for the ball
var vx = 0;
var vy = 0;
var circle = new Circle(x, y, radius, vx, vy);

function init() {
  // draw the line to represent ground
  c.beginPath();
  c.moveTo(200, 500);
  c.lineTo(600, 500);
  c.stroke();
  circle.draw();
}

init();

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  init();
});

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, 600, 499);
  c.clearRect(0, 501, 600, 300);
  circle.move();

  time += timeInterval;
}

// animate();
