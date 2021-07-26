const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
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

// Exports
module.exports = {
  selectOneBlogPost,
  selectBlogPosts,
  insertNewBlogPost,
  updateExistingBlogPost,
};
