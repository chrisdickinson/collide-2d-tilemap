module.exports = function(field, tilesize, dimensions) {
  dimensions = dimensions || [ 
    Math.sqrt(field.length) >> 0
  , Math.sqrt(field.length) >> 0
  ] 

  field = typeof field === 'function' ? field : function(x, y) {
    return this[x + y * dimensions[1]]
  }.bind(field) 

  var coords

  coords = [0, 0]

  return collide

  function collide(box, vec, oncollision) {
    if(vec[0] === 0 && vec[1] === 0) return

    // collide x, then y
    collideaxis(0)
    collideaxis(1)

    function collideaxis(axis) {
      var posi = vec[axis] > 0
        , leading = box[posi ? 'max' : 'base'][axis] 
        , dir = posi ? 1 : -1
        , opposite_axis = +!axis
        , start = (box.base[opposite_axis] / tilesize) >> 0
        , end = Math.ceil(box.max[opposite_axis] / tilesize) >> 0
        , tilespace = (leading / tilesize) >> 0
        , tilespace_end = (((leading + vec[axis]) / tilesize) >> 0) + dir
        , done = false
        , edge_vector
        , edge
        , tile

      // loop from the current tile coord to the dest tile coord
      //    -> loop on the opposite axis to get the other candidates
      //      -> if `oncollision` return `true` we've hit something and
      //         should break out of the loops entirely.
      //         NB: `oncollision` is where the client gets the chance
      //         to modify the `vec` in-flight.
      // once we're done translate the box to the vec results
      for(var i = tilespace; !done && i !== tilespace_end; i += dir) {
        if(i < 0 || i >= dimensions[axis]) continue
        for(var j = start; j !== end; ++j) {
          if(j < 0 || j >= dimensions[opposite_axis]) continue

          coords[axis] = i
          coords[opposite_axis] = j
          tile = field.apply(field, coords)

          if(tile === undefined) continue

          edge = dir > 0 ? i * tilesize : (i + 1) * tilesize
          edge_vector = edge - leading

          if(oncollision(axis, tile, coords, dir, edge_vector)) {
            done = true
            break
          } 
        }
      }

      coords[0] = coords[1] = 0
      coords[axis] = vec[axis]
      box.translate(coords)
    }
  }  
}
