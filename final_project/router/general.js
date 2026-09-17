const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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
 * Task 1 & Task 10: Get all books using Async/Await
 * @route GET /
 */
const getAllBooksAsync = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject(new Error("Unable to retrieve books database"));
        }
    });
};

public_users.get('/', async function (req, res) {
    try {
        const bookList = await getAllBooksAsync();
        return res.status(200).json(bookList);
    } catch (error) {
        console.error("Error fetching books:", error.message);
        return res.status(500).json({ message: error.message });
    }
});

/**
 * Task 2 & Task 11: Get book details based on ISBN using Promise callback
 * @route GET /isbn/:isbn
 */
const getBookByISBNPromise = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject(new Error(`Book with ISBN ${isbn} not found`));
        }
    });
};

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    getBookByISBNPromise(isbn)
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
 * @route GET /author/:author
 */
const getBooksByAuthorAsync = (author) => {
    return new Promise((resolve, reject) => {
        let matchingBooks = {};
        const bookKeys = Object.keys(books);

        // Iterating through books database to filter matching author (case-insensitive)
        bookKeys.forEach((key) => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        });

        // Check if any matching books were found before resolving
        if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error(`No books found written by author: ${author}`));
        }
    });
};

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const result = await getBooksByAuthorAsync(author);
        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error fetching books by author '${author}':`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 4 & Task 13: Get book details based on Title using Promise callback
 * @route GET /title/:title
 */
const getBooksByTitlePromise = (title) => {
    return new Promise((resolve, reject) => {
        let matchingBooks = {};
        const bookKeys = Object.keys(books);

        // Iterating through books database to filter matching title (case-insensitive)
        bookKeys.forEach((key) => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks[key] = books[key];
            }
        });

        // Check if any matching books were found before resolving
        if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
        } else {
            reject(new Error(`No books found with title: ${title}`));
        }
    });
};

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    getBooksByTitlePromise(title)
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            console.error(`Error fetching books by title '${title}':`, error.message);
            return res.status(404).json({ message: error.message });
        });
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