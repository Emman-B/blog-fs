# Blog Full-Stack Web App

This is a full-stack blogging web application using the PERN stack (PostgreSQL, Express.js, React, Node.js). I have also converted this project to use MongoDB instead of PostgreSQL. You can find it here: https://github.com/Emman-B/blog-fs-mern.

![main_view_mobile](https://user-images.githubusercontent.com/34151856/129804477-212523f3-1606-451c-b4b2-42ae2f82b8e3.png)


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
This was a large project to learn more about full stack web development. I learned about the PERN stack, as well as HTML and CSS, Authentication (with JWT), API validation, and security. I also learned about mobile-first design, as well as responsive web design.

## Screenshots
<details>
    <summary>Main View for Desktop</summary>

![main_view_desktop](https://user-images.githubusercontent.com/34151856/129804587-cc365ee4-a0fa-4c2b-bd55-ddc5f5c868b1.png)

</details>
<details>
    <summary>Login View for Mobile</summary>

![login_view_mobile](https://user-images.githubusercontent.com/34151856/129804712-0801e36d-b492-4481-9271-c138bdef1824.png)

</details>
<details>
    <summary>Signup View for Mobile</summary>

![signup_view_mobile](https://user-images.githubusercontent.com/34151856/129804752-a6a030e5-9a39-436b-b699-6ce94d6e73d0.png)

</details>
<details>
    <summary>Reader View for Mobile</summary>

![reader_view_mobile](https://user-images.githubusercontent.com/34151856/129804883-867939fc-143d-4b7a-a3dd-93ac11bdeb6d.png)

![reader_view_mobile_2](https://user-images.githubusercontent.com/34151856/129804953-93a7a633-286e-4cac-91f2-4fd1d0d60267.png)

</details>
<details>
    <summary>Editor View for Mobile</summary>

![editor_view_mobile](https://user-images.githubusercontent.com/34151856/129805305-aa90d50c-c841-42be-acdf-841ce319be61.png)

</details>

## Disclaimer
The structure based off a university assignment that uses the same stack in the creation of a full stack web application. There are similarities in this project to **my own implementation** of said assignment, but most (if not all) of the similarities are related to project structure and other required setup.
