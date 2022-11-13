const axios = require('axios');
const Product = require('../models/product');
require('dotenv').config();
const PUBLISHER_KEY = process.env.PUBLISHER_KEY
const SECRET_KEY = process.env.SECRET_KEY

const stripe = require('stripe')(SECRET_KEY);

const product_index = (req, res)=> {
    let isAuthenticated = req.oidc.isAuthenticated();
    if(isAuthenticated) {
      Product.find().sort({
          createdAt: -1
      }).then(result => {
          res.render("index", { 
              add: result,
              title: "My auth app",
              isAuthenticated: isAuthenticated,
                key: PUBLISHER_KEY,
           });
      });
      } else {
      res.render("noindex", { 
          title: "My auth app",
          isAuthenticated: isAuthenticated
       });
    }
  }

const secured_endpoint = async (req, res)=> {
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
}


const role_based_authentication = async(req,res) => {
    let data = {};
    
const { token_type, access_token } = req.oidc.accessToken;

try{
    // calling the server to get the data, make sure you get the data before moving forward(async, await)
    const apiResponse = await axios.get('http://localhost:5000/role', {
        headers: {
            authorization: `${token_type} ${access_token}`
        }
    });
    data = apiResponse.data;
    Product.find().sort({
        createdAt: -1
    }).then(result => {
        res.render("create", { 
        title: 'Host User', 
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        data: data,
        add: result,
         });
    });
    // when there is not error, you will be redirected to the secured page with the data you get fromt the api
}catch(e) {
    console.log(e);
    res.render('notaccess', {
        title: 'Not Access Page',
        isAuthenticated: req.oidc.isAuthenticated()
      });
}
}

const product_create_post = (req,res) =>{
    const product = new Product(req.body);
    product.save()
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
    });
}

const product_edit_view = (req, res) => {
    const id = req.params.id;
    Product.findById(id)
        .then(result => {
            res.render('edit', {
                product: result,
                title: "Product Edit",
                isAuthenticated: req.oidc.isAuthenticated(),
                user: req.oidc.user
            });
        })
        .catch(err => {
            console.log("Error ", err);
        })
}

const product_update = async (req, res) => {
  
    const _id = req.params.id;
  
    const doc = await Product.findOne({ _id });
    // Overwrite
    doc.overwrite({
        name: req.body.name,
        image: req.body.image,
        address: req.body.address,
        city: req.body.city,
        price: req.body.price
    })

    await doc.save()
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        console.log("ERROR ", err);
    })
}

const product_delete = async (req,res)=>{
    Product.findByIdAndRemove(req.params.id,function (err){
        if(err){
            console.log(err);
            res.redirect("/");
        }else {
            res.redirect("/");
            }
    })
  }

const contact_us = (req, res)=> {
    let isAuthenticated = req.oidc.isAuthenticated();
    res.render("contactus", { 
        title: "Contact Us",
        isAuthenticated: isAuthenticated
     });
}


const role_based_authentication2 = async(req,res) => {
    let data = {};
    
const { token_type, access_token } = req.oidc.accessToken;

try{
    // calling the server to get the data, make sure you get the data before moving forward(async, await)
    const apiResponse = await axios.get('http://localhost:5000/host', {
        headers: {
            authorization: `${token_type} ${access_token}`
        }
    });
    data = apiResponse.data;
        res.render("hostapplication", { 
        title: 'Host User', 
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
        data: data,
        add: result,
         });

    // when there is not error, you will be redirected to the secured page with the data you get fromt the api
}catch(e) {
    console.log(e);
    res.render('notaccess', {
        title: 'Not Access Page',
        isAuthenticated: req.oidc.isAuthenticated()
      });
}
}

const product_payment = (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: "Chen Feng",
        address: {
            line1: '470 Irmin St',
            postal_code: 'V5J1H2',
            city: 'Burnaby',
            state: 'BC',
            country: 'Canada',
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: 7000,
                description: "Product Development",
                currency: "USD",
                customer: customer.id
            })
        })
        .then((charge) => {
            res.render('payment_success', { title: "Payment Success" });
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        })
}

const product_order =  (req, res) => {
    let isAuthenticated = req.oidc.isAuthenticated();
    const id = req.params.id;
    if(isAuthenticated) {
     Product.findById(id)
      .then(result => {
          res.render("order", {
               product: result, 
              title: "Order",
              isAuthenticated: isAuthenticated,
                key: PUBLISHER_KEY,
                user: req.oidc.user,
           });
      });
      } else {
      res.render("noindex", { 
          title: "My auth app",
          isAuthenticated: isAuthenticated
       });
    }
}
  
module.exports = {
product_index,
secured_endpoint,
role_based_authentication,
product_create_post,
product_edit_view,
product_update,
product_delete,
contact_us,
role_based_authentication2,
product_payment,
product_order,
}