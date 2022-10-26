var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require("axios");

router.get("/", (req, res)=> {
    let test = req.oidc.isAuthenticated();
    res.render("index",{ 
        test1: test
    });
});


router.get("/secured", requiresAuth(), async (req, res)=> {
    try{
        const apiResponse = await axios.get('http://localhost:5000/public');
        data =apiResponse.data;
    }catch(e){}

    res.render("secured", { 
        title: "Secured Page",
        isAuthenticated: req.oidc.isAuthenticated(),
        data
    });
});

module.exports = router;