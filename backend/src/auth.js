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
