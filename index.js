

const webSocket = require('./socket');

Stream = require('node-rtsp-stream')
stream = new Stream({
    name: 'name',
    streamUrl: 'rtsp://admin:00000@121.158.248.187:554/ch4/1',
    wsPort: 9999,
    ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key
    }
})

stream1 = new Stream({
    name: 'name',
    streamUrl: 'rtsp://admin:00000@121.158.248.187:554/ch6/1',
    wsPort: 9998,
    ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30 // options with required values specify the value after the key
    }
})
