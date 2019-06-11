const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message',(message)=>{
    console.log(message)    
    const html = Mustache.render(messageTemplate,{
        message
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage', (locationMessage)=>{
    const htmlmessage = Mustache.render(locationTemplate,{
        locationMessage
    })
    $messages.insertAdjacentHTML('beforeend',htmlmessage)
})

$messageForm.addEventListener('submit',(e)=>{   
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    let msg = e.target.elements.message.value

    socket.emit('sendMessage',msg, (ackmsg)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        console.log(ackmsg)
    })
})

$sendLocationButton.addEventListener('click',(e) => {    
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{latitude: position.coords.latitude,longitude:position.coords.longitude},(ackmsg)=>{
            console.log('Location was shared!')
            $sendLocationButton.removeAttribute('disabled')

        })
    })
})