var express = require("express");
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const axios = require("axios");
const productController = require('./../controller/productController');


router.get('/', productController.product_index);
router.get('/secured', requiresAuth(),productController.secured_endpoint);
router.get('/create', requiresAuth(),productController.role_based_authentication);
router.post('/add', productController.product_create_post);
router.get('/product/:id', productController.product_edit_view);
router.post('/product_edit/:id', productController.product_update);
router.post("/delete/:id", productController.product_delete);

module.exports = router;