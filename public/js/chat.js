const socket = io() // the client is able to connect to WebSocket from `/socket.io/socket.io.js` statement in html

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMesssageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    // pass data to Mustache object in HTML
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // disable
  $messageFormButton.setAttribute('disabled', 'disabled')


  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, /* run when the event is acknowledged */ (error) => {
    // enable
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }

    console.log('Message delivered!')
  })
})

socket.on('locationMessage', (url) => {
  console.log(url)
  const html = Mustache.render(locationMesssageTemplate, {
    url
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.')
  }

  // disable
  $sendLocationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      // enable
      $sendLocationButton.removeAttribute('disabled')

      console.log('Location shared!')
    })
  })
})