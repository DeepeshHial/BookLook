const mongoose = require("mongoose");


const orderSchema = mongoose.Schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
},
book:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"books"
},
status:{
    type: String,
    default:"Order Placed",
    enum:["Order Placed","Out For Delivery, Delivered, Cancled"]
}
},{timestamps: true}) 



module.exports = mongoose.model("order",orderSchema)