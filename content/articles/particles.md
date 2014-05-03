---
title: 'Particle effects are easy'
date: 2014-05-03
template: article.jade
---

Almost every game uses particles to create engaging effects for
fire, smoke, explosions, fabric, water, gunfire, and more.
Learn how to use this simple technique to build your own stunning visuals.

*The humble particle*
```js
function Particle(x, y) {
  this.x = x;
  this.y = y;
}
```

First, let's make one particle move.
For this, we'll use something called 'Euler integration.'
That's just a fancy way to say that we're going to find out how fast our
particle is moving by comparing its position this frame to its position last frame.

*Euler integration*
```js
function Particle(x, y) {
  this.x = this.oldX = x;
  this.y = this.oldY = y;
}

Particle.prototype.step = function() {
  var velocityX = this.x - this.oldX;
  var velocityY = this.y - this.oldY;
  this.oldX = this.x;
  this.oldY = this.y;
  this.x += velocityX;
  this.y += velocityY;
};
```
