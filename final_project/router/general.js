const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * Task 6: Register a new user
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
 * Task 1 & Task 10: Get all books using Async/Await with Promise
 */
public_users.get('/', async function (req, res) {
    try {
        const getAllBooksPromise = new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error("Unable to retrieve books database"));
            }
        });

        const bookList = await getAllBooksPromise;
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: error.message });
    }
});

/**
 * Task 2 & Task 11: Get book details based on ISBN using Promise callback
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBNPromise = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
        }
    });

    getBookByISBNPromise
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((error) => {
            console.error(`Error fetching ISBN ${isbn}:`, error.message);
            return res.status(404).json({ message: error.message });
        });
});

/**
 * Task 3 & Task 12: Get book details based on Author using Async/Await
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const getBooksByAuthorAsync = () => {
            return new Promise((resolve, reject) => {
                let matchingBooks = {};
                const keys = Object.keys(books);

                keys.forEach((key) => {
                    if (books[key].author.toLowerCase() === author.toLowerCase()) {
                        matchingBooks[key] = books[key];
                    }
                });

                if (Object.keys(matchingBooks).length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error(`No books found by author: ${author}`));
                }
            });
        };

        const matchingBooks = await getBooksByAuthorAsync();
        return res.status(200).json(matchingBooks);
    } catch (error) {
        console.error(`Error fetching author ${author}:`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 4 & Task 13: Get book details based on Title using Promise callback
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitlePromise = new Promise((resolve, reject) => {
        let matchingBooks = {};
        const keys = Object.keys(books);

        keys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        });

        if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error(`No books found with title: ${title}`));
        }
    });

    getBooksByTitlePromise
        .then((matchingBooks) => {
            return res.status(200).json(matchingBooks);
        })
        .catch((error) => {
            console.error(`Error fetching title ${title}:`, error.message);
            return res.status(404).json({ message: error.message });
        });
});

/**
 * Task 5: Get book review
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