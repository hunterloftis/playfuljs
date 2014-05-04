---
title: 'A particle fountain'
date: 2014-05-04
template: article.jade
---

As you saw in ['Particle effects are easy'](/particle-effects-are-easy/),
particles provide a simple but powerful tool for animation.
In this article, we'll add some basic physics to create
a particle-based water fountain.
[ [Demo] ](/demos/particles2)

### Moving particles

We want to launch our water droplets into the air with some velocity,
so let's give Particle a *move* method that we'll use to create a spray.

```js
Particle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
};
```

Since Euler integration finds velocity by comparing the current
position to the last position, moving x and y once will
give the particles a permanent push.

### Applying gravity

Every frame, we want gravity to pull our particles back down to earth.
With our *move* method, this is dead simple:

```js
drops[i].move(0, GRAVITY);
```

### Bouncing

Let's give our water droplets a little bounce as they splash to the ground.
We'll need to reverse their vertical velocity whenever their y position
passes through the ground.

```js
Particle.prototype.bounce = function() {
  if (this.y > height) {
    var velocity = this.getVelocity();
    this.oldY = height;
    this.y = this.oldY - velocity.y * 0.3;
  }
};
```

### Putting it all together

Each frame, we'll spray five water droplets into the air with
a somewhat random trajectory. Then, we'll loop through
all the droplets and apply gravity to them, integrate their positions,
check whether or not they're bouncing off the ground, and finally draw them.

```js
for (var j = 0; j < 5; j++) {
  if (drops.length < 1000) {
    var drop = new Particle(width * 0.5, height);
    drop.move(Math.random() * 4 - 2, Math.random() * -2 - 15);
    drops.push(drop);
  }
}
for (var i = 0; i < drops.length; i++) {
  drops[i].move(0, GRAVITY);
  drops[i].integrate();
  drops[i].bounce();
  drops[i].draw();
}
```

## Try it out

Splash around in our [water fountain demo](/demos/particles2).

## Get creative!

- Can you change the shape of the fountain?
- How would you make a denser or less-dense spray?
- What happens if you eliminate gravity or make it very powerful?
- What does multiplying velocity by 0.3 do in the *bounce* method?
