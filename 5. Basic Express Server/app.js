const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
    res.send('Welcome to my Express.js server!');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
