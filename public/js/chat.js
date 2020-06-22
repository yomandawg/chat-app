const socket = io() // the client is able to connect to WebSocket from `/socket.io/socket.io.js` statement in html

// socket.on('countUpdated', (count) => {
//   console.log('The count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('Clicked')
//   socket.emit('increment')
// })

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message)
})

socket.on('message', (message) => {
  console.log(message)
})