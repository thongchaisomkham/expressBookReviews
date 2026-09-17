const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Requirement: Include Axios library

/**
 * Task 6: Register a new user
 * @route POST /register
 */
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

/**
 * Task 1 & Task 10: Get all books using Async/Await with Axios
 * @route GET /
 */
public_users.get('/', async function (req, res) {
    try {
        // Asynchronously fetch book list using Axios
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        // Uniform fallback using local database and consistent JSON error response
        if (books) {
            return res.status(200).json(books);
        }
        return res.status(500).json({ message: "Error retrieving book list", error: error.message });
    }
});

/**
 * Task 2 & Task 11: Get book details based on ISBN using Async/Await with Axios
 * @route GET /isbn/:isbn
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Asynchronously fetch book by ISBN using Axios
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        // Uniform error handling and direct ISBN lookup
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        }
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

/**
 * Task 3 & Task 12: Get book details based on Author using Async/Await with Axios
 * @route GET /author/:author
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        // Asynchronously fetch books by author using Axios
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        // Uniform error handling and filtering logic for author matching
        let matchingBooks = {};
        const bookKeys = Object.keys(books);

        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        });

        if (Object.keys(matchingBooks).length > 0) {
            return res.status(200).json(matchingBooks);
        }
        return res.status(404).json({ message: `No books found written by author: ${author}` });
    }
});

/**
 * Task 4 & Task 13: Get book details based on Title using Async/Await with Axios
 * @route GET /title/:title
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        // Asynchronously fetch books by title using Axios
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        // Uniform error handling and filtering logic for title matching
        let matchingBooks = {};
        const bookKeys = Object.keys(books);

        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        });

        if (Object.keys(matchingBooks).length > 0) {
            return res.status(200).json(matchingBooks);
        }
        return res.status(404).json({ message: `No books found with title: ${title}` });
    }
});

/**
 * Task 5: Get book review
 * @route GET /review/:isbn
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;