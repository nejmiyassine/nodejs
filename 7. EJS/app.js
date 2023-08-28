const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        title: 'Express.js with EJS',
        message: 'Welcome to Our Express.js with EJS templating engine!',
    };
    res.render('home', data);
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
