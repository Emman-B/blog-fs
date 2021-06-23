// create an express application
const express = require('express');
const app = express(); // this is exported

// paths (the only paths here should be ones that cannot be organized into a separate file)
app.get('/', (req, res) => {
    res.send('Hello world!');
});

module.exports = app;
