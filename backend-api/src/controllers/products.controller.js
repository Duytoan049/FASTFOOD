const productService = require("../services/products.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function createProduct(req, res, next) {
  if (!req.body?.product_Name || typeof req.body.product_Name !== "string") {
    return next(new ApiError(400, "Name should be a non-empty string"));
  }

  if (!req.body?.product_Price || isNaN(req.body.product_Price)) {
    return next(new ApiError(400, "Price should be a valid number"));
  }

  try {
    const product = await productService.createProduct({
      ...req.body,
      product_Img: req.file ? `/public/uploads/${req.file.filename}` : null,
    });

    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${product.product_Id}`,
      })
      .json(
        JSend.success({
          product,
        })
      );
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating new product")
    );
  }
}

async function getAllProducts(req, res, next) {
  let result = {
    products: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };

  try {
    result = await productService.getAllProducts(req.query);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving customers")
    );
  }
  return res.json(
    JSend.success({
      products: result.products,
      metadata: result.metadata,
    })
  );
}

async function getProduct(req, res, next) {
  const { id } = req.params;

  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }
    return res.json(
      JSend.success({
        product,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error retrieving product with id=${id}`));
  }
}

async function updateProduct(req, res, next) {
  if (Object.keys(req.body).length == 0 && !req.file) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  const { id } = req.params;

  try {
    const update = await productService.updateProduct(id, {
      ...req.body,
      product_Img: req.file ? `/public/uploads/${req.file.filename}` : null,
    });
    if (!update) {
      return next(new ApiError(404, "Product not found"));
    }
    return res.json(
      JSend.success({
        product: update,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Error updating Product with id=${id}`));
  }
}

async function deleteProduct(req, res, next) {
  const { id } = req.params;

  try {
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return next(new ApiError(404, "Product not found"));
    }
    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Could not delete product with id=${id}`));
  }
}
module.exports = {
  // Export defined functions
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
