---
title: 'Particle effects are easy'
date: 2014-05-03
template: article.jade
---

Almost every game uses particles to create engaging effects for
fire, smoke, explosions, fabric, water, gunfire, and more.
Learn how to use this simple yet powerful technique to build your own stunning visuals.
[ [Demo] ](/articles/particles-demo/)

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

Now let's push that particle towards the mouse on every frame.
This will make a cloud of particles tend to flock around the cursor.

*Flocking behavior*
```js
Particle.prototype.attract = function(x, y) {
  var xDistance = x - this.x;
  var yDistance = y - this.y;
  this.x += xDistance * 0.1;
  this.y += yDistance * 0.1;
};
```

Now we just loop through all of our particles to
push each one towards the mouse, integrate it, and finally draw it.
We'll want to do this as fast as possible for smooth animation.

*Each frame*
```js
for (var i = 0; i < particles.length; i++) {
  particles[i].attract(mouse.x, mouse.y);
  particles[i].integrate();
  particles[i].draw();
}
```
