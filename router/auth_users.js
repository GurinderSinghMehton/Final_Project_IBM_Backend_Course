const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;

  if(!username && !password){
    return res.status(404).json({ message: "Error logging in" });
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60})

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User Successfully Logged In")
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password!"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  let user = req.session.authorization;

  if(isbn >= 1 && isbn <= 10){
    user.isbn = isbn 
    user.review = "Something about the book!"
    
    books[isbn].reviews[user.username] = {"review" : user.review}
    return res.send("Review is Posted")
  }
  return res.status(404).json("Incorrect ISBN!")
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = parseInt(req.params.isbn);
  let user = req.session.authorization;
  if(isbn >= 1 && isbn <= 10){
    delete books[isbn].reviews[user.username];
    return res.send("Review is Deleted")
  }
  return res.status(404).json("Incorrect ISBN!")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
