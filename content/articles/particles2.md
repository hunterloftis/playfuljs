---
title: 'Physics for the lazy'
date: 2014-05-04
template: article.jade
---

As you saw in ['Particle effects are easy'](/particle-effects-are-easy/),
particles provide a simple but powerful tool for animation.
In this article, we'll add some basic physics to create
a particle-based water fountain.
[ [Demo] ](http://demos.playfuljs.com/particles2)
[ [Source] ](https://github.com/hunterloftis/playfuljs-demos/blob/gh-pages/particles2/index.html)

### Moving particles

We want to launch our water droplets into the air with some velocity,
so let's give Particle a *move* method that we'll use to spray particles
at some horizontal (x) and vertical (y) speed.

```js
Particle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
};
```

Since Verlet integration finds velocity by comparing the current
position to the last position, changing x and y without changing oldX and oldY will *push*
the particles.

### Applying gravity

Every frame, we want gravity to pull our particles back down to earth.
With our *move* method, this is dead simple:

```js
drops[i].move(0, GRAVITY);
```

### Bouncing

Let's give our water droplets a little bounce as they splash to the ground.
Since a *bounce* is just a change in direction from down to up,
we'll need to reverse their vertical velocity whenever their y position
is outside of the container.

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

Each frame, we'll spray five new water droplets into the air with
a somewhat random trajectory. Then, we'll loop through
all the droplets and push each one down with gravity, integrate (update) its position,
and check whether or not it needs to bounce.
Finally, we'll draw each particle as a line from its last position to its current position.

```js
for (var j = 0; j < 5; j++) {

  // "stop" the water after 1000 drops
  if (drops.length < 1000) {
    var drop = new Particle(width * 0.5, height);

    // up and a little to the left or right
    drop.move(Math.random() * 4 - 2, Math.random() * -2 - 15);
    drops.push(drop);
  }
}
for (var i = 0; i < drops.length; i++) {
  drops[i].move(0, GRAVITY);    // add a downward force
  drops[i].integrate();         // move based on current velocity
  drops[i].bounce();            // check y against the ground
  drops[i].draw();
}
```

## Try it out

Splash around in the [water fountain demo](http://demos.playfuljs.com/particles2).

### What's next?

- Can you change the shape of the fountain?
- How would you increase or decrease the density of the droplets?
- What happens if you eliminate gravity or make it very powerful?
- What does multiplying velocity by 0.3 do in the *bounce* method?
- Can you turn this water fountain into fireworks?
- Can you 'reset' droplets that have already fallen to make the fountain run forever?
