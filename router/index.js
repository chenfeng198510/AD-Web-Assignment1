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

router.get("/contactus", (req, res)=> {
    let test = req.oidc.isAuthenticated();
    res.render("contactus",{  
        test1: test
    });

});

router.get("/index", (req, res)=> {
    let test = req.oidc.isAuthenticated();
    res.render("index",{  
        test1: test
    });

});

router.get("/secured", requiresAuth(), async (req, res)=> {
    let data ={}
    const {token_type, access_token} = req.oidc.accessToken;
    try{
        const apiResponse = await axios.get('http://localhost:5000/private',
        {
            headers: {
                authorization: `${token_type} ${access_token}`
            }
        });
        data =apiResponse.data;
    }catch(e){
        console(e);
    }
        
    res.render("secured", { 
        title: "Secured Page",
        isAuthenticated: req.oidc.isAuthenticated(),
        data
    });
});

/*go to contact us*/
router.get("/contactus", (req, res)=> {
    let data ={}
   
    res.render("contactus", { 
        title: "Contact Us",
        
        data
    });
});

module.exports = router;