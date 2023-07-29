const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

const user_routes = require('./routes/user_routes')
const thought_routes = require('./routes/thought_routes')



app.use('/api',[user_routes, thought_routes]);    


const db = require('./db/connection')
db.once('open', () => {
    app.listen(PORT, () => console.log('Server started on %s', PORT))
})