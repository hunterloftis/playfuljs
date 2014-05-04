---
title: 'Particle effects are easy'
date: 2014-05-03
template: article.jade
---

Almost every game uses particles to create engaging effects for
fire, smoke, explosions, fabric, water, gunfire, and more.
Learn how to use this simple yet powerful technique to build your own stunning visuals.
[ [Demo] ](/demos/particles)

*The humble particle*
```js
function Particle(x, y) {
  this.x = this.oldX = x;
  this.y = this.oldY = y;
}
```

First, we define what a particle is: a *current position* (x, y),
plus an *old position* (oldX, oldY). At first, they're the same thing
because the particle isn't moving yet.

Now, let's teach our particle how to move with *Euler integration.*
That's just a fancy way to say that we're going to find out how fast our
particle is moving by comparing its position this frame to its position last frame.

*Euler integration*
```js
Particle.prototype.integrate = function() {
  var velocityX = this.x - this.oldX;
  var velocityY = this.y - this.oldY;
  this.oldX = this.x;
  this.oldY = this.y;
  this.x += velocityX;
  this.y += velocityY;
};
```

For this demo, let's push each particle towards the mouse on every frame.
This will make a cloud of particles that tends to flock around the cursor.

*Flocking behavior*
```js
Particle.prototype.attract = function(x, y) {
  var dx = x - this.x;
  var dy = y - this.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  this.x += dx / distance;
  this.y += dy / distance;
};
```

Since we're dividing the push by distance, closer particles will
be more attracted to the mouse than more distant particles.

Each frame we loop through all of our particles, attracting, integrating,
and drawing as fast as possible for smooth animation.

*The main loop*
```js
for (var i = 0; i < particles.length; i++) {
  particles[i].attract(mouse.x, mouse.y);
  particles[i].integrate();
  particles[i].draw();
}
```

## Try it out

If an image is worth 1000 words, a [60fps Demo](/demos/particles) must be priceless.

