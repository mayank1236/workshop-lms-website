const express = require('express');
const router = express.Router();
// const multer = require('multer');

// var storage = multer.memoryStorage();
// var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({status: false})
});

const AdminController = require('../../Controller/Auth/Admin');
const UserController = require('../../Controller/Auth/User');
const ProductController = require('../../Controller/User/Product');// added by anirbank-93
const ServiceController = require('../../Controller/User/ServiceCategory');// added by anirbank-93
const ShopServiceController = require('../../Controller/User/ShopServices');// added by anirbank-93
const SearchController = require('../../Controller/User/Search');  // added by anirbank-93
/**-------------------------Website info section------------------------- */
const AboutUs = require('../../Controller/User/Website_info/AboutUs');
const TermsNConditn = require('../../Controller/User/Website_info/TermsNConditn');
const PrivacyPolicy = require('../../Controller/User/Website_info/PrivacyPolicy');
const SocialMediaInfo = require('../../Controller/User/Website_info/SocialMediaInfo');
const ContactUsInfo = require('../../Controller/User/Website_info/ContactUsInfo');
/**-----------------------Website info section end----------------------- */

const middleware  = require('../../service/middleware').middleware;

const AdminRoute = require('./admin');
const UserRoute = require('./user');

/** ================================= without login url ================================= */

router.post('/admin/register', AdminController.register);
router.post('/admin/login', AdminController.login);

router.post('/user/register', UserController.register); // add upload image option in future
router.post('/user/login', UserController.login);

router.get('/user/listProducts', UserController.viewProductList);
router.get('/user/viewproduct/:id', ProductController.viewSingleProduct);   // added by anirbank-93

router.get('/user/service-category', ServiceController.viewAllServices);// added by anirbank-93
router.get('/user/service-category/:id', ServiceController.viewService);// added by anirbank-93

router.get('/user/service-category/shop-services/:id', ServiceController.viewShopServicesPerService);// added by anirbank-93

router.get('/user/shop/top-services', ShopServiceController.viewTopServiceProvider);// added by anirbank-93

router.post('/user/search-service', SearchController.allServicesSearch);   // added by anirbank-93

router.get('/user/about-us', AboutUs.viewAllSegments);
router.get('/user/about-us/:id', AboutUs.viewSegmentById);

router.get('/user/terms-and-condition', TermsNConditn.viewAllSegments);
router.get('/user/terms-and-condition/:id', TermsNConditn.viewSegmentById);

router.get('/user/privacy-policy', PrivacyPolicy.viewAllSegments);
router.get('/user/privacy-policy/:id', PrivacyPolicy.viewSegmentById);

router.get('/user/social-media-info', SocialMediaInfo.viewAll);
router.get('/user/social-media-info/:id', SocialMediaInfo.viewById);

router.get('/user/contact-us-info', ContactUsInfo.viewAll);
router.get('/user/contact-us-info/:id', ContactUsInfo.viewById);
/** ================================= without login url section end ================================ */

router.use(middleware);

router.use('/admin', AdminRoute);
router.use('/user', UserRoute);

module.exports = router;