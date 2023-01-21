const express = require("express");
const categoryRoute = express.Router();
const authMiddleWars = require("../../middlewars/auth/authMiddlewars");
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");

categoryRoute.post("/", authMiddleWars, createCategoryCtrl);
categoryRoute.get("/", authMiddleWars, fetchCategoriesCtrl);
categoryRoute.get("/:id", authMiddleWars, fetchCategoryCtrl);
categoryRoute.put("/:id", authMiddleWars, updateCategoryCtrl);
categoryRoute.delete("/:id", authMiddleWars, deleteCategoryCtrl);

module.exports = categoryRoute;
