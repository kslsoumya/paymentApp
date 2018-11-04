const express = require('express');
const router = express.Router();
// const userController = require("./../../app/controllers/userController");
const productController = require("./../../app/controllers/productController");

const appConfig = require("./../../config/appConfig")

const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/products`;

    // defining routes.
   
    app.get(`${baseUrl}/get/all`, auth.isAuthenticated, productController.getProducts);

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup User SignUp.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} mobile mobile of the user. (body params) (required)
     * @apiParam {string} status Status for chat Account. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Created Successfully",
            "status": 200,
            "data": {
                        "userId": "DSfoJbEk8",
                        "firstName": "xyz",
                        "lastName": "abccba",
                        "email": "abc@gmail.com",
                        "status": "I am great",
                        "mobile": 98078656,
                        "createdOn": "2018-07-24T13:32:17.000Z"
                    }
        }
    */


}
