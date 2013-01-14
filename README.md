# collide-2d-tilemap

an api for user-defined collision-detection between [aabb-2d](https://github.com/chrisdickinson/aabb-2d) objects and tilemaps.

```javascript

var my_tilemap = [
        0, 0, 0, 1
      , 1, 0, 0, 1
      , 1, 0, 0, 1
      , 1, 1, 1, 1
    ]

var collisions = require('collide-2d-tilemap')
  , collide

var player = aabb([0, 0], [16, 16])
  , vec = [0, 0]

// collisions(field, size of tile in pixels, [width, height])
collide = collisions(my_tilemap, 32)

my_game_event_loop(function(dt) {
  vec = get_player_input() * dt 

  collide(player, vec, function(axis, tile_data, coords, dir, diff) {
    if(tile) {
      vec[axis] = diff
      return true
    }
  })

})

```

the method used is borrowed [from higherorderfun](http://higherorderfun.com/blog/2012/05/20/the-guide-to-implementing-2d-platformers/).

in short:

1. for movement in each axis (x, y):
2. we go from the tile coordinate of the leading edge of the movement to the tile coordinate of the destination of that edge.
3. we go from the base tile coordinate of the opposite axis to the max tile coordinate of the opposite axis.
4. for each of those tile coordinates `<x>` and `<y>`, we call the `oncollision` callback. if it returns true, we've hit something and we stop checking that axis for collisions.
5. we apply the movement contained in `vec[axis]` to the box.

this lets you do things like add slopes, add effects that don't necessarily stop collision, etc, etc.

> ## Warning
> For best results, use integers.
> If you're using gl-matrix, you can simply
> swap out `vec2.create` with `vec2.create = function() { return new Int32Array(2) }`.

# API

### collision(field, tilesize[, dimensions]) -> collide function

Produces a `collide(aabb, vec2, oncollide)` function.

`field` may be a single-dimension array of integers (in which case `dimensions` can be inferred if not provided), or it may be a function in the form `fn(tile_x_idx, tile_y_idx) -> tile data integer`. if it's a function, `dimensions` is required.

`tilesize` is the pixel size of a tile. 

`dimensions` is an array of integers `[width, height]`.
if it is not provided it will attempt to set to `[Math.sqrt(field.length), Math.sqrt(field.length)]` (that is, it assumes a square tilemap).

### collide(aabb, vec, oncollide) -> undefined

attempt to advance `aabb` by `vec` against the tilemap. **destructive**, it will actually call `aabb.translate`.

`vec` is assumed to be a `gl-matrix`-style `vec2`, or `[x, y]`.

`aabb` is assumed to be a [aabb-2d](https://github.com/chrisdickinson/aabb-2d) instance.

`oncollide` is a callback function, taking:

* `axis`: an integer representing the axis of movement. `0` or `1`.
* `tile`: the tile data represented at this candidate coordinate.
* `coords`: a two dimensional array of tile coordinates.
* `dir`: `1` or `-1`, representing the direction of movement along this axis.
* `dX`: the distance to the appropriate edge of this tile, if a collision is desired (such that you can write `vec[axis] = dX` if you'd like to collide with that tile). 

If your callback returns `true`, it is assumed that you're done checking tiles along this access and it will move to the next axis if any.

# License

MIT
