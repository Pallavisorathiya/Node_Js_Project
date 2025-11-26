const Category = require("../models/category.model");
const ExtraCategory = require("../models/extraCategory.model");
const SubCategory = require("../models/subCategory.model");
const Product = require("../models/product.model");

// ADD PRODUCT PAGE
exports.addProductPage = async (req, res) => {
  try {
    const categories = await Category.find();
    const subCategories = await SubCategory.find();
    const extraCategories = await ExtraCategory.find();
    return res.render("product/add_product", {
      categories,
      subCategories,
      extraCategories,
      user: req.user || null
    });
  } catch (error) {
    console.log("ADD PRODUCT PAGE ERROR →", error);
    req.flash && req.flash("error", "Something Went Wrong!");
    return res.redirect("back");
  }
};

// ADD NEW PRODUCT
exports.addNewProduct = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    req.body.productImage = imagePath;

    if (!req.body.extracategory || req.body.extracategory.trim() === "") {
      delete req.body.extracategory;
    }

    await Product.create(req.body);

    req.flash && req.flash("success", "New Product Added Successfully!");
    return res.redirect("/product/view-product");
  } catch (error) {
    console.log("ADD PRODUCT ERROR →", error);
    req.flash && req.flash("error", "Something Went Wrong!");
    return res.redirect("back");
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { desc: { $regex: q, $options: "i" } }
      ];
    }

    const categories = await Category.find();
    const subCategories = await SubCategory.find();
    const extraCategories = await ExtraCategory.find();

    const allProducts = await Product.find(filter)
      .populate("category")
      .populate("subcategory")
      .populate("extracategory");

    return res.render("product/view_product", {
      allProducts,
      categories,
      subCategories,
      extraCategories,
      category: category || "",
      search: search || "",
      user: req.user || null
    });
  } catch (error) {
    console.log("VIEW PRODUCT ERROR →", error);
    req.flash && req.flash("error", "Something Went Wrong!");
    return res.redirect("back");
  }
};

// SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    req.flash('success', 'Get Single Product Success!!!');
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subcategory")
      .populate("extracategory");

    if (!product) {
      req.flash && req.flash("error", "Product Not Found!");
      return res.redirect("/product/view-product");
    }

    return res.render("product/single_product", {
      product,
      user: req.user || null
    });
  } catch (error) {
    console.log("GET SINGLE PRODUCT ERROR →", error);
    req.flash && req.flash("error", "Something Went Wrong!");
    return res.redirect("back");
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    req.flash('success', 'Get Sub Category Success!!!');
    const data = await SubCategory.find({ category: req.params.id });
    return res.json(data);
  } catch (err) {
    req.flash('error', 'Something Error');
    console.log("GET SUBCATEGORIES ERROR", err);
    return res.json([]);
  }
};

exports.getExtraCategory = async (req, res) => {
  try {
    req.flash('success', 'Get Extra Category Success!!!');
    const data = await ExtraCategory.find({ subCategoryId: req.params.id });
    return res.json(data);
  } catch (err) {
    req.flash('error', 'Something Error');
    console.log("GET EXTRACATEGORIES ERROR", err);
    return res.json([]);
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
  
    await Product.findByIdAndDelete(req.params.id);

    req.flash && req.flash("success", "Product Deleted Successfully!");
    return res.redirect("/product/view-product");
  } catch (error) {
    req.flash('error', 'Something Error');
    console.log("DELETE PRODUCT ERROR →", error);
    req.flash && req.flash("error", "Something Went Wrong!");
    return res.redirect("back");
  }
};

// LOAD EDIT PRODUCT PAGE
exports.editProductPage = async (req, res) => {
  try {
    req.flash('success', 'Product Edit Success!!!');
    let id = req.params.id;

    let product = await Product.findById(id);

    let categories = await Category.find();
    let subCategories = await SubCategory.find();
    let extraCategories = await ExtraCategory.find();

    return res.render("product/edit_product", {
      product,
      categories,
      subCategories,
      extraCategories,
      user: req.user || null
    });

  } catch (error) {
    request.flash && request.flash("error", "Something Went Wrong!");
    console.log(error);
    return res.redirect("/product/view-product");
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    req.flash('success', 'Product Updated Success!!!');
    const id = req.params.id;

    let obj = {
      title: req.body.title,
      desc: req.body.desc,
      category: req.body.category,
      subcategory: req.body.subcategory,
      extracategory: req.body.extracategory,
      price: req.body.price,
      quantity: req.body.quantity
    };

    if (req.file) {
      obj.productImage = '/uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(id, obj);

    return res.redirect("/product/view-product");

  } catch (error) {
    req.flash('error', 'Something Error');
    console.log(error);
    return res.redirect("/product/view-product");
  }
};
