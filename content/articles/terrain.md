---
title: 'Generating realistic terrain'
date: 2014-05-05
template: article.jade
---

As programmers, we love to build things,
and what could be more exciting than building a *world?*
Minecraft, Terragen, Skyrim, and every flight simulator ever all use some sort of fractal terrain generation.
Today we'll explore the beautifully simple diamond-square algorithm so you, too can play God.
[ [Demo] ](/demos/terrain)
[ [Source] ](https://github.com/hunterloftis/playfuljs/blob/master/content/demos/terrain.html)

Programmers tend to be lazy (I speak from experience), and one nice side effect of laziness is really
brilliant ways to avoid work. In this case, instead of spending mind-numbing
hours manually creating what would likely be pretty lame rocky surfaces, we'll get
spiritual and teach the computer *what it means to be a rock.*
We'll do this by generating fractals, or shapes that repeat patterns in smaller and smaller variations.

I don't have any way to prove that terrain is a fractal but this method looks really damn good,
so maybe you'll take it on faith.

### Height maps

We'll store our terrain as a simple height map:
a 2-dimensional array of values that represent the height of terrain at that point.
With a two-dimensional array, we can render our heights however we like -
canvas, webgl, etc.

```js
function Terrain(detail) {
  this.size = Math.pow(2, detail) + 1;
  this.max = this.size - 1;
  this.map = new Float32Array(this.size * this.size);
}
```

You can apply this algorithm to any dimension of grid, but it's easiest with a square
that's a power of 2 plus 1.
The terrain will be a cube where the largest mountain will fit inside of the size as well.

### The algorithm

Here's the idea: take a flat square. Split it into four sub-squares, and move their middle point
up or down by a random offset. Split each of those into more sub-squares and repeat,
each time reducing the range of the random offset so that *the first choices matter most*
while *the later choices provide smaller details*.

That's the [midpoint displacement algorithm](http://en.wikipedia.org/wiki/Diamond-square_algorithm#Midpoint_displacement_algorithm).
The diamond-square algorithm from this tutorial is based on similar principles but generates more natural-looking results.
Instead of just dividing squares, it alternates between dividing squares and dividing diamonds.

#### 1. Set the corners

First, set the corners to an average value.
We'll start all corners halfway between the maximum and minimum values.

```js
this.set(0, 0, self.max / 2);
this.set(this.max, 0, self.max / 2);
this.set(this.max, this.max, self.max / 2);
this.set(0, this.max, self.max / 2);
```

#### 2. Divide the map

Now, we'll recursively look at smaller and smaller divisions of the height map.
At each division, we'll update a single (center) point during the *square* phase
and four (edge) points during the *diamond* phase.

```js
divide(this.max);

function divide(size) {
  var x, y, half = size / 2;
  var scale = roughness * size;
  if (half < 1) return;

  for (y = half; y < self.max; y += size) {
    for (x = half; x < self.max; x += size) {
      square(x, y, half, Math.random() * scale * 2 - scale);
    }
  }
  for (y = 0; y <= self.max; y += half) {
    for (x = (y + half) % size; x <= self.max; x += size) {
      diamond(x, y, half, Math.random() * scale * 2 - scale);
    }
  }
  divide(size / 2);
}
```

#### 3. The shapes

The square step averages the center based on the corner values,
while the diamond step averages every edge based on a diamond of values around it.

(picture here)

They're both pretty simple:

```js
function diamond(x, y, size, offset) {
  var ave = average([
    self.get(x, y - size),      // top
    self.get(x + size, y),      // right
    self.get(x, y + size),      // bottom
    self.get(x - size, y)       // left
  ]);
  self.set(x, y, ave + offset);
}
```
