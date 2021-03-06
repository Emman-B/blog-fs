/**
 * auth.js handles anything related to authentication, which may include anything
 * involving user information (such as creating new users or authenticating existing users)
 */


// database module
const db = require('./db.js');

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

  // otherwise, check if the email or username exists in the database
  const uniqueAccountVerification = await db.verifyEmailAndUsernameAreUnique(email, username);

  // now, if existing resources is larger than 0, we have to return a 409
  if (!uniqueAccountVerification.unique) {
    // verify what values are not unique and store it into an array
    const existingResources = [];
    if (uniqueAccountVerification.username) {
      existingResources.push('username');
    }
    if (uniqueAccountVerification.email) {
      existingResources.push('email');
    }
    res.status(409).json(existingResources);
    return;
  }

  // otherwise, add the new user info to the users database
  // encrypt the password before storing it
  try {
    // hash and salt the password (10 salt rounds)
    const hashedSaltedPassword = await bcrypt.hash(password, 10);

    // store it into the database
    const insertedAccount = await db.insertNewUser(email, username, hashedSaltedPassword);

    // return the email and username in the response
    res.status(201).json(insertedAccount);
    return;
  }
  // any errors in encrypting the password will be caught here
  catch {
    // return a 500 status code
    res.status(500).send();
    return;
  }
};

/**
 * Login to an existing account using an email or username and password
 * @param {import('express').Request} req client request containing an email and password
 * @param {import('express').Response} res server response indicating success or failure
 */
exports.loginToAccount = async (req, res) => {
  // get the email or username and password from the request body
  const {emailOrUsername, password} = req.body;
  // find the user that the client is trying to log into in the database
  const user = await db.selectUser(emailOrUsername);

  // if the user could not be found, return status code 400
  if (user === undefined || user === null) {
    res.status(400).send();
    return;
  }

  // otherwise, compare passwords using bcrypt
  try {
    if (await bcrypt.compare(password, user.password)) {
      // define an expiration time in seconds
      const secondsUntilExpiration = 300;
      // sign the jwt using the access token secret
      const accessToken = jwt.sign(
        { email: user.email, username: user.username },
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
      res.status(200).json({email: user.email, username: user.username});
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
 * Updates user details
 * @param {import('express').Request} req client request containing password + confirmation
 * @param {import('express').Response} res server response
 */
exports.updateUserDetails = async (req, res) => {
  // if a password change is being done, call the corresponding function
  if (req.body.password && req.body.passwordConfirmation) {
    const result = await updateUserPassword(req, res);

    // return result only if it is defined
    if (result) {
      return result;
    }
  }

  // if nothing happens, then respond with a 400
  return res.status(400).send();
};


/**
 * Updates user details
 * @param {import('express').Request} req client request containing password + confirmation
 * @param {import('express').Response} res server response
 */
const updateUserPassword = async (req, res) => {
  // validate that the password and password confirmation is accurate
  if (req.body.password === req.body.passwordConfirmation) {
    try {
      const newHashedSaltedPassword = await bcrypt.hash(req.body.password, 10);
      // call the corresponding database function to update passwords
      const updateResult = await db.updateUser.password(req.user, newHashedSaltedPassword);

      if (updateResult !== undefined) {
        return res.status(200).send();
      }
      return res.status(400).send();
    }
    catch (err) {
      console.error(err);
      return res.status(500).send();
    }
  }
  // return a 400 if nothing happens
  return res.status(400).send();
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
};

/**
 * This is implemented similarly to authenticateTokenCookie except instead
 * of the middleware interrupting the request, it still proceeds. This is used for any
 * routes that do not require authentication, but being authenticated would change what data
 * is delivered.
 * @param {import('express').Request} req client request which could contain the token in its cookie
 * @param {import('express').Response} res server response, which may send errors
 * @param {import('express').NextFunction} next the next function to be called (since this is middleware)
 */
exports.checkTokenCookie = async (req, res, next) => {
  // retrieve the token from the request's cookies
  const accessToken = req.cookies['accessToken'];

  // if the cookie is valid, meaning that the token has been retrieved from cookies, then verify the token
  if (accessToken) {
    // verify the token here
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      // if there was an error, just set req.user to be undefined and continue
      if (err) {
        req.user = undefined;
        next();
      }
      else {
        // if there was no error, run the next function while also setting the user property of the request
        req.user = user;
        next();
      }
    });
  }
  else {
    // if the cookie was invalid, then set req.user to be undefined and run the next function
    req.user = undefined;
    next();
  }
};

/**
 * This checks if the client is currently logged in, returning the logged in user's information
 * if so.
 * @param {import('express').Request} req client request for getting the current logged-in user's info
 * @param {import('express').Response} res the current logged-in user's info
 */
exports.getLoggedInUserInfo = async (req, res) => {
  res.status(200).json({username: req.user.username, email: req.user.email});
};

/**
 * Logs out the user.
 * @param {import('express').Request} req client request to log out of the account
 * @param {import('express').Response} res server response indicating success of logout
 */
exports.logoutAccount = async (req, res) => {
  // clear the cookie holding the token
  res.clearCookie('accessToken');
  // indicate success of logout
  res.status(200).send('Logout successful!');
};
