const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * Task 6: Register a new user using Async/Await structure
 * @route POST /register
 */
public_users.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const registerUserAsync = () => {
            return new Promise((resolve, reject) => {
                if (!username || !password) {
                    reject(new Error("Unable to register user. Username and password are required."));
                } else if (isValid(username)) {
                    reject(new Error("User already exists!"));
                } else {
                    users.push({ "username": username, "password": password });
                    resolve("User successfully registered. Now you can login");
                }
            });
        };

        const message = await registerUserAsync();
        return res.status(200).json({ message: message });
    } catch (error) {
        console.error("Registration error:", error.message);
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 1 & Task 10: Get all books using Async/Await
 * @route GET /
 */
public_users.get('/', async function (req, res) {
    try {
        const fetchAllBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject(new Error("Unable to retrieve books database."));
                }
            });
        };

        const bookList = await fetchAllBooks();
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        console.error("Error fetching all books:", error.message);
        return res.status(500).json({ message: error.message });
    }
});

/**
 * Task 2 & Task 11: Get book details based on ISBN using Async/Await
 * @route GET /isbn/:isbn
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const fetchBookByISBN = (targetIsbn) => {
            return new Promise((resolve, reject) => {
                if (books[targetIsbn]) {
                    resolve(books[targetIsbn]);
                } else {
                    reject(new Error(`Book with ISBN ${targetIsbn} not found`));
                }
            });
        };

        const book = await fetchBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 3 & Task 12: Get book details based on Author using Async/Await
 * @route GET /author/:author
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const fetchBooksByAuthor = (targetAuthor) => {
            return new Promise((resolve, reject) => {
                let matchingBooks = {};
                const bookKeys = Object.keys(books);

                bookKeys.forEach((key) => {
                    if (books[key].author.toLowerCase() === targetAuthor.toLowerCase()) {
                        matchingBooks[key] = books[key];
                    }
                });

                if (Object.keys(matchingBooks).length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error(`No books found written by author: ${targetAuthor}`));
                }
            });
        };

        const result = await fetchBooksByAuthor(author);
        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error fetching books by author '${author}':`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 4 & Task 13: Get book details based on Title using Async/Await
 * @route GET /title/:title
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;

    try {
        const fetchBooksByTitle = (targetTitle) => {
            return new Promise((resolve, reject) => {
                let matchingBooks = {};
                const bookKeys = Object.keys(books);

                bookKeys.forEach((key) => {
                    if (books[key].title.toLowerCase() === targetTitle.toLowerCase()) {
                        matchingBooks[key] = books[key];
                    }
                });

                if (Object.keys(matchingBooks).length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error(`No books found with title: ${targetTitle}`));
                }
            });
        };

        const result = await fetchBooksByTitle(title);
        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error fetching books by title '${title}':`, error.message);
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 5: Get book review
 * @route GET /review/:isbn
 */
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;