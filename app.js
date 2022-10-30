var express = require("express");
var app = express();
var indexRouter = require("./router/index");
const { auth } = require('express-openid-connect');
require('dotenv').config();


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

app.use(express.static("public"));
app.use(auth(config));
app.use("/", indexRouter);

var port = 3000;

app.listen(3000, () => {
    console.log(`App is running on ${port}` );
})