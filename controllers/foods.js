const express = require("express");
const router = express.Router({ mergeParams: true });

const User = require("../models/user.js");

// INDEX - show all pantry items
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send("User not found");

    const pantryItems = user.pantry;

    res.render("foods/index.ejs", { pantry: pantryItems, user });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// NEW - display form to add a new food item
router.get("/new", (req, res) => {
  res.render("foods/new.ejs", { userId: req.params.userId });
});

// Create - add new food to pantry
router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send("User not found");

    user.pantry.push({ name: req.body.name });

    await user.save();

    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// DELETE - remove a food item from the pantry
router.delete("/:itemId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send("User not found");

    const food = user.pantry.id(req.params.itemId);

    food.deleteOne();

    await user.save();

    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// EDIT - show form to edit a pantry item
router.get("/:itemId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send("User not found");

    const foodItem = user.pantry.id(req.params.itemId);
    if (!foodItem) return res.status(404).send("Food item not found");

    res.render("applications/edit", { food: foodItem, user });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// UPDATE - update a specific food item
router.put("/:itemId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send("User not found");

    const food = user.pantry.id(req.params.itemId);
    if (!food) return res.status(404).send("Food item not found");

    food.set({ name: req.body.name });

    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;
