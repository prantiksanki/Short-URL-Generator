const {v4: uuidv4} = require("uuid")
const User = require("../models/user"); 
const {setUser} = require("../service/auth")
async function handleUserSignup(req,res)
{
    const {name , email , password} = req.body ; 
     await User.create({
        name , 
        email ,
        password, 
     }) ;
     return res.redirect("/") ; 
}



async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user with matching email and password directly
        const user = await User.findOne({ email, password });
        
        // If user not found, credentials are invalid
        if (!user) {
            return res.render("login", {
                err: "Invalid Username or Password",
            });
        }

        // Set session and cookie only if login is successful
        const sessionId = uuidv4();
        setUser(sessionId, user);
        
        // Set secure cookie options
        res.cookie("uid", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
        
        return res.redirect("/");
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).render("login", {
            err: "An error occurred during login. Please try again later.",
        });
    }
}

module.exports = {handleUserSignup,handleUserLogin} ;