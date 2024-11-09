const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ err: "URL is required" });
    }

    const shortID = shortid();

    await URL.create({
        shortid: shortID,  
        redirectURL: body.url,
        visitedHistory: [],
        createdBy : req.user._id ,
    });

    return res.render("home" , {
        id: shortID ,
    })
    // return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
    const shortid = req.params.shortId;

    const result = await URL.findOne({ shortid });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory ? result.visitHistory.length : 0,
        analytics: result.visitHistory || [],
    });
}

module.exports = {
    handleGenerateNewShortURL,handleGetAnalytics,
};
