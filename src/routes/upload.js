const {Router} = require('express');
const router = Router();
const { SerialPort, ReadlineParser } = require('serialport')
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser());
const admin = require('firebase-admin');
var i = 1;

// var serviceAccount = require("../database/credentials.json");

// admin.initializeApp({
//     credentials: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://apifrost-13087-default-rtdb.firebaseio.com/'
// });

const db = admin.database();

port.on('open', async() => {
    console.log('Serial Port  COM3 is opened.');
    leer();
}).on('error', async(err) => {
    console.error(err);
});

const leer = async() => parser.on('data', (data) => {
    if (i === 30) {
        db.ref('data').push(jsonconver(data))
        i = 1;
    } else {
        i++;
    }
});

function jsonconver(data) {
    const con = data.split(',');
    var fecha = new Date();
    const jsonpar = {
        "hydrometer": parseFloat(con[0]),
        "humidity": parseFloat(con[1]),
        "temperature": parseFloat(con[2]),
        "dateGrw": fecha,
        "localDate": fecha.toLocaleDateString(),
        "hour": fecha.toLocaleTimeString()
    };
    return jsonpar;
}

module.exports = router;