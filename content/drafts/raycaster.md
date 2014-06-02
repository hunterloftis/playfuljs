---
title: 'A dead-simple FPS'
date: 2014-05-30
template: article.jade
---

Today, let's drop into a world you can reach out and *touch*.
In this article, we'll compose a first-person exploration from scratch,
in 250 lines and without difficult math, using a technique called raycasting.
You may have seen it before in games like Daggerfall and Duke Nukem 3D,
or more recently in Notch Persson's ludum dare entries.
Ready to build your own?
[ [Demo] ](/demos/raycaster)
[ [Source] ](https://github.com/hunterloftis/playfuljs/blob/master/content/demos/raycaster.html)

Raycasting feels like cheating, and as a lazy programmer, I love it.
You get the immersion of a 3D environment without many of the
complexities of "real 3D" to slow you down.
For example, raycasts run in constant time,
so you can load up a massive world and it will *just work*, without optimization,
as quickly as a tiny world.
Also, levels are defined as simple grids rather than as trees of polygon meshes,
so you can dive right in without a 3D modeling background or mathematics PhD.

It's one of those techniques that blows you away with simplicity.
In fifteen minutes you'll be taking photos of your office walls and
checking your HR documents for rules against "building workplace gunfight simulations."

[<img src='../images/raycaster-result.jpg'>](/demos/raycaster)

### The Player

Everything begins and ends with the player.
The player in a raycaster can be represented with three properties:
x position, y position, and facing direction.

```js
function Player(x, y, direction) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.weapon = new Bitmap('../knife_hand.png', 319, 320);
  this.paces = 0;
}
```

Everything else is gravy.

### The Map

We'll store our map as a simple two-dimensional array.
In this array, 0 represents *no wall* and 1 represents *wall*.
You can get a lot more complex than this... for example,
you could render walls of arbitrary heights, or you could
pack several 'stories' of wall data into the array,
but for our first attempt 0-vs-1 works great.

```js
function Map(size) {
  this.size = size;
  this.wallGrid = new Uint8Array(size * size);
  this.skybox = new Bitmap('../deathvalley_panorama.jpg', 4000, 1290);
  this.wallTexture = new Bitmap('../wall_texture.jpg', 1024, 1024);
  this.light = 0;
}
```

We're also storing a couple of images for the map
(a single wall texture and a skybox)
and an ambient light value.

### Casting a ray

Here's the trick: a raycasting engine *doesn't draw the whole scene at once.*
Instead, it divides the scene into independent columns and renders them all individually.
Each column represents a single 'ray' cast out from the player at a particular angle.
If the ray hits a wall, it measures the distance to that wall.
Columns without a hit remain empty, and you draw a rectangle in columns with a hit.
The height of the rectangle is determined by the distance the ray traveled -
more distant walls are drawn shorter.
This all adds up to a fast, yet powerful 3D illusion!

#### 1. Find the ray's angle

First, you find the angle at which you need to cast the ray.
The angle depends on three things: the direction the player is facing,
the field-of-view of the camera, and which column you're drawing.

```js
var angle = this.fov * (column / this.resolution - 0.5);
var ray = map.cast(player, player.direction + angle, this.range);
```

#### 2. Step through the grid

Next, we need to check for walls in the ray's path.
We do this by finding all the points where the ray intersects
with a horizontal or vertical grid line and checking
whether or not a wall exists at that point in the grid.

```js
function ray(origin) {
  var stepX = step(sin, cos, origin.x, origin.y);
  var stepY = step(cos, sin, origin.y, origin.x, true);
  var nextStep = stepX.length2 < stepY.length2
    ? inspect(stepX, 1, 0, origin.distance, stepX.y)
    : inspect(stepY, 0, 1, origin.distance, stepY.x);

  if (nextStep.distance > range) return [origin];
  return [origin].concat(ray(nextStep));
}
```

This recursive function finds the nearest horizontal gridline (stepX)
and the nearest vertical gridline (stepY).
It chooses whichever is closer and looks for a wall (inspect).
This continues until the ray passes beyond a maximum distance.

```js
var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
var dy = dx * (rise / run);
```

Finding grid intersections is straightforward: just look for whole numbers of x (1, 2, 3, etc).
Then, find a matching y by multiplying by the line's slope (rise / run).
To find vertical intersections, we flip x and y.

#### 3. Draw a column

Once we've traced a ray, we need to draw any walls that it found in its path.
This requires two properties: distance from the player, and grid offset.

- *Distance* tells us how tall to draw our rectangle.
- *Offset* tells us which part of the wall's texture we should draw on this column.
Since we're using a grid of whole numbers, the texture offset is just any remainder.
For example, a ray that intersects with a wall at (10, 8.2) would have an offset of 0.2.

```js
Camera.prototype.project = function(height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = this.height * height / z;
  var bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  }; 
};
```

Oh damn, where did this cosine come in? I promised easy math!
If we just use the raw distance from the player, we'll end up with a fisheye effect.
Why? Imagine that you're facing a wall. The edges of the wall to your left and right
are further away from you than the center of the wall.
But you don't want straight walls to buldge out in the middle!
To render walls as we really see them, we figure out how far away from the
plane of view of the player. Like this:

(illustration)

Finally, we divide the height of the wall by z.
Far away walls with large distances will have small heights,
and nearby walls with small distances will have large heights.
Beautiful.

### The Camera

The camera's job is to draw the map, each frame, from the player's perspective.
It will be responsible for rendering each strip as we sweep from the
left to the right of the screen.

```js
Camera.prototype.render = function(player, map) {
  this.drawSky(player.direction, map.skybox, map.light);
  this.drawColumns(player, map);
  this.drawWeapon(player.weapon, player.paces);
};
```

The camera's most important properties are resolution, field-of-view (fov), and range.
- *Resolution* determines how many strips we draw each frame: how many rays we cast.
- *Field-of-view* determines how wide of a lens we're looking through: the angles of the rays.
- *Range* determines how far away we can see: the maximum length of each ray.

