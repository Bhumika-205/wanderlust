const Listing = require("../models/listing");
const User = require("../models/user");

const maptiler = require("@maptiler/client");
maptiler.config.apiKey = process.env.MAP_API_KEY;

// Index route
module.exports.index = async (req, res) => {
    let { search, category } = req.query;

    let query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
        ];
    }

    if (category) {
        query.category = category;
    }

    const allListings = await Listing.find(query);

    let wishlist = [];
    if (req.user) {
        const user = await User.findById(req.user._id);
        wishlist = user.wishlist.map(id => id.toString());
    }


    res.render("listings/index.ejs", {
        allListings,
        search: search || "",
        category: category || "",
        wishlist
    });
};

// new
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
};

// show
module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exits!")
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing })
};

// create route
module.exports.createListing = async(req, res, next) => {

    // geocoding
    const geoData = await maptiler.geocoding.forward(
        req.body.listing.location,
        { limit: 1 }
    );

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    // saving coordinates
    newListing.geometry = geoData.features[0].geometry;

    console.log(await newListing.save());
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

// Edit route
module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exits!")
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl })
};

// update
module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})  //deconstruct the js object

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
};

// Delete
module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
};