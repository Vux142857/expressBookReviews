const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'admin01', password: 'vu852002' }];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const exitedUser = users.find(user => user.username === username)
    return (exitedUser) ? true : false
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const exitedUser = users.find(user => user.username === username)
    if (exitedUser) {
        return (exitedUser.password === password) ? true : false
    }
    return false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    try {
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            return res.status(404).json({ message: "Error logging in" });
        }
        if (authenticatedUser(username, password)) {
            let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).json({ message: "User successfully logged in" });
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        const review = req.body.review;
        const username = req.session.authorization.username;
        if (books[isbn]) {
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review successfully posted" });
        } else {
            return res.status(404).json({ message: `ISBN ${isbn} not found` });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        const username = req.session.authorization.username;
        if (books[isbn]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Delete Review successfully" });
        } else {
            return res.status(404).json({ message: `ISBN ${isbn} not found` });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
