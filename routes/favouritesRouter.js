const router = require("express").Router();
const user = require("../models/user");

const {authenticateToken} = require("./userAuth");


//add to favourite
router.put("/add-to-favourite",authenticateToken,async (req,res)=>{
    try {
        const {bookid,id} = req.headers;
        const userData = await user.findById(id);
        const isBookFavourites = userData.favourites.includes(bookid);
        if(isBookFavourites){
            return res.status(200).json({message:"Book already in favourites"})
        }

        await user.findByIdAndUpdate(id,{$push:{favourites:bookid}})
        return res.status(200).json({message:"Book added to favourites"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
});

//delete book from fav
router.put("/removebook-from-favourite",authenticateToken,async (req,res)=>{
    try {
        const {bookid,id} = req.headers;
        const userData = await user.findById(id);
        const isBookFavourites = userData.favourites.includes(bookid);
        if(isBookFavourites){
            await user.findByIdAndUpdate(id,{$pull:{favourites:bookid}})
        }

       
        return res.status(200).json({message:"Book remove from favourites"})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
});

// get fav book of a particular user
router.get("/getbooks-favourite-user",authenticateToken,async (req,res)=>{
    try {
        const {id} = req.headers;
        const userData = await user.findById(id).populate("favourites");

       const favouritesbooks = userData.favourites;

       res.status(200).json({
        message:"sucess to get books",
        data:favouritesbooks,
       })
       
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
});


module.exports = router