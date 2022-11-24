const mongoose = require('mongoose');

const Schema = mongoose.Schema;                                                               //this is a constructor in mongoose to create new schema

const productSchema = new Schema({                                                           //here we are creating product schema or creating the product data
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'User', required: true
    }
})
 module.exports = mongoose.model('Product', productSchema);                                    //here we are defining the model

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//     constructor(title, price, description, imageUrl, id, userId){
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;                                                    //here we are coverting the string id to the object id
//         this.userId = userId;
//     }

//     save(){
//         const db = getDb();                                                                     //here we are calling this function to get excess to the database
//         let dbOp;
//         if(this._id){
//             //Update Product
//             dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});          //in this argument "{_id: this._id}"  becuase we have converted the id above so we dont have to do that here and we are seeing that the id we have matches the id in the database and this argument "{$set: this}" we are telling mongodb to modify the this fields in the database    
//         }else{
//             dbOp = db.collection('products').insertOne(this);
//         }
//         return dbOp
//         .then(result => {
//             console.log(result);    
//         })
//         .catch(err => {
//             console.log(err)
//         });
//     }

//     static fetchAll(){
//         const db = getDb();                                                                          //here we are calling this function to get excess to the database
//         return db.collection('products').find().toArray()
//         .then(products => {
//             console.log(products);
//             return products;
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     }

//     static findById(prodId){
//         const db = getDb();
//         return db.collection('products').find({ _id: new mongodb.ObjectId(prodId)}).next()         //here mongodb.ObjectId is a constructor function that convert monogodb object id to normal id
//         .then(product => {
//             console.log(product);
//             return product;
//         })
//         .catch(err => {
//             console.log(err)
//         })  
//     }

//     static deleteById(prodId){
//         const db = getDb();
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
//         .then(result => {
//             console.log('Deleted')
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
// }



// module.exports = Product;   