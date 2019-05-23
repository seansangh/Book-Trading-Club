/*  EXPRESS SETUP  */

const express = require('express');
const app = express();



app.get('/', (req, res) => res.sendFile(__dirname+'auth.html', { root : __dirname}));







const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));
