let express = require("express");
let router = express.Router();
let request = require("request");
let _ = require("lodash");

const baseURL = "http://autumn-resonance-1298.getsandbox.com";
const baseAPIErrorMsg = "Error in fetching base API";

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", {
    title: "Details API"
  });
});

/* GET inventory and price details of all products. */
router.get("/details", (req, res, next) => {
  let detailsResponse = {};
  let products = [];

  let promise = new Promise((resolve, reject) => {
    request(`${baseURL}/inventory`, (error, response, body) => {
      if (error) {
        res.json({ errors: [{ message: baseAPIErrorMsg }] });
      }
      detailsResponse.details = JSON.parse(response.body).inventory;
      resolve(detailsResponse);
    });
  }).then(detailsResponse => {
    // fetch prices once inventory is resolved
    request(`${baseURL}/products`, (error, response, body) => {
      if (error) {
        res.json({ errors: [{ message: baseAPIErrorMsg }] });
      }
      products = JSON.parse(response.body);
      let thisProduct = {};
      // iterate through each product and add its price into details array.
      products.forEach(product => {
        thisProduct = _.find(detailsResponse.details, { name: product.name });
        thisProduct.price = product.price;
      });
      // return updated details array.
      res.json(detailsResponse);
    });
  });
});

/* GET inventory and price details of specified product. */
router.get("/details/:name", (req, res, next) => {
  let name = req.params.name;
  let detailsResponse = {};
  let products = [];

  let promise = new Promise((resolve, reject) => {
    request(`${baseURL}/inventory/${name}`, (error, response, body) => {
      if (error) {
        res.json({ errors: [{ message: baseAPIErrorMsg }] });
      }
      detailsResponse.details = JSON.parse(response.body).inventory;
      resolve(detailsResponse);
    });
  }).then(detailsResponse => {
    // only continue if atleast one product is received from /inventory/{name}
    // else return error.
    if (detailsResponse.details.length > 0) {
      request(`${baseURL}/products/${name}`, (error, response, body) => {
        if (error) {
          res.json({ errors: [{ message: baseAPIErrorMsg }] });
        }
        products = JSON.parse(response.body).product;
        products.forEach(product => {
          thisProduct = _.find(detailsResponse.details, {
            name: product.name
          });
          thisProduct.price = product.price;
        });
        res.json(detailsResponse);
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
