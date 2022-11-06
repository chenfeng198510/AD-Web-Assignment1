var express = require("express");
var app = express();
var indexRouter = require("./router/index");
const { auth } = require('express-openid-connect');
require('dotenv').config();
var path = require('path');

const mongoose = require('mongoose');
//connect to mongodb
mongoose.connect("mongodb+srv://cfeng198510:Fc65345562@cluster0.tr4fe3f.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .on('open', () => {
   console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });
  //require schema
  require('./models/product');


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER,
  clientSecret: process.env.CLIENTSECRET,
  authorizationParams: {
    response_type: 'code',
    audience: 'http://localhost:5000',
    scope: 'openid profile email'
  }
};
 
app.set("views", "views");
app.set("view engine", "ejs");
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  //data on post requests.

  app.use(express.urlencoded({ extended: true }));
  //middleware for sending json data to server, body parser doing
  app.use(express.json());
app.use(express.static("public"));
app.use(auth(config));
app.use("/", indexRouter);

var port = 3000;

app.listen(3000, () => {
    console.log(`App is running on ${port}` );
})