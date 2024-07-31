const router = require("express").Router();

const user = require("../models/user")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")


const {authenticateToken} = require("./userAuth")
//signup

router.post("/sign-up",async(req,res)=>{
try {
    const {username,email,password,address} = req.body
    //check username length is more than 3
    if(username.length < 4){
       return res.send(400).json({message:"username length must be greater than 3"})
    }

    //check username exist or not
    const existingUsername = await user.findOne({username:username}) 
    
    if(existingUsername){
        return res.send(400).json({message:"username already exist"})
    }

    //check email exist or not
    const existingEmail = await user.findOne({email:email}) 
    
    if(existingEmail){
        return res.send(400).json({message:"Email already exist"})
    }

    //check password length

    if(password.length <= 5){
        return res.send(400).json({message:"password length must be greater than 5"})
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            const newuser = new user({
                username:username,
                email:email,
                password:hash,
                address:address,
            });
            await newuser.save();
        });
    });

 


return res.status(200).json({message:"signup sucessfull"})
   
} catch (error) {
     res.status(500).json({message:"Internal server error"})
}
})


// login
router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;

        const existinguser = await user.findOne({email})
        if(!existinguser){
            return res.status(400).json({message:"Invalid credential"})
        }


        bcrypt.compare(password, existinguser.password).then(function(data) {

            if(data){
                const authClaims = [{email:existinguser.email},{role:existinguser.role}]

                const token = jwt.sign({authClaims},"deepeshhial",{
                    expiresIn:"30d"
                })
                return  res.status(200).json({id:existinguser._id,role:existinguser.role,token:token})
            }
            else{
                return res.status(400).json({message:"Invalid credential"})

            }
        });
       
    } catch (error) {
         res.status(500).json({message:"Internal server error"})
    }
    })

//get user

router.get("/getalluserinfo", authenticateToken ,async (req,res)=>{
    try {
        const {id} = req.headers
        const data = await user.findById(id).select('-password');
        return res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
})


router.put("/updateuser-address",authenticateToken,async(req,res)=>{
    try {
        const {id} = req.headers;
        const {address}=req.body;
      await user.findByIdAndUpdate(id,{address:address});
      return res.status(200).json({message:"address updated sucessfully"});
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
})
module.exports = router