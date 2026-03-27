const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

// to show wishlist page
router.get("/", isLoggedIn("Please login to view your wishlist"), async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    
    res.render("listings/wishlist", { listings: user.wishlist });
});

// Add to wishlist
router.post("/:id", isLoggedIn(), async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(req.params.id)) {
        user.wishlist.push(req.params.id);
        await user.save();
    }

    res.json({ success: true });
});

// Remove from wishlist
router.delete("/:id", isLoggedIn(), async (req, res) => {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
        id => id.toString() !== req.params.id
    );

    await user.save();

    res.json({ success: true });
});

module.exports = router;