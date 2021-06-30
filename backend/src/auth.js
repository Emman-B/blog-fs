/**
 * auth.js handles anything related to authentication, which may include anything
 * involving user information (such as creating new users or authenticating existing users)
 */


// dummy data for user info
const users = require('./dummy/users.json');

// for encrypting passwords
const bcrypt = require('bcrypt');

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
  console.warn('[createNewAccount] password is being stored without encryption');
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
      res.status(200).send('Successfully logged in!');
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
