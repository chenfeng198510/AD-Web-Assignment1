var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require("axios");
const productController = require('./../controller/productController');


router.get('/', productController.product_index);
router.get('/secured', requiresAuth(),productController.secured_endpoint);

router.post('/add', productController.product_create_post);
router.get('/product/:id', productController.product_edit_view);
router.get("/contactus",productController.contact_us);
router.get('/application', requiresAuth(),productController.role_based_authentication2);

router.get("/order/:id", requiresAuth(), productController.product_order);
//the three is just for admin
router.get('/create', requiresAuth(),productController.role_based_authentication);
router.post('/product_edit/:id', productController.product_update);
router.post("/delete/:id", productController.product_delete);
router.post("/product/payment", productController.product_payment);



module.exports = router;