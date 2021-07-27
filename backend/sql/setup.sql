-- Use the pgcrypto extension, mainly for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(64) UNIQUE PRIMARY KEY,
    email VARCHAR(320) UNIQUE,
    password VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS blogposts (
    id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
    author VARCHAR(64) NOT NULL REFERENCES users(username),
    title VARCHAR(128) NOT NULL,
    permissions VARCHAR(32) NOT NULL,
    publishdate TIMESTAMP WITH TIME ZONE NOT NULL,
    updateddate TIMESTAMP WITH TIME ZONE NOT NULL,
    content TEXT NOT NULL
);
