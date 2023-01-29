const express = require('express');
const path = require("path");
const morgan = require('morgan');
const requestIp = require('request-ip');
const Stream = require('node-rtsp-stream');
const moment = require('moment');
const app = express();

app.use(morgan('combined'));

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


localHost = ["127.0.0.1", "172.30.1.41"]
var rtspList = [
    {"url": 'rtsp://admin:00000@121.158.248.187:554/ch4/1', "port": 9021, "stream": null, "lastData": null},
    {"url": 'rtsp://admin:00000@121.158.248.187:554/ch6/1', "port": 9999, "stream": null, "lastData": null},
];
var context = []

var nowTime = moment().format('HH:mm')
app.get('/', (req, res) => {
    if ( nowTime <="00:00" ||nowTime>='01:00' )
        res.sendFile(path.join(__dirname,"html/preparing.html"))
    if (localHost.includes(requestIp.getClientIp(req))) {
        console.log("로컬로 접속")
        console.log("접속시간 " ,)
        res.sendFile(path.join(__dirname, 'html/test.html'));

    } else {
        console.log("외부 ip로 접속")
       res.sendFile(path.join(__dirname, 'html/test1.html'));
    }
})

const server = app.listen(5000, '0.0.0.0', () => {
    console.log("Server is open at port:5000");
});