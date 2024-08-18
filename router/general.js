const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already Exist" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });

  getBooks
    .then((books) => {
      res.send(JSON.stringify(books));
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving books", error: err });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);

  const getBookByIsbn = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isbn >= 1 && isbn <= 10) {
        resolve(books[isbn]);
      } else {
        reject("Invalid ISBN");
      }
    }, 2000);
  });
  getBookByIsbn
    .then((book) => {
      return res.send(JSON.stringify(book));
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;

  const getAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      let booksKey = Object.keys(books);
      let filteredBooks = booksKey.filter((key) => books[key].author === author).map((key) => books[key]);
      if (author && filteredBooks !== null) {
        resolve(filteredBooks);
      }else{
        reject("Author not found!");
      }
    }, 3000);
  });

  getAuthor.then((author) => {
    return res.send(JSON.stringify(author));
  })
  .catch(err => {
    return res.status(404).json({ message: err });
  })
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title;
  const getBookByTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = Object.values(books).find(book => book.title === title);
      if(book){
        resolve(book);
      }else{
        reject("Book not found");
      }
    }, 4000)
  })

  getBookByTitle
    .then((book) => {
      res.send(JSON.stringify(book));
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  if (isbn >= 1 && isbn <= 10) {
    return res.send(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Invalid ISBN" });
});

module.exports.general = public_users;
