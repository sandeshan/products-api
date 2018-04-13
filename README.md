# Product Details API

Coding Project for Botkeeper.

Aggregates Inventory and Pricing details from http://autumn-resonance-1298.getsandbox.com/inventory and http://autumn-resonance-1298.getsandbox.com//products.

---

## Endpoints

* /details: returns inventory and pricing for all prodcuts available.
* /details/name: returns inventory and pricing for a single product.

---

## Technical Details

* Built using [Express.js](https://expressjs.com/)
* Project scaffolded using [express-generator](https://github.com/expressjs/generator)
* Followed ES6 standards (Arrow functions, Promises, Template Literals, let, const)
* Error handling included to return appropriate error messages for invalid routes and invalid products passed as parameter.

---

## Demo

* To run locally:
  * Clone this repo.
  * Install dependencies:
  ```bash
   $ npm install
  ```
  * Start app at `http://localhost:3000/`:
  ```bash
  $ npm start
  ```
* Live demo is hosted at:
* Try it out:
  * /details
  * /details/shirt

---
