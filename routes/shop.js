const express = require('express');
const path = require('path');
const shopController = require('../controllers/shop')

const router = express.Router();                                           //here we are configuring our express router 

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart)

router.post('/cart-delete-item', shopController.postCartDeleteProduct)

router.post('/create-order', shopController.postOrder)

router.get('/orders', shopController.getOrders)

// router.get('/checkout', shopController.getCheckout);

// router.get('/', (req, res, next) => {
//     console.log('shop.js',adminData.products);
//     res.sendFile(path.join(rootDir , "views", "shop.html"));       //this is another method of giving the direstory location 
// });

module.exports = router;                                                   //here we are exporting our this route filee to app.js to initialize there
