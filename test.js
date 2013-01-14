var ever = require('ever')
  , delegate = require('ever-delegate')
  , raf = require('raf')
  , collisions = require('./index')
  , vec2 = require('gl-matrix').vec2
  , aabb = require('aabb-2d')

// we want everything to be
// integer coordinates.
vec2.create = function() {
  return new Int32Array(2)
}

var canvas = document.getElementById('canvas')
  , context = canvas.getContext('2d')
  , body = document.body
  , speed = document.getElementById('speed')
  , speedout = document.getElementById('out')
speed.onchange = function() {
  speedout.innerHTML = speed.value
}
canvas.width = 300
canvas.height = 200

var field = [
      1, 1, 1, 1, 1, 1, 1, 1
    , 1, 0, 0, 0, 0, 0, 0, 1
    , 1, 0, 0, 0, 0, 0, 0, 1
    , 1, 0, 0, 0, 1, 1, 0, 1
    , 1, 0, 0, 1, 1, 0, 0, 1
    , 1, 0, 0, 0, 0, 0, 0, 1
    , 1, 1, 1, 1, 1, 0, 0, 1
    , 1, 1, 1, 1, 1, 1, 1, 1
    ]
  , tile_size = 16
  , collide = collisions(field, tile_size)
  , player = aabb([18, 18], [tile_size / 1, tile_size  / 1])
  , want_dir_x = 0
  , want_dir_y = 0
  , ee = ever(body)
  , vec = vec2.create()

raf(canvas)
  .on('data', function(dt) {
    canvas.width = canvas.width
    update(dt)
  })

function update(dt) {
  canvas.width = canvas.width
  vec[0] = want_dir_x * dt * speed.value
  vec[1] += 1 * dt * 0.2
  vec[1] += want_dir_y * dt * 0.333
  var hit = 'rgba(255, 0, 0, 0.25)'
    
  collide(player, vec, function(axis, tile, coords, dir, dd) {
    rect('rgba(255, 0, 255, 0.5)'
        , [coords[0] * tile_size, coords[1] * tile_size]
        , [tile_size, tile_size]
    )


    if(tile) {
      vec[axis] = dd
      hit = 'rgba(0, 255, 0, 0.25)'
      return true
    }
  }) 

  draw(hit)
}

function draw(color) {
  rect(color, player.base, player.vec)

  context.fillStyle = 'rgba(0,0,0,0.125)'
  for(var y = 0; y < 8; ++y) {
    for(var x = 0; x < 8; ++x) {
      if(!field[x + (y * 8)]) continue

      rect('rgba(0,0,0,0.5)', [x * tile_size, y * tile_size], [tile_size, tile_size])
    }
  } 
}

ee.on('keydown', function(ev) {
    switch(String.fromCharCode(ev.keyCode)) {
      case 'W': want_dir_y = -1; break
      case 'S': want_dir_y = +1; break
      case 'A': want_dir_x = -1; break
      case 'D': want_dir_x = +1; break
    } 
  })

ee.on('keyup', function(ev) {
    switch(String.fromCharCode(ev.keyCode)) {
      case 'W':
      case 'S': want_dir_y = 0; break
      case 'A':
      case 'D': want_dir_x = 0; break
    } 
  })

function rect(color, base, vec) {
  context.fillStyle = color
  context.fillRect(
      base[0], base[1]
    , vec[0], vec[1]
  )
}

