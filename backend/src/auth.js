/**
 * auth.js handles anything related to authentication, which may include anything
 * involving user information (such as creating new users or authenticating existing users)
 */


// dummy data for user info
const users = require('./dummy/users.json');

// for encrypting passwords
const bcrypt = require('bcrypt');

// for authentication
const jwt = require('jsonwebtoken');

/**
 * Creates a new account and stores its login info
 * @param {import('express').Request} req client request containing an email, username, password, and password confirmation
 * @param {import('express').Response} res server response as indicated by the API spec
 */
exports.createNewAccount = async (req, res) => {
  // retrieve the user info from the request body
  const {email, username, password, passwordConfirmation} = req.body;

  // compare the password and password confirmation, sending a 400 response if the password is incorrect
  if (password !== passwordConfirmation) {
    res.status(400).send('Password and password confirmation does not match');
    return;
  }

  // otherwise, check if the email or username exist in the array of users
  const existingResources = new Set(); // store the existing resources if any
  for (const user of users) {
    // find the conflicting info
    if (user.email === email) {
      existingResources.add('email');
    }
    if (user.username === username) {
      existingResources.add('username');
    }

    // if the size of the set is 2 or more, then we can exit the loop
    if (existingResources.size >= 2) {
      break;
    }
  }

  // now, if existing resources is larger than 0, we have to return a 409
  if (existingResources.size > 0) {
    // convert the Set into an array and return it
    res.status(409).json(Array.from(existingResources));
    return;
  }

  // otherwise, add the new user info to the array of users and return 201 with the base info
  console.warn('[createNewAccount] dummy data is being written into');
  console.warn('[createNewAccount] password is being stored with some encryption');
  // encrypt the password before storing it into the array
  try {
    // hash and salt the password (10 salt rounds)
    const hashedSaltedPassword = await bcrypt.hash(password, 10);

    // store it into the array of users and return a status code of 201
    users.push({email: email, username: username, password: hashedSaltedPassword});
    res.status(201).json({email: email, username: username});
  }
  // any errors in encrypting the password will be caught here
  catch {
    // return a 500 status code
    res.status(500).send();
  }

  // if anything else goes on, just return a status code of 500 (but this should not be reached)
  res.status(500).send();
};

/**
 * Login to an existing account using an email and password
 * @param {import('express').Request} req client request containing an email and password
 * @param {import('express').Response} res server response indicating success or failure
 */
exports.loginToAccount = async (req, res) => {
  // get the email and password from the request body
  const {email, password} = req.body;
  // find the user that the client is trying to log into
  const user = users.find((user) => user.email === email);

  // if the user could not be found, return status code 400
  if (user === undefined || user === null) {
    res.status(400).send();
    return;
  }

  // otherwise, compare passwords using bcrypt
  try {
    if (await bcrypt.compare(password, user.password)) {
      // define an expiration time in seconds
      const secondsUntilExpiration = 5;
      // sign the jwt using the access token secret
      const accessToken = jwt.sign(
        { email: email, user: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: `${secondsUntilExpiration}s` }
      );

      // set the cookies to contain the token (MAKE SURE THEY ARE HTTPONLY)
      res.cookie('accessToken', accessToken, {
        maxAge: 1000 * secondsUntilExpiration, // in milliseconds
        httpOnly: true,
        secure: true
      });

      // indicate a successful login
      res.status(200).send('Login success!');
    }
    // if password does not match, return 400
    else {
      res.status(400).send();
    }
  }
  // if any errors come up, return status code 500
  catch (error) {
    res.status(500).send();
  }
};

/**
 * Authenticate JWT middleware, updates the req.user property or sends an error status code.
 * In other words, this middleware will look at the authorization header of the request
 * and verifies if it is valid or invalid.
 * (see: https://www.youtube.com/watch?v=mbsmsi7l3r4 @ 10:25)
 * @deprecated Use authenticateTokenCookie instead.
 * @param {import('express').Request} req the client request that will be modified for the next function
 * @param {import('express').Response} res server response to indicate any failures that may occur
 * @param {import('express').NextFunction} next next function to call after this one
 */
exports.authenticateToken = async (req, res, next) => {
  // get the authorization header from the request
  const authHeader = req.headers['authorization'];
  // if the authHeader does not exist, then return and send a response code of 401 indicating a lack of authentication
  if (authHeader === undefined || authHeader === null) {
    return res.sendStatus(401);
  }
  // retrieve the token, which has the format 'BEARER <token>'
  const token = authHeader.split(' ')[1];

  // Verify the jsonwebtoken, also providing the access token secret
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // if there is an error, return 403 indicating that the token is no longer valid
    if (err) {
      return res.sendStatus(403);
    }

    // if no error, set the user item of the request body as the user
    req.user = user;
    // and then call the next function
    next();
  });
}

/**
 * This is middleware that verifies the token that is sent in the request.
 * If either the cookie is invalid (maybe due to expiration) or the token is invalid
 * (maybe due to expiration), this will return an error status code.
 * @param {import('express').Request} req client request containing the token in its cookie
 * @param {import('express').Response} res server response, which may send errors
 * @param {import('express').NextFunction} next the next function to be called if everything is okay (since this is middleware)
 */
exports.authenticateTokenCookie = async (req, res, next) => {
  // retrieve the token from the request's cookies
  const accessToken = req.cookies['accessToken'];

  // if the cookie is valid, meaning that the token has been retrieved from cookies, then verify the token
  if (accessToken) {
    // verify the token here
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      // if there was an error, return the corresponding status code
      if (err) {
        return res.sendStatus(403);
      }

      // if there was no error, run the next function while also setting the user property of the request
      req.user = user;
      next();
    });
  }
  else {
    // if the cookie was invalid, then return this
    return res.sendStatus(401);
  }
}
