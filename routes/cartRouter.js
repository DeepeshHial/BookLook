const router = require("express").Router();

const user = require("../models/user");

const {authenticateToken} = require("./userAuth");

router.put("/addtocart",authenticateToken, async(req,res)=>{
    try {
        const{bookid,id} =req.headers;
        const userData = await user.findById(id);
        const isBookcart = userData.cart.includes(bookid);
        if(isBookcart){
            return res.status(200).json({Message:"Book is already in cart"});
        }
        await user.findByIdAndUpdate(id,{$push:{cart:bookid}});

        return res.json({
            status:"sucess",
            message:"Book Added To Cart"
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
  

})


//remove the book from cart
router.put("/remove-from-cart/:bookid",authenticateToken, async(req,res)=>{
    try {
        const{bookid} =req.params;
        const{id} =req.headers;
        await user.findByIdAndUpdate(id,{$pull:{cart:bookid}});
        return res.json({
            status:"Sucess",
            message:"Book remover from cart"
        });
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
  

})


//get cart of a particular user

router.get("/get-user-cart", authenticateToken ,async(req,res)=>{

    try {
        const {id} = req.headers;
        const userData = await user.findById(id).populate("cart") 
        const cart = userData.cart.reverse();
    
        return res.json({
            status:"sucess",
            data:cart
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
  


})

module.exports = router;