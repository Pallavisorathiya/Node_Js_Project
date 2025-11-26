const express = require('express');
const passport = require('passport');

const {dashboardpage,loginPage,loginUser,logoutUser,changePasswordPage, changePassword,profilePage,forgotPasswordPage,sendOTP,verifyOTPPage,updatePasswordPage,verifyOTP,updatePassword
} = require('../controllers/index.controller');

const routes = express.Router();

function setAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

routes.get('/', loginPage);
routes.post('/login', passport.authenticate('local', { failureRedirect: '/' }), loginUser);

routes.get('/dashboard', setAuthenticated, dashboardpage);

routes.get('/logout', logoutUser);

routes.get('/changePassword', setAuthenticated, changePasswordPage);
routes.post('/changePassword', setAuthenticated, changePassword);
routes.get("/profile",setAuthenticated,  profilePage);

routes.get('/forgotPassword', forgotPasswordPage);
routes.post('/send-otp', sendOTP);
routes.get('/verify-otp', verifyOTPPage);
routes.post('/verify-otp', verifyOTP);
routes.get('/update-password', updatePasswordPage);
routes.post('/update-password', updatePassword);

routes.use('/admin', require('./admin.routes'));

routes.use("/category",  require('./category.routes'));
routes.use("/subcategory", require('./subcategory.routes'));
routes.use("/extracategory", require("./extraCategory.routes"));
routes.use("/product", require('./product.routes'))

module.exports = routes;
