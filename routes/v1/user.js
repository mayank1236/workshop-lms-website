var express = require("express");
var router = express.Router();

const ProductController = require("../../Controller/User/Product");
const UserSellerController = require('../../Controller/User/UserSellers');//added by anirbank-93
const SubscriptionController = require("../../Controller/User/Subscription");// added by anirbank-93
const ServiceController = require('../../Controller/User/ServiceCategory');  // added by anirbank-93
const ShopController = require("../../Controller/User/Shop");      // added by anirbank-93
const ShopServiceController = require("../../Controller/User/ShopServices"); // added by anirbank-93
/* Service schedule section start */
const SellerTimingsController = require('../../Controller/User/Slot/SellerTimingsNSlots');// added by anirbank-93
const SellerAccount = require('../../Controller/User/SellerMyaccount');   // added by anirbank-93
const UserBookingActions = require('../../Controller/User/Slot/UserBookingActions');// added by anirbank-93
/* Service schedule section end */
const SellerBookingActions = require('../../Controller/User/Slot/SellerBookingActions');// added by anirbank-93
const UserAccount = require('../../Controller/User/Myaccount');       // added by anirbank-93
const CartController = require('../../Controller/User/Cart');
const ServiceCart = require('../../Controller/User/ServiceCart');
const Checkout = require('../../Controller/User/Checkout');
const ServiceReview = require('../../Controller/User/ServiceReview');
const SearchController = require('../../Controller/User/Search');

const multer = require('multer');

var storage1 = multer.memoryStorage();
var upload1 = multer({ storage: storage1 });

var storage2 = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/shop_banner_n_image") },
  filename: (req, file, cb) => {
    if (file.fieldname == 'banner_img') {
      pro_img1 = "banner_" + file.originalname;// +Math.floor(100000+(Math.random()*900000))+"_"+Date.now()+"_"
      banner_img = pro_img1;
      cb(null, pro_img1);
    }
    if (file.fieldname == "shop_img") {
      pro_img2 = "shop_" + file.originalname;// +Math.floor(100000+(Math.random()*900000))+"_"+Date.now()+"_"
      shop_img = pro_img2;
      cb(null, pro_img2);
    }
  }
});

var upload2 = multer({ storage: storage2 });
var uploadMultiple1 = upload2.fields([{ name: 'banner_img', maxCount: 1 }, { name: 'shop_img', maxCount: 1 }]);

var storage3 = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "uploads/shop_services") },
  filename: (req, file, cb) => {
    if (file.fieldname == "image") {
      pro_img = "image_" + file.originalname;
      service_img = pro_img;
      cb(null, pro_img);
    }
    if (file.fieldnamefieldname == "video") {
      pro_aud = "audio_" + file.originalname;
      service_aud = pro_aud;
      cb(null, pro_aud);
    }
  }
});

var upload3 = multer({ storage: storage3 });
var uploadMultiple2 = upload3.fields([{ name: "image", maxCount: 20 }, { name: "video", maxCount: 1 }]);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: false });
});

router.use((req, res, next) => {
  if (req.userType == "User") {
    next();
  } else {
    res.send({ status: false, msg: "Permission not found" });
  }
});

/** ================================= WITH LOGIN URL ================================= */
// router.get('/product/viewall',ProductController.viewProductList)
router.get("/listSubs/:id", SubscriptionController.viewAllsubscription);
router.get("/subscription/check-subscription/:id", SubscriptionController.checkUserSubscription);
router.post("/subscription-purchase", SubscriptionController.newSubscription);// added by anirbank-93

router.get('/seller-portal/:token', UserSellerController.sellerTokenCheck);    // added by anirbank-93
// router.post('/seller-portal/login', UserSellerController.sellerLogin);// added by anirbank-93
router.get('/seller/:id', UserSellerController.viewUser);   // added by anirbank-93
router.get('/list-of-users', UserSellerController.viewUserList);// added by anirbank-93
router.get('/list-of-sellers', UserSellerController.viewSellerList);// added by anirbank-93

/**====================Product cart api's======================= */
router.post('/add-to-cart', CartController.addToCart);
router.put('/updateCart/:user_id/:prod_id', CartController.updateCart);
router.get('/get-cart/:user_id', CartController.getCart);
router.delete('/cartDelete/:id', CartController.Delete);
/**=================Product cart api's end======================= */

router.get('/service-category', ServiceController.viewAllServices); // added by anirbank-93
router.get('/service-category/:id', ServiceController.viewService); // added by anirbank-93
router.get('/service/subcategory/:id', ServiceController.viewServiceSubCategory);// added by anirbank-93
// route to fetch all shop services available for a service category
router.get('/service-category/shop-services/:id', ServiceController.viewShopServicesPerService);// added by anirbank-93

router.post('/shop', uploadMultiple1, ShopController.createNUpdate);// added by anirbank-93
router.get('/shop', ShopController.viewAllShops);   // added by anirbank-93
router.get('/shop/:id', ShopController.viewShop);   // added by anirbank-93

router.post('/shop/services', upload1.single("video"), ShopServiceController.create);// added by anirbank-93
router.post('/shop-service-images', upload1.single("image"), ShopServiceController.shopserviceImageUrl);// anirbank-93
router.post('/shop-service-audio', upload1.single("audio"), ShopServiceController.shopserviceImageUrl);// anirbank-93
// route to fetch all services of a shop
router.get('/shop/all-services/:seller_id', ShopServiceController.viewShopServicesPerSeller);// added by anirbank-93
// route to fetch one service of a shop
router.get('/shop/view-shopservice/:seller_id/:category_id', ShopServiceController.viewOneService);// added by anirbank-93  
router.get('/shop/shopservice-details/:id', ShopServiceController.viewShopServiceDetails); // added by anirbank-93
router.put('/shop/services/:id', upload1.single("image"), ShopServiceController.update);// added by anirbank-93
router.delete('/shop/services/:id', ShopServiceController.Delete);    // added by anirbank-93
router.post('/image-uploadurl', upload1.single("image"), ShopServiceController.chatImageUrlApi);// added by anirbank-93

router.get('/seller_account/service-order-history/:seller_id', SellerAccount.viewAll);
router.get('/seller_account/booking-stat/:seller_id', SellerAccount.serviceBookingStat);

// ----------------->Slot management section start
router.post('/shop-service/timing', SellerTimingsController.createSlot); // added by anirbank-93
router.get('/shop-service/weekly-timings/:id', SellerTimingsController.viewShopServiceTimings);// added by anirbank-93
router.put('/shop-service/timing/:id', SellerTimingsController.editSlot);// added by anirbank-93
router.delete('/shop-service/timing/:id', SellerTimingsController.deleteSlot);// added by anirbank-93

router.get('/seller-service/new-bookings/:seller_id', SellerBookingActions.newBookings);// added by anirbank-93
router.put('/seller-service/accept-booking/:id', SellerBookingActions.acceptNewBooking);      // added by anirbank-93
router.get('/seller-service/accepted-bookings/:seller_id', SellerBookingActions.viewAcceptedBookings);
router.put('/seller-service/reject-booking/:id', SellerBookingActions.rejectNewBooking);      // added by anirbank-93
router.get('/seller-service/rejected-bookings/:seller_id', SellerBookingActions.viewRejectedBookings);
// ------------------>Slot management section end

router.post('/shop-service/availability', UserBookingActions.checkAvailability);// added by anirbank-93
router.post('/shop-service/day-timing', UserBookingActions.viewSlotsForADay);   // added by anirbank-93
/** Below api for both book service slot and add to service cart */
router.post('/shop-service/book-slot', UserBookingActions.bookAppointment); // added by anirbank-93
/**------------------------------------------------------------- */

/**====================Service cart api's======================== */
router.get('/get-service-cart/:user_id', ServiceCart.getServiceCart)
router.delete('/delete-cart/:id', ServiceCart.DeleteCart)
/**================Service cart api's end======================== */

/**====================Checkout api's============================ */
router.post('/shop-service/checkout', Checkout.create)
/**================Checkout api's end============================ */

router.get('/myaccount/service-order-history/:user_id', UserAccount.viewAll);
router.put('/myaccount/cancel-booking/:id', UserAccount.cancelBooking);
router.put('/myaccount/update-profile/:id', UserAccount.updateProfile);
router.put('/myaccount/update-password/:id', UserAccount.updatePassword);
router.delete('/myaccount/delete-profile/:id', UserAccount.deleteProfile);
router.put('/myaccount/image-upload/:id', upload1.single("profile"), UserAccount.imageurlApi);

/**=================Service review api's========================= */
router.post('/seller-service/reviews', ServiceReview.giveOrderReview); // rating of a successfully completed order
//
router.get('/seller-service/reviews/:seller_id', ServiceReview.getReviews);
/**===============Service review api end========================= */

/**=======================Service search========================= */
router.post('/search-service', SearchController.Search);
/**=====================Service search end======================= */
/** ================================= with login url section end ================================ */

module.exports = router;
