const express = require('express');
const app = express();
const morgan = require('morgan');

app.set('port', process.env.PORT || 3000);
app.set('json spaces',2);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/data",require('./routes/index'));
//app.use(require('./routes/upload'));

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`));
