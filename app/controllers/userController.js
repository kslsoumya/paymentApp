const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/generatePwdLib')
const token = require('../libs/tokenLib')
const nodemailer = require('nodemailer');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('246190AL3IfFlvxT6T5bdebe1c');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'dprivate00@gmail.com',
        pass: 'lkjhgfdsa0987'
    }
})

// Dummy  Transaction details--------


const bankDetails = {
    userName: 'astrology123',
    password: '123456',
    bank: 'sbi'
}

const cardDetails = {
    cardNo: '4716335177898332',
    cvv: '123',
    expiry: '12/2018'
}




/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')

// start user signup function 

let signUpFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log(req.body.email);
                if (!validateInput.Email(req.body.email)) {
                    logger.error('Email does not meet the requirement', 'User Controller:validateUserInput()', 10)
                    let apiResponse = response.generate(true, 'Email does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, 'Password parameter is missing', 400, null)
                    reject(apiResponse)

                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User creation', 'User Controller:ValidateUserInput()', 5)
                let apiResponse = response.generate(true, 'One or more parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }


    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'email': req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error('Failed To Create User', 'User Controller:Create User()', 10)
                        let apiResponse = response.generate(true, 'Failed to create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            password: passwordLib.hashPassword(req.body.password),
                            email: req.body.email,
                            mobile: req.body.mobile,
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                logger.error('Failed To Create New User', 'User Controller:Create User()', 10)
                                let apiResponse = response.generate(true, 'Failed to create  New User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject()
                                delete newUserObj._id;
                                delete newUserObj.__v;
                                resolve(newUserObj)
                            }
                        })

                    } else {
                        logger.error('User already Exists', 'User Controller:Create User()', 4)
                        let apiResponse = response.generate(true, 'User already Exists', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            let welcomeText = `Hi ${req.body.firstName} ${req.body.lastName}. Welcome to the  SlicePay!!!`;
            var mailOptions = {
                from: '"SlicePay" <dprivate00@gmail.com>',
                to: req.body.email,
                subject: `Welcome ${req.body.firstName}`,
                text: welcomeText
            }
            // console.log(mailOptions);
            transporter.sendMail(mailOptions, (error, resp) => {
                if (error) {
                    logger.error('Failed To Send Email', 'User Controller:sendEmail()', 10)
                    let apiResponse = response.generate(true, 'Failed To Send Email', 500, error)
                    res.send(apiResponse)
                } else {
                    console.log(resp);
                    delete resolve.password
                    let apiResponse = response.generate(false, 'User created successfully', 200, resolve)
                    res.send(apiResponse)
                }

            })
        })

        .catch((err) => {
            res.send(err)

        })

}// end user signup function 


// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ 'email': req.body.email }, (err, userDetails) => {
                    if (err) {
                        logger.error('Failed to retrieve User Details', 'User Controller:find User()', 4)
                        let apiResponse = response.generate(true, 'Failed to Find User Details', 403, null)
                        reject(apiResponse)

                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'User Controller:find User()', 4)
                        let apiResponse = response.generate(true, 'No User Found', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'User Controller:find User()', 10)
                        resolve(userDetails);
                    }
                })

            } else {
                logger.error('Email is missing', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'Email is missing', 404, null)
                reject(apiResponse)
            }
        })
    }

    let validatePassword = (retrievedUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePwd(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    logger.error(err.message, 'User Controller:validate password()', 4)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    retrievedUserObject = retrievedUserDetails.toObject();
                    delete retrievedUserObject.password
                    delete retrievedUserObject._id
                    delete retrievedUserObject.__v
                    delete retrievedUserObject.createdOn
                    delete retrievedUserDetails.modifiedOn
                    resolve(retrievedUserObject)
                } else {
                    logger.error(err, 'User Controller:validate password()', 4)
                    let apiResponse = response.generate(true, ' Wrong Password Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }


    let generateToken = (userDetails) => {
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    logger.error(err.message, 'User Controller:generate token()', 4)
                    let apiResponse = response.generate(true, ' Failed to generate token', 400, null)
                    reject(apiResponse)

                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    console.log(tokenDetails.token + '---token details')
                    resolve(tokenDetails)
                }
            })

        })
    }


    let saveToken = (tokenDetails) => {
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ 'userId': tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error(err.message, 'User Controller:save token()', 4)
                    let apiResponse = response.generate(true, ' Failed to save token', 500, null)
                    reject(apiResponse)

                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'User Controller:save token()', 4)
                            let apiResponse = response.generate(true, ' Failed to save token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token,
                        retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret,
                        retrievedTokenDetails.tokenGenTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            logger.error(err.message, 'User Controller:save token()', 4)
                            let apiResponse = response.generate(true, ' Failed to update token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })

        })
    }



    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login successful', 200, resolve)
            console.log(resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            let apiResponse = response.generate(true, 'Login Unsuccessful', 400, err)
            res.status(err.status)
            res.send(apiResponse)

        })
}


// end of the login function 

// Function to reset pwd

let resetPwd = (req, res) => {
    if (req.body.email && req.body.password) {
        UserModel.findOne({ 'email': req.body.email }, (err, userDetails) => {
            if (err) {
                logger.error('Failed to retrieve User Details', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'Failed to Find User Details', 403, null)
                res.send(apiResponse)
            } else if (check.isEmpty(userDetails)) {
                logger.error('No User Found', 'User Controller:find User()', 4)
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info('User Found', 'User Controller:find User()', 10)
                userDetails.password = passwordLib.hashPassword(req.body.password);
                userDetails.save((err, result) => {
                    if (err) {
                        logger.error('Failed To save Password', 'User Controller:resetPwd()', 10)
                        let apiResponse = response.generate(true, 'Failed To save Password', 500, error)
                        res.send(apiResponse)
                    } else {
                        let mailText = `Hi ${userDetails.firstName} ${userDetails.lastName}.
                        Your Password has been Changed!! Check If it is you!`
                        var mailOptions = {
                            from: '"ChatApp" <dprivate00@gmail.com>',
                            to: req.body.email,
                            subject: `Your Password`,
                            text: mailText
                        }
                        transporter.sendMail(mailOptions, (error, resp) => {
                            if (error) {
                                logger.error('Failed To Send Email', 'User Controller:forgotPwd()', 10)
                                let apiResponse = response.generate(true, 'Failed To Send Email', 500, error)
                                res.send(apiResponse)
                            } else {
                                result = result.toObject()
                                delete result.password;
                                delete result.__v;
                                delete result._id;
                                console.log(resp);
                                let apiResponse = response.generate(false, 'Password Reset Successful', 200, result)
                                res.send(apiResponse)
                            }
                        });
                    }
                })
            }
        })

    } else {
        logger.error('Failed To reset Password', 'User Controller:resetPwd()', 10)
        let apiResponse = response.generate(true, 'Failed To reset Password', 500, error)
        res.send(apiResponse)
    }
}

// end of the resetPwd function 

// Function to verify Upi details------

let verifyUpi = (req, res) => {
    if (req.body.id === 'abc@sbi') {
        let apiResponse = response.generate(false, `Verified Successfully!!`, 200, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(true, `Wrong Details`, 400, null)
        res.send(apiResponse)
    }
}


// Function to verify Bank details------

let verifyBank = (req, res) => {
    if ((bankDetails.password === req.body.password) && (bankDetails.bank === req.body.bank) && (bankDetails.userName === req.body.userName)) {
        let apiResponse = response.generate(false, `Verified Successfully!!`, 200, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(true, `Wrong Details`, 400, null)
        res.send(apiResponse)

    }
}

// Function to verify Card details------

let verifyCard = (req, res) => {
    if (cardDetails.cvv === req.body.cardCvv && cardDetails.expiry === req.body.cardExpiry && req.body.cardNo === cardDetails.cardNo) {
        let apiResponse = response.generate(false, `Verified Successfully!!`, 200, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(true, `Wrong Details`, 400, null)
        res.send(apiResponse)

    }
}


// Function to send OTP -----

let sendOtpSms = (req, res) => {
    var mobileNo = req.body.mobile;
    sendOtp.send(mobileNo, "SLPOTP", function (error, data) {
        if (data.type == 'success') {
            let apiResponse = response.generate(false, `OTP sent successfully`, 200, 'OTP sent successfully')
            res.send(apiResponse)
        } else if (data.type == 'error') {
            let apiResponse = response.generate(true, `OTP Sending failed`, 500, 'OTP Sending failed')
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(true, `Error occured:${err.message}`, 500, null)
            res.send(apiResponse)
        }
    });

}

// Function to verify OTP------

let verifyOtp = (req, res) => {
    var mobileNo = req.body.mobile;
    var otpNo = req.body.otp;
    sendOtp.verify(mobileNo, otpNo, function (error, data) {
        console.log(data); // data object with keys 'message' and 'type'
        if (data.type == 'success') {
            let apiResponse = response.generate(false, `OTP verified successfully`, 200, 'OTP verified successfully')
            res.send(apiResponse)
        } else if (data.type == 'error') {
            let apiResponse = response.generate(true, `OTP verification failed`, 500, 'OTP verification failed')
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(true, `Error occured:${err.message}`, 500, null)
            res.send(apiResponse)
        }
    });
}

// Function to logout user----

let logout = (req, res) => {
    AuthModel.remove({ 'authToken': req.params.authToken }, (err, result) => {
        if (err) {
            logger.error(err.message, 'User Controller:logout()', 10)
            let apiResponse = response.generate(true, `Error occured:${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, `Already Logged out or Invalid UserId`, 400, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, `Logged out succesfully`, 200, result)
            res.send(apiResponse)
        }
    })

} // end of the logout function.


module.exports = {
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    resetPwd: resetPwd,
    verifyBank: verifyBank,
    verifyCard: verifyCard,
    verifyUpi: verifyUpi,
    sendOtpSms: sendOtpSms,
    verifyOtp: verifyOtp,
    logout: logout

}// end exports