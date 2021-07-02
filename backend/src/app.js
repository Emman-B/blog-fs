// set up the dotenv configuration
require('dotenv').config();

// create an express application
const express = require('express');
const app = express(); // this is exported from this source file

// get the cookie parser
const cookieParser = require('cookie-parser');

// get cors
const cors = require('cors');

// api validation setup
const OpenApiValidator = require('express-openapi-validator'); // the openapi validator
const swaggerUi = require('swagger-ui-express'); // the swagger ui for verifying the api
const YAML = require('js-yaml'); // used to open and read the api validator doc
const fs = require('fs'); // used when loading the openapi spec
const apiSpec = YAML.load(fs.readFileSync('src/api/openapi.yaml')); // loading the api specification

// blog post route code imported here
const { getBlogPosts, createBlogPost } = require('./blogposts');
const { createNewAccount, loginToAccount, authenticateToken, authenticateTokenCookie } = require('./auth');

// == middleware == //
/**
 * This is needed so that request bodies can be
 * parsed correctly (since they are provided using
 * json)
 */
app.use(express.json());

app.use(cors({credentials: true, origin: true}));

app.use(cookieParser());

/**
 * Open API validator middleware setup 
 * (using documentation from the following: 
 * https://www.npmjs.com/package/express-openapi-validator
 * https://www.npmjs.com/package/swagger-ui-express
 * https://www.npmjs.com/package/js-yaml
 * )
 */
// swagger UI in api-docs
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
// installing openapi validation middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true
  })
);
// error handler (from the express-openapi-validator documentation)
app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

// == paths == //
/**
 * Default path currently just returns hello world
 */
app.get('/v1/', (req, res) => {
    res.send('Hello world!');
});

/**
 * /blogposts path deals with anything related to blog posts
 */
// getting all blogposts
app.get('/v1/blogposts', getBlogPosts);
// creating a new blog post (needs authentication middleware)
app.post('/v1/blogposts', authenticateTokenCookie, createBlogPost);

/**
 * /users path deals with anything related to users
 */
// creating a new account
app.post('/v1/users/signup', createNewAccount);
// logging into an existing account
app.post('/v1/users/login', loginToAccount);

module.exports = app;
