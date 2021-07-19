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
const { getBlogPosts, createBlogPost, getBlogPost } = require('./blogposts');
const { createNewAccount, loginToAccount, authenticateTokenCookie, logoutAccount, getLoggedInUserInfo } = require('./auth');

// == middleware == //
/**
 * This is needed so that request bodies can be
 * parsed correctly (since they are provided using
 * json)
 */
app.use(express.json());

/**
 * Enable cors for the front-end web application. There are two options needed:
 *  - credentials: This needs to be true to allow sending cookies (Access-Control-Allow-Credentials)
 *  - origin: This is the allowed origin(s) for cors. I'm using a regular expression here to match
 *            the URL of the web application.
 */
app.use(cors({credentials: true, origin: new RegExp(process.env.WEB_APP_URL_REGEXP)}));

/**
 * This is middleware so that I can access cookies as needed. It specfically allows me
 * to access cookies via the "cookies" property in the request body.
 */
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
// getting one blogpost by uuid
app.get('/v1/blogposts/:id', getBlogPost);
// creating a new blog post (needs authentication middleware)
app.post('/v1/blogposts', authenticateTokenCookie, createBlogPost);

/**
 * /user path deals with anything related to users
 */
// check the currently logged-in account
app.get('/v1/user', authenticateTokenCookie, getLoggedInUserInfo);
// creating a new account
app.post('/v1/user/signup', createNewAccount);
// logging into an existing account
app.post('/v1/user/login', loginToAccount);
// log out of user
app.delete('/v1/user/logout', authenticateTokenCookie, logoutAccount);

module.exports = app;
