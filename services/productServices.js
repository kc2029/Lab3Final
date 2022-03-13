const productDAO = require("../db/productDAO");

const searchService = function (callback) {
  //productDAO SELECT * from article
  productDAO.findAll(function (err, rows) {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      console.log("No products!");
    } else {
      callback(null, rows);
    }
  });
};

const searchIDService = function (reference, callback) {
  //SELECT * from article where reference like '${reference}'
  productDAO.findByID(reference, function (err, rows) {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      console.log("Unkown product!");
      let product = null;
      callback(null, product); //calback
    } else {
      //rreturn the retrieved product
      callback(null, rows[0]);
    }
  });
};
const searchCategoryService = function (category, callback) {
  productDAO.findByCategory(category, function (err, rows) {
    if (err) {
      throw err;
    }
    if (rows.length == 0) {
      //no products
      console.log(`No product in category ${category}!`);
      callback(null, rows); //calback
    } else {
      //return the rows
      callback(null, rows);
    }
  });
};
module.exports = {
  searchIDService,
  searchService,
  searchCategoryService
};
