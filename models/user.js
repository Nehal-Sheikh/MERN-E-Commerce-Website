const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
                quantity: {type: Number, required: true}
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {                                              //method() is method in mongoose to create our own method
    const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();                                  //here in this comparison we are not getting the answer with the same type of value becuase we are using === three equal which means we are comparing by the answer and its type of value as well so one solution is to use == double equal to so that we only compare the values not the types and secomd solution is to use toString() method to make boththe values of same type
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];                                               
        
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;                            //in this argument block we are finding if we have product then add it to the qunaity and if not then create a quantity with a value of default 1
        updatedCartItems[cartProductIndex].quantity = newQuantity;                               //here we have found that if we have a product or not if we have then it simply increase the quantity
    }else{
        updatedCartItems.push({productId: product._id, quantity:newQuantity})                    //here we are doing that if we do not found any same product in the above code then we simply add a new product with quanity = 1
    }
        
    const updatedCart = {items: updatedCartItems};                                               //here we can use javascript spread operator ... the three dots to extract the all the properties of products and the second argument after the comma is the additional property for the products which we would like to add or alter
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {                                    //filter is the javascript method to filter the data according to our requirments and it runs thorugh all the items and for the statement which is below that if it is false then delete that item
        return item.productId.toString() !== productId.toString()                                //!== means that we are checking for if the both the condition is not matched or equal then we will delete that item and if this condition is satisfied then we will delete that specific item and keep the rest of the item in the cart
    });
    this.cart.items = updatedCartItems;                                                          //here we are assigning the updated item to the updated cart
    return this.save();                                                                          //here we are saving into the database by using the save() method
}

userSchema.methods.clearCart = function (){
    this.cart = {items: []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);



// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id){
//         this.name = username,
//         this.email = email,
//         this.cart = cart,
//         this._id = id;
//     }

//     save(){
//         const db = getDb();                                                               //here we are getting excess to the database
//         return db.collection('users').insertOne(this);                                    //here we are inserting user inthe database and returning it or alternatively we can also use then() and catch() in replacement of return
//     }

//     addToCart(product){                                              /////ye wala add to cart zohaib mama se samajhna hai
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();                      //here in this comparison we are not getting the answer with the same type of value becuase we are using === three equal which means we are comparing by the answer and its type of value as well so one solution is to use == double equal to so that we only compare the values not the types and secomd solution is to use toString() method to make boththe values of same type
//         });
//         let newQuantity = 1 ;
//         const updatedCartItems = [...this.cart.items];                                                                   //here we are 

//         if(cartProductIndex >= 0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;                                                  //in this argument block we are finding if we have product then add it to the qunaity and if not then create a quantity with a value of default 1
//             updatedCartItems[cartProductIndex].quantity = newQuantity;                                                    //here we have found that if we have a product or not if we have then it simply increase the quantity
//         }else{
//             updatedCartItems.push({productId: new ObjectId(product._id), quantity:newQuantity})                           //here we are doing that if we do not found any same product in the above code then we simply add a new product with quanity = 1
//         }

//         const updatedCart = {items: updatedCartItems};                                //here we can use javascript spread operator ... the three dots to extract the all the properties of products and the second argument after the comma is the additional property for the products which we would like to add or alter
//         const db = getDb();
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: updatedCart}})
//     }

//     getCart(){
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {                              //here we are using map javascript method and then we are converting the retreived items into the string productid
//             return i.productId;
//         })
//         return db.collection('products').find({_id: {$in: productIds}}).toArray()                     //here we are using find methods in which we are seeing that _id is equal to the products ids we are searching from the cart products which the $in is the mongodb query operator is giving us from the array and we are using toArray method to convert it to the javascript array
//         .then(products => {
//             return products.map(p => {
//                 return {
//                     ...p, quantity:this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                     }).quantity
//                 };
//             });
//         });
//     }

//     deleteItemFromCart(productId){
//         const updatedCartItems = this.cart.items.filter(item => {                      //filter is the javascript method to filter the data according to our requirments and it runs thorugh all the items and for the statement which is below that if it is false then delete that item
//             return item.productId.toString() !== productId.toString()                                        //!== means that we are checking for if the both the condition is not matched or equal then we will delete that item and if this condition is satisfied then we will delete that specific item and keep the rest of the item in the cart
//         });
//         const db = getDb();
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: updatedCartItems}}})           
//     }

//     addOrder(){                                                                         //in this function we are inserting the products from our cart to the orders database and then after doing that deleting the products in the cart or we can also say empty the cart 
//         const db = getDb();   
//         return this.getCart()                                                                    //here we have used getCart( function to get all the information about the product present in the cart at that time
//         .then(products => {
//             const order = {                                                            //creating an order from the data we get from the above function
//                 items: products, 
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name
//                 }
//             };
//             return db.collection('orders').insertOne(order)                            //here we are inserting the order in the database that we have created above
//         })
//         .then(result => {
//             this.cart = {items: []};                                                   //here as we know that we succeed adding our cart in the order so after that the cart will get empty
//             return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: []}}});
//         })
//     }

//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
//     }

//     static findById(userId){
//         const db = getDb();                                                                //here we are getting excess to the database
//         return db.collection('users').findOne({_id: new ObjectId(userId)})         //here we are using findOne because we know that we are retrieving only one element 
//         .then(user => {
//             console.log(user);
//             return user;
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// }

// module.exports = User;