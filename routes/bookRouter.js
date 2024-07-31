const router = require("express").Router();

const user = require("../models/user")


const jwt = require("jsonwebtoken")


const {authenticateToken} = require("./userAuth");
const books = require("../models/books");


router.post("/add-book",authenticateToken,async (req,res)=>{

    const {url,title,author,price,desc,language} = req.body
try {
    const {id} = req.headers;
    console.log(id)
    const newuser = await user.findById(id);
    if(newuser.role !== "admin"){
        return res.status(400).json({message:"You are not an admin"})
    }
    
    const newbook = new books({
        url:url,
        title: title,
        author:author,
        price:price,
        desc:desc,
        language:language,
    })
    await newbook.save()
    res.status(200).json({message:"Book added sucessfully"})
} catch (error) {
    return res.status(500).json({message:"Internal server error"})
}

})


router.put("/edit-book",authenticateToken, async(req,res)=>{
const { url,title,author,price,desc,language}=req.body
try {
    const {bookid} = req.headers;
await books.findByIdAndUpdate(bookid,{
    url:url,
    title:title,
    author:author,
    price:price,
    desc:desc,
    language:language
})
return res.status(200).json({message:"Book updated sucessfully"})
} catch (error) {
    return res.status(500).json({message:"an error occurred"})
}


})


router.delete("/delete-book",authenticateToken,async (req,res)=>{
    try {
        const {bookid} = req.headers;
    await books.findByIdAndDelete(bookid)
    return res.status(200).json({message:"Book deleted sucessfully"})



    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
    
})


router.get("/getallbooks",async (req,res)=>{
    try {
        const allbook =   await books.find().sort({createdAt:-1})
        return res.status(200).json({
           message:"Sucessfully get all books",
           data:allbook
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }

})
router.get("/getallbooks-recent",async (req,res)=>{
    try {
        const recentbook =   await books.find().sort({createdAt:-1}).limit(4);
        return res.status(200).json({
           message:"Sucessfully get all books",
           data:recentbook
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }

})

/////////////////////////////////////////impppppppppppp get book by iddddddddddddd////////////////////////////////

router.get("/getbyid/:id",async(req,res)=>{
    try {
        const{id}=req.params;
        const book =   await books.findById(id)
        return res.status(200).json({
           message:"Sucessfully get all books",
           data:book
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})


module.exports = router;







 