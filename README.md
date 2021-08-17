# Blog Full-Stack Web App

This is a full-stack blogging web application using the PERN stack (PostgreSQL, Express.js, React, Node.js).

## Implemented Features (Frontend & Backend)
- Creating/Editing/Deleting Blog Posts
- Reading Blog Posts
- Blog post permissions (e.g., public, private)
- Authentication (account creation and login) with JWT
- Rich text editor
- API Validation using OpenAPI Specification 3

## Releases
See: https://github.com/Emman-B/blog-fs/releases for releases.

<details>
    <summary>Regarding a full production release</summary>
    At the moment, I do not have plans to officially deploy this project in a production environment. The current plan is to have the application available to host locally.
</details>

## Usage
### Requirements
The following requirements reflect what I used during the development of this app. Older versions may still be used, though it has not been tested.
- PostgreSQL (v13.3)
- Node (v14.15.0)

### Installation

First, install the above required software. For PostgreSQL, keep note of the database name, host, port, username, and password (I used the PostgreSQL Windows installer).

Second, you need to create a `.env` file in the same directory as the `.env.example` file. I recommend copying the `.env.example` file and renaming it as `.env` and then replacing the values as needed.

Then, using the terminal, run the command `npm install` in the `frontend/` and `backend/` directories. This installs the required packages.

### Running the web application
In the `frontend/` and `backend/` directories, run the following: 
```bash
npm start
```

By default, you access the frontend web application here:
```
http://localhost:3000
```

To test the backend API, you can go to the following URL (after replacing `<PORT>` with the corresponding port of the backend server):
```
http://localhost:<PORT>/v1/api-docs/
```


## What I Learned
This was a large project to learn more about full stack web development. I learned about the PERN stack, as well as HTML and CSS, Authentication (with JWT), API validation, and security.

## Disclaimer
The structure based off a university assignment that uses the same stack in the creation of a full stack web application. There are similarities in this project to **my own implementation** of said assignment, but most (if not all) of the similarities are related to project structure and other required setup.
