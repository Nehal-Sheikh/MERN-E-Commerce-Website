const express = require('express');
const path = require('path');
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router();                                           //here we are configuring our express router 

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart)

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

router.post('/create-order', isAuth, shopController.postOrder)

router.get('/orders', isAuth, shopController.getOrders)

// router.get('/checkout', shopController.getCheckout);

// router.get('/', (req, res, next) => {
//     console.log('shop.js',adminData.products);
//     res.sendFile(path.join(rootDir , "views", "shop.html"));       //this is another method of giving the direstory location 
// });

module.exports = router;                                                   //here we are exporting our this route filee to app.js to initialize there
