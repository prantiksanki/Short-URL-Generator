const express = require ("express") ; 
const router = express.Router() ;
const {handleGenerateNewShortURL,handleGetAnalytics} = require("../controller/url")

// router.use(express.json()); 
router.post('/' , handleGenerateNewShortURL) ;
router.get('/analytics/:shortId',handleGetAnalytics) ; 

module.exports = router ;