const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(`users :`, users);
    console.log(`req :`, req.body);

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

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let matchingBooks = {};
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks[key] = books[key];
        }
    }
    return res.status(200).json(matchingBooks);
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = {};
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks[key] = books[key];
        }
    }
    return res.status(200).json(matchingBooks);
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ==========================================
// Task 10: Async/Await & Promises with Axios
// ==========================================

// Task 10.1: Retrieve all books using Async/Await
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 10.2: Search by ISBN using Promises
const getBookByISBNPromise = (isbn) => {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => { throw error; });
};

// Task 10.3: Search by Author using Async/Await
const getBooksByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task 10.4: Search by Title using Promises
const getBooksByTitlePromise = (title) => {
    return axios.get(`http://localhost:5000/title/${title}`)
        .then(response => response.data)
        .catch(error => { throw error; });
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitlePromise = getBooksByTitlePromise;