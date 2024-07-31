const router = require("express").Router();

const {authenticateToken} = require("./userAuth");

const user = require("../models/user")

// const books = require("../models/books");

const Order = require("../models/order")

router.post("/placeorder",authenticateToken,async(req,res)=>{
    try {
        const{id} =req.headers;
        const {order}=req.body;
        for(const orderData of order){
            const newOrder = new Order({user: id,book:orderData._id});
            const orderDataFromDb = await newOrder.save();
            await user.findByIdAndUpdate(id,{$push:{orders:orderDataFromDb._id}});
            await user.findByIdAndUpdate(id,{$pull:{cart:orderData._id}});
        }

        return res.json({
            status:"sucess",
            message:"order placed sucessfully"
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    
    }
})

router.get("/get-order-history",authenticateToken,async(req,res)=>{
    try {
        const{id} = req.headers;
        const UserData = await user.findById(id).populate({
            path:'orders',
            populate:{path:"book"}
        });

        const orderData = UserData.orders.reverse();
        return res.json({
            status:"sucess",
            data:orderData,
        })
                
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    
    }
})

router.get("/getall-orders",authenticateToken,async(req,res)=>{
try {
    const userData = await Order.find()
    .populate({
        path:"book"
    })
    .populate({
        path:"user"
    })
    .sort({
        createdAt: -1
    });
    return res.json({
        status:"Sucess",
        data:userData,
    })
    
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"An error occured"})
}

})





router.put("/update-status/:id",authenticateToken,async(req,res)=>{

try {
    const {id} = req.params;
    await Order.findByIdAndUpdate(id,{status:req.body.status});
    return res.json({
        status:"sucess",
        message:"Status Updatated Sucessfully"
    })
    
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"An error occured"})
}

})

module.exports = router