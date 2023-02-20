const express = require('express');
const path = require("path");
const morgan = require('morgan');
const requestIp = require('request-ip');
const Stream = require('node-rtsp-stream');
const moment = require('moment');


var router = express.Router();
router.use('/bootstrap', express.static(path.join(__dirname,"../node_modules/bootstrap/dist")));

module.exports = router;


const app = express();

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


const startTime = "13:00"
const endTime = "15:00"
app.use(morgan('combined'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap




localHost = ["127.0.0.1", "172.30.1.41","172.30.1.3"]
var rtspList = [

    {"url": 'rtsp://admin:00000@121.158.248.187:554/ch4/1', "port": 9021, "stream": null, "lastData": null},
    {"url": 'rtsp://admin:00000@121.158.248.187:554/ch6/1', "port": 9999, "stream": null, "lastData": null},
];
var context = []

var rtspListLength = rtspList.length;
for (var i = 0; i < rtspListLength; i++) {
    openStream(rtspList[i]);


    var timer = setInterval(function (obj) {
        var today = new Date();

        if (obj.lastData !== undefined) {
            var stream_date = new Date(obj.lastData);
            var gap = (today.getTime() - stream_date.getTime()) / 1000;
            console.log(gap);
            if (gap >= 5) {//check gap of second
                obj.stream.stop();
                openStream(obj);


                obj.lastData = today;
                obj.stream = obj.stream.restartStream();

                obj.stream.mpeg1Muxer.on('ffmpegStderr', (data) => {
                    var today = new Date();
                    obj.lastData = today;
                });


            }
        }

    }, 1000, rtspList[i]);

}

function openStream(obj) {
    var stream = new Stream({
        name: 'name',
        streamUrl: obj.url,
        wsPort: obj.port,
        ffmpegOptions: { // options ffmpeg flags
            '-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30, // options with required values specify the value after the key
        }
    });

    obj.stream = stream;

    stream.mpeg1Muxer.on('ffmpegStderr', (data) => {
        var today = new Date();
        obj.lastData = today;
    });
}

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, './tes/index.html'));
})


app.get('/', (req, res,next) => {

    var nowTime = moment().format('HH:mm')
    console.log(nowTime)
    //00:00 시부터 01:12 시 까지 열람가능
    if (nowTime <= startTime || nowTime >= endTime)
        res.send("<h1>열람 시간이 종료 되었습니다.</h1>\n" +
            `<h2>열람 시간 : ${startTime} ~ ${endTime}</h2>`)
    else
        next()
});

app.get('/', async(req, res) => {

    if (localHost.includes(requestIp.getClientIp(req))) {
        console.log("로컬로 접속")
        res.sendFile(path.join(__dirname, 'html/test.html'));



    } else {
        console.log("외부 ip로 접속")
        res.sendFile(path.join(__dirname, 'html/test1.html'));
    }
})


const server = app.listen(5000, '0.0.0.0', () => {
    console.log("Server is open at port:5000");
});
