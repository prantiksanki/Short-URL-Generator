const express = require("express") 
const app = express() ; 
const PORT = 8001 ;
const {connectToMongoDB} = require("./connect")
const URL = require("./models/url")
const path = require("path") ;       // FOR EJS 

app.set('view engine' , 'ejs') ; // View Engine Set 1st step
app.set('views' ,path.resolve("./views") )





const urlRoute = require("./routes/url") ;
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user") ;
const cookieParser = require("cookie-parser") ;
const {restrictToLoginUserOnly , checkAuth} = require("./middlewares/auth")


app.use(cookieParser());
app.use(express.urlencoded({extended:false}));  // Form and JSON both data supports 
app.use(express.json());

app.use("/url" , restrictToLoginUserOnly ,urlRoute) ;
app.use("/user" , userRoute) ; 
app.use("/" , checkAuth, staticRoute)


connectToMongoDB("mongodb://localhost:27017/short-url") 
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("error" , err)) ;



// For EJS

// app.get("/test" , async (req,res) =>
// {
//     const allUrls = await URL.find({});
//     return res.render("home" , {
//         urls : allUrls ,
//     }) ;  
// })

app.get('/:shortid' , async(req,res)=>
{
    const shortid = req.params.shortid ;

    const entry = await URL.findOneAndUpdate(
        {shortid},
        {
            $push:
            {
                visitHistory : {timestamp : Date.now()},
            }, 
        },
        { new: true, upsert: true }
    ) ;

    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
})


app.listen(PORT , () => console.log(`Server started at port ${PORT}`)) ;