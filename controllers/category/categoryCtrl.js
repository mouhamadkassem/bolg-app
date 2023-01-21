const expressAsyncHanddler = require("express-async-handler");
const Category = require("../../model/category/category");

//________________________________
// create category
//________________________________
const createCategoryCtrl = expressAsyncHanddler(async (req, res) => {
  try {
    const newCategory = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(newCategory);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// fetch all categories
//________________________________

const fetchCategoriesCtrl = expressAsyncHanddler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort("-createdAt")
      .populate("user");
    res.json(categories);
  } catch (err) {
    res.json(err);
  }
});
//________________________________
// fetch category
//________________________________

const fetchCategoryCtrl = expressAsyncHanddler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate("user");
    res.json(category);
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// update category
//________________________________

const updateCategoryCtrl = expressAsyncHanddler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        user: req.user,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(category);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//________________________________
// delete category
//________________________________

const deleteCategoryCtrl = expressAsyncHanddler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});
module.exports = {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
