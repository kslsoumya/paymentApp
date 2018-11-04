
const mongoose = require('mongoose')
const shortId = require('shortid')
const check = require('../libs/checkLib')
const time = require('./../libs/timeLib');

const productModel = mongoose.model('Products')
const logger = require('../libs/loggerLib')
const response = require('../libs/responseLib')




//  Get Products function--

let getProducts = (req, res) => {

    productModel.find((err, products) => {
        if (err) {
            logger.error('Failed To Get Products', 'Product Controller:Get Products()', 10)
            let apiResponse = response.generate(true, 'Failed to Get Products', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(products)) {
            logger.info('No Products Found', 'Product Controller:Get Products()', 4)
            let apiResponse = response.generate(false, 'No Products Found', 404, null)
            res.send(apiResponse)

        } else {
            logger.info('Products retrieved', 'Product Controller:Get Products()', 4)
            delete products._id;
            delete products.__v;
            let apiResponse = response.generate(false, 'Products retrieved', 200, products)
            res.send(apiResponse)
        }
    })
}
//  End of getProducts function



module.exports = {
    getProducts: getProducts
}