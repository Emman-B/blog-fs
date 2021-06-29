// create an express application
const express = require('express');
const { getBlogPosts } = require('./blogposts');
const app = express(); // this is exported

// paths
/**
 * Default path currently just returns hello world
 */
app.get('/', (req, res) => {
    res.send('Hello world!');
});

/**
 * /blogposts path returns all blogposts
 */
app.get('/blogposts', getBlogPosts);

module.exports = app;
