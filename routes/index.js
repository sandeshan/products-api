let express = require("express");
let router = express.Router();
let request = require("request");
let _ = require("lodash");

const baseURL = "http://autumn-resonance-1298.getsandbox.com";

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", {
    title: "Details API"
  });
});

/* GET inventory and price details of all products. */
router.get("/details", (req, res, next) => {
  let detailsArray = [];
  let products = [];

  let promise = new Promise((resolve, reject) => {
    request(`${baseURL}/inventory`, (error, response, body) => {
      if (error) {
        res.json({ errors: [{ message: "Error in fetching base API" }] });
      }
      detailsArray = JSON.parse(response.body).inventory;
      resolve(detailsArray);
    });
  }).then(detailsArray => {
    // fetch prices once inventory is resolved
    request(`${baseURL}/products`, (error, response, body) => {
      if (error) console.log("error:", error);
      products = JSON.parse(response.body);
      let thisProduct = {};
      // iterate through each product and add its price into details array.
      products.forEach(product => {
        thisProduct = _.find(detailsArray, { name: product.name });
        thisProduct.price = product.price;
      });
      // return updated details array.
      res.json(detailsArray);
    });
  });
});

/* GET inventory and price details of specified product. */
router.get("/details/:name", (req, res, next) => {
  let name = req.params.name;
  let details = [];
  let products = [];

  let promise = new Promise((resolve, reject) => {
    request(`${baseURL}/inventory/${name}`, (error, response, body) => {
      if (error) {
        res.json({ errors: [{ message: "Error in fetching base API" }] });
      }
      details = JSON.parse(response.body).inventory;
      resolve(details);
    });
  }).then(details => {
    // only continue if atleast one product is received from /inventory/{name}
    // else return error.
    if (details.length > 0) {
      request(`${baseURL}/products/${name}`, (error, response, body) => {
        if (error) console.log("error:", error);
        products = JSON.parse(response.body).product;
        products.forEach(product => {
          thisProduct = _.find(details, { name: product.name });
          thisProduct.price = product.price;
        });
        res.json(details);
      });
    } else {
      // product is invalid. return error.
      res.json({ errors: [{ message: "Invalid product" }] });
    }
  });
});

/* Default route for invalid routes . */
router.get("/*", (req, res) => {
  res.json({ errors: [{ message: "Invalid route" }] });
});

module.exports = router;
