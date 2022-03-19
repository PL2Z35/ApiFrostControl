const { Router } = require("express");
const router = Router();
const admin = require("firebase-admin");
var serviceAccount = require("../database/apifrost-14309-firebase-adminsdk-k6jit-695d5ee812.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apifrost-14309-default-rtdb.firebaseio.com/",
});

const db = admin.database();

//Retorna todos los datos
router.get("/all", (req, res) => {
  db.ref("data").once("value", (snapshot) => {
    const data = snapshot.toJSON();
    res.json(data);
  });
});

//Retorna el ultimo dato
router.get("/last", (req, res) => {
  db.ref("data")
    .orderByKey()
    .limitToLast(1)
    .once("value", (snapshot) => {
      const data = snapshot.toJSON();
      res.json(data);
    });
});

//Retorna los datos de la ultima hora
router.get("/lasthour", (req, res) => {
  db.ref("data")
    .orderByKey()
    .limitToLast(60)
    .once("value", (snapshot) => {
      const data = snapshot.toJSON();
      res.json(data);
    });
});

//Retorna la cantidad de datos
router.get("/cont", (req, res) => {
  db.ref("data").once("value", (snapshot) => {
    const data = snapshot.val();
    res.json({ contData: Object.keys(data).length });
  });
});

//Retorna los n cantidad de datos desde la cola
router.get("/limitlast/:num", (req, res) => {
  db.ref("data")
    .orderByKey()
    .limitToLast(parseInt(req.params.num))
    .once("value", (snapshot) => {
      const data = snapshot.toJSON();
      res.json(data);
    });
});

//Agrega un nuevo dato 
router.post("/add", (req, res) => {
  const { hour, humidity, hydrometer, localDate, temperature } = req.body;
  const newData = {
    hour,
    humidity,
    hydrometer,
    localDate,
    temperature,
  };
  if (hour && humidity && hydrometer && localDate && temperature) {
    db.ref("data").push(newData);
    res.send("successfully added");
  } else {
    res.send("wrong request");
  }
});

module.exports = router;
