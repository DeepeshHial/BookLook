const express = require("express");
const app = express();  
const cors = require("cors");


require("dotenv").config();
require("./connection/connection");
const userRouter  = require("./routes/userRouter");
const bookRouter  = require("./routes/bookRouter");
const favouritesRouter  = require("./routes/favouritesRouter");
const cartRouter  = require("./routes/cartRouter");

const orderRouter = require("./routes/orderRouter")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1", userRouter );
app.use("/api/v1", bookRouter );
app.use("/api/v1", favouritesRouter );
app.use("/api/v1", cartRouter );
app.use("/api/v1", orderRouter );



app.listen(process.env.PORT,()=>{
    console.log(`server is started ${process.env.PORT}`);
})