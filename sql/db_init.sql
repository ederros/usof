DROP DATABASE IF EXISTS usof;
CREATE DATABASE IF NOT EXISTS usof;
USE usof;

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
	id INT AUTO_INCREMENT NOT NULL,
	login VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_picture VARCHAR(255),
    rating INT,
    role enum("user", "admin") DEFAULT "user",
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts
(
	id INT AUTO_INCREMENT NOT NULL,
	author_id INT,
    title TEXT NOT NULL,
    publish_date TEXT NOT NULL,
    status enum("active", "inactive") DEFAULT "active",
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    likes_count INT NOT NULL,
    dislikes_count INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS categories;
CREATE TABLE categories
(
	id INT AUTO_INCREMENT NOT NULL,
	title TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS post_category;
CREATE TABLE post_category
(
	id INT AUTO_INCREMENT NOT NULL,
	post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments
(
	id INT AUTO_INCREMENT NOT NULL,
	author_id INT,
    post_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    likes_count INT NOT NULL,
    dislikes_count INT NOT NULL,
    PRIMARY KEY (id),
	FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS likes;
CREATE TABLE likes
(
	id INT AUTO_INCREMENT NOT NULL,
	author_id INT,
    target_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type enum("like", "dislike"),
    target_type enum("post", "comment"),
    PRIMARY KEY (id),
	FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);