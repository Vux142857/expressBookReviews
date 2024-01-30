const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
            if (!doesExist(username)) {
                users.push({ "username": username, "password": password });
                return res.status(200).json({ message: "User successfully registred. Now you can login" });
            } else {
                return res.status(404).json({ message: "User already exists!" });
            }
        }
        return res.status(404).json({ message: "Username or password are not provided." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    try {
        return res.status(200).send(JSON.stringify(books, null, 4))
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const { isbn } = req.params
        const findingBook = books[isbn]
        if (findingBook) {
            return res.status(200).send(JSON.stringify(findingBook, null, 4))
        }
        return res.status(404).json({ message: "Book is not found." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
        const { author } = req.params
        const findingBooks = []
        for (const key in books) {
            if (books[key].author === author) {
                findingBooks.push(books[key])
            }
        }
        if (findingBooks.length < 1) {
            return res.status(404).json({ message: "Book is not found." });
        }
        return res.status(200).send(JSON.stringify(findingBooks, null, 4))
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    try {
        const { title } = req.params
        const findingBooks = []
        for (const key in books) {
            if (books[key].title === title) {
                findingBooks.push(books[key])
            }
        }
        if (findingBooks.length < 1) {
            return res.status(404).json({ message: "Book is not found." });
        }
        return res.status(200).send(JSON.stringify(findingBooks, null, 4))
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    try {
        const { isbn } = req.params
        const findingBook = books[isbn]
        if (findingBook) {
            const reviewsBook = findingBook.reviews
            return res.status(200).send(JSON.stringify(reviewsBook, null, 4))
        }
        return res.status(404).json({ message: "Reviews is not found." });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Task 10
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    getBookList().then(
        books => res.status(200).send(JSON.stringify(books, null, 4))
    );
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn) {
    let findingBook = books[isbn];
    return new Promise((resolve, reject) => {
        if (findingBook) {
            resolve(findingBook);
        } else {
            reject("Unable to find book!");
        }
    });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
        books => res.status(200).send(JSON.stringify(books, null, 4))
    );
});

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author) {
    const findingBooks = [];
    return new Promise((resolve, reject) => {
        for (const key in books) {
            if (books[key].author === author) {
                findingBooks.push(books[key])
            }
        }
        if (findingBooks < 1) {
            reject("Book not found")
        }
        resolve(findingBooks);
    });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    getFromAuthor(author).then((books, error) =>
        books => res.status(200).send(JSON.stringify(books, null, 4))
    );
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.

function getFromTitle(title) {
    const findingBooks = [];
    return new Promise((resolve, reject) => {
        for (const key in books) {
            if (books[key].title === title) {
                findingBooks.push(books[key])
            }
        }
        if (findingBooks < 1) {
            reject("Book not found")
        }
        resolve(findingBooks);
    });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    getFromTitle(title).then(result => res.send(JSON.stringify(result, null, 4)));
});

module.exports.general = public_users;
