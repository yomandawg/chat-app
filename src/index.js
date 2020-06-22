const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
/*
  express module does `http.createServer` without calling it
  manually call `createServer` upon `app` for refactoring the code
  to slightly change its behavior to use socket.io
*/
const server = http.createServer(app)
const io = socketio(server) // raw http server

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  // socket.emit('countUpdated', count)

  // socket.on('increment', () => {
  //   count++
  //   // socket.emit('countUpdated', count) // for emitting to single client
  //   io.emit('countUpdated', count) // for emitting to every connection
  // })

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined!')

  socket.on('sendMessage', (message) => {
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!')
  })
})

// call listen on newly made `server`
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})