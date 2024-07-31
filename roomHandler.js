function makeId() {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

const handlerRoom = (io, socket, rooms) => {
  const create = (callback) => {
    const room = rooms.find(room => room.vacant)

    if (room) {
      room.players.push({
        id: socket.id,
        option: null,
        score: 0,
        optionLock: false
      })
      room.vacant = false
      socket.join(room.id)
      io.to(room.id).emit('room:get', room)
      callback(room.id)
    } else {
      const room = {
        id: makeId(),
        players: [{
          id: socket.id,
          option: null,
          score: 0,
          optionLock: false
        }],
        vacant: true
      }
      rooms.push(room)
      socket.join(room.id)
      io.to(room.id).emit('room:get', room)
      callback(room.id)
    }
  }

  const update = (payload) => {
    const index = rooms.findIndex(el => el.id === payload.id)
    if (index >= 0) {
      rooms[index] = payload
      io.to(payload.id).emit('room:get', payload)
    }
  }

  socket.on('room:create', create)
  socket.on('room:update', update)
}

module.exports = handlerRoom