const {Pool} = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

/**
 * Retrieves a blogpost from the database using the UUID
 * @param {string} blogpostID UUID of the blogpost
 * @returns the blogpost queried from the database
 */
async function selectOneBlogPost(blogpostID) {
  // build the query
  const query = {
    text: 'SELECT * FROM blogposts WHERE id = $1',
    values: [ blogpostID ],
  };

  try {
    // make the query and retrieve the rows
    const {rows} = await pool.query(query);

    if (rows.length === 1) {
      return rows[0];
    }
  }
  catch (err) {
    // log any errors that come up
    console.error(err);
  }
}

/**
 * Retrieves the blog posts from the database
 * @param {object} currentUser the current user for filtering results from the database
 * @returns the blog posts from the database
 */
async function selectBlogPosts(currentUser) {
  // create the query
  const query = {
    text: `SELECT * FROM blogposts WHERE permissions LIKE 'public'` +
      ` OR ($1 LIKE '%' AND permissions LIKE 'users')` + // Ideally, detects if a username was provided
      ` OR (author = $1 AND (permissions SIMILAR TO 'drafts|unlisted|private'));`,
    values: [ currentUser?.username ],
  };

  try {
    // make the database query and return the data
    const {rows} = await pool.query(query);
    return rows;
  }
  catch (err) {
    // if any errors come up, log it and return an empty array
    console.error(err);
    return [];
  }
}

/**
 * Inserts a new blog post
 * @param {object} newBlogPost New Blog Post to insert into the database
 * @return blog post that was inserted
 */
async function insertNewBlogPost({author, title, permissions, publishdate, updateddate, content}) {
  // create the query for insertion, using the new blog post object
  const query = {
    text: `INSERT INTO blogposts (author, title, permissions, publishdate, updateddate, content)` +
      ` VALUES ($1, $2, $3, $4, $5, $6)` +
      ` RETURNING *`, // return the new blog post that was just created
    values: [ author, title, permissions, publishdate, updateddate, content ],
  };

  try {
    const {rows} = await pool.query(query);
    return rows[0];
  }
  catch (err) {
    // log the error
    console.error(err);
  }
}

/**
 * Updates an existing blogpost. The updated blog post parameter needs the ID
 * @param {object} updatedBlogPost the blog post with the updated information
 * @return the blog post that was updated
 */
async function updateExistingBlogPost(updatedBlogPost) {
  const {id, title, permissions, updateddate, content} = updatedBlogPost;
  // create the query that makes use of the existing blog post UUID
  const query = {
    text: `UPDATE blogposts SET title = $2, permissions = $3, updateddate = $4, content = $5` +
      ` WHERE id = $1` +
      ` RETURNING *;`,
    values: [ id, title, permissions, updateddate, content ],
  }

  try {
    const {rows} = await pool.query(query);
    // return the updated blogpost
    return rows[0];
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * Deletes a blog post from the database.
 * @param {string} id UUID of the blog post to delete
 * @param {string} username username of the client trying to delete something
 * @returns true if deletion succeeded, false if deletion failed, undefined if an error occurred
 */
async function deleteBlogPost(id, username) {
  // shared condition for selecting and deleting
  const condition = `WHERE id = $1 AND LOWER(author) = LOWER($2)`;
  // make the query to find the blog post before deletion
  const selectQuery = {
    text: `SELECT author FROM blogposts ` + condition,
    values: [ id, username ],
  };

  // make the query to delete the blog post
  const deleteQuery = {
    text: `DELETE FROM blogposts ` + condition,
    values: [ id, username ],
  };

  try {
    // verify that the provided username contains a blogpost with the specified id
    const {rows} = await pool.query(selectQuery);
    if (rows.length > 0) {
      // then, make the deletion
      await pool.query(deleteQuery);
      return true;
    }
    return false;
  }
  catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Verifies if the provided username and email is unique, checking
 * it against the database.
 * @param {string} email email to check
 * @param {string} username username to check
 * @return an object that verifies the uniqueness of the email or username, or
 * it indicates if either the email or username has been taken
 */
async function verifyEmailAndUsernameAreUnique(email, username) {
  // create the query which checks the email and username columns
  const query = {
    text: `SELECT * FROM users WHERE LOWER(email) LIKE LOWER($1) OR LOWER(username) LIKE LOWER($2)`,
    values: [ email, username ],
  };

  try {
    const {rows} = await pool.query(query);
    // if no results were found, then return an object indicating a unique email and username
    if (rows.length === 0) {
      return { unique: true };
    }
    // otherwise, check if either the email or username is not unique
    const result = {};
    for (const row of rows) {
      if (row.username.toLowerCase() === username.toLowerCase()) {
        result.username = true;
      }
      if (row.email.toLowerCase() === email.toLowerCase()) {
        result.email = true;
      }
    }
    return result;
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * Inserts a new user to the database
 * @param {string} email email of the new user
 * @param {string} username username of the new user
 * @param {string} hashedSaltedPassword password of the new user that has been hashed and salted
 * @returns the new user's email and username
 */
async function insertNewUser(email, username, hashedSaltedPassword) {
  // create the query to store a new user into the database
  const query = {
    text: `INSERT INTO users (email, username, password) VALUES ($1, $2, $3)` +
        ` RETURNING email, username;`,
    values: [ email, username, hashedSaltedPassword ],
  };

  try {
    const {rows} = await pool.query(query);
    // return the email and username of the newly created user
    return { email: rows[0].email, username: rows[0].username };
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * retrieves the user's details
 * @param {string} emailOrUsername email or username of the user
 * @returns the user's details, including hashed and salted password
 */
async function selectUser(emailOrUsername) {
  // create the query to find the account with the corresponding email or username
  const query = {
    text: `SELECT * FROM users WHERE LOWER(username) = LOWER($1)` +
      ` OR LOWER(email) = LOWER($1);`,
    values: [ emailOrUsername ],
  };

  try {
    const {rows} = await pool.query(query);

    if (rows.length === 1) {
      return rows[0];
    }
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * Updates the user's password
 * @param {object} currentUser the current logged-in user with the username and email properties
 * @param {string} newHashedSaltedPassword the hashed and salted password (DO NOT USE AN UNHASHED
 * UNSALTED PASSWORD FROM THE USER)
 * @return the username and email of the user's updated password
 */
async function updateUserPassword(currentUser, newHashedSaltedPassword) {
  const query = {
    text: `UPDATE ONLY users`
        + ` SET password = $1`
        + ` WHERE username = $2 AND email = $3`
        + ` RETURNING username, email`,
    values: [ newHashedSaltedPassword, currentUser.username, currentUser.email ],
  };

  try {
    const {rows} = await pool.query(query);

    if (rows.length !== 0) {
      const {username, email} = rows[0];
      return {username, email};
    }
  } catch (err) {
    console.error(error);
  }
}

// Exports
module.exports = {
  // blogposts
  selectOneBlogPost,
  selectBlogPosts,
  insertNewBlogPost,
  updateExistingBlogPost,
  deleteBlogPost,

  // users
  verifyEmailAndUsernameAreUnique,
  insertNewUser,
  selectUser,
  // object for updating specific details
  updateUser: {
    password: updateUserPassword,
  },
};
