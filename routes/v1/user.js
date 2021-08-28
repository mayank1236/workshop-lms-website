var express = require("express");
var router = express.Router();

const ProductController = require("../../Controller/User/Product");
const UserSellerController=require('../../Controller/User/UserSellers');//added by anirbank-93
const SubscriptionController = require("../../Controller/User/Subscription");// added by anirbank-93
const ServiceController = require('../../Controller/User/ServiceCategory');  // added by anirbank-93
const ShopController = require("../../Controller/User/Shop");      // added by anirbank-93
const ShopServiceController = require("../../Controller/User/ShopServices"); // added by anirbank-93
/* Service schedule section start */
const SellerTimingController = require('../../Controller/User/Slot/SellerTiming');// added by anirbank-93
const SellerSlots = require('../../Controller/User/Slot/SellerSlots');    // added by anirbank-93
const SlotBookingController = require('../../Controller/User/Slot/SlotBooking');// added by anirbank-93
/* Service schedule section end */
const CartController = require('../../Controller/User/Cart')
const ServiceCart = require('../../Controller/User/ServiceCart')

const multer = require('multer');

var storage1 = multer.memoryStorage();
var upload1 = multer({storage: storage1});

var storage2 = multer.diskStorage({
  destination: (req,file,cb)=>{cb(null,"uploads/shop_banner_n_image")},
  filename: (req,file,cb)=>{
    if(file.fieldname == 'banner_img'){
      pro_img1 = "banner_"+file.originalname;// +Math.floor(100000+(Math.random()*900000))+"_"+Date.now()+"_"
      banner_img = pro_img1;
      cb(null,pro_img1);
    }
    if (file.fieldname == "shop_img") {
      pro_img2 = "shop_"+file.originalname;// +Math.floor(100000+(Math.random()*900000))+"_"+Date.now()+"_"
      shop_img = pro_img2;
      cb(null, pro_img2);
    }
  }
});

var upload2 = multer({storage: storage2});
var uploadMultiple = upload2.fields([{name: 'banner_img', maxCount: 1}, {name: 'shop_img', maxCount: 1}]);

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

/** ================================= with login url ================================= */
// router.get('/product/viewall',ProductController.viewProductList)
router.get("/listSubs/:id", SubscriptionController.viewAllsubscription);
router.get("/subscription/check-subscription/:id", SubscriptionController.checkUserSubscription);
router.post("/subscription-purchase", SubscriptionController.newSubscription);// added by anirbank-93

router.get('/seller-portal/:token', UserSellerController.sellerTokenCheck);    // added by anirbank-93
// router.post('/seller-portal/login', UserSellerController.sellerLogin);// added by anirbank-93
router.get('/seller/:id', UserSellerController.viewUser);   // added by anirbank-93
router.get('/list-of-users', UserSellerController.viewUserList);// added by anirbank-93
router.get('/list-of-sellers', UserSellerController.viewSellerList);// added by anirbank-93

router.get('/service-category', ServiceController.viewAllServices); // added by anirbank-93
router.get('/service-category/:id', ServiceController.viewService); // added by anirbank-93
router.get('/service/subcategory/:id', ServiceController.viewServiceSubCategory);// added by anirbank-93
// route to fetch all shop services available for a service category
router.get('/service-category/shop-services/:id', ServiceController.viewShopServicesPerService);// added by anirbank-93

router.post('/shop', uploadMultiple, ShopController.createNUpdate);// added by anirbank-93
router.get('/shop', ShopController.viewAllShops);   // added by anirbank-93
router.get('/shop/:id', ShopController.viewShop);   // added by anirbank-93

router.post('/shop/services', upload1.single("image"), ShopServiceController.create);// added by anirbank-93
// route to fetch all services of a shop
router.get('/shop/all-services/:seller_id', ShopServiceController.viewShopServicesPerSeller);// added by anirbank-93
// route to fetch one service of a shop
router.get('/shop/view-shopservice/:seller_id/:category_id', ShopServiceController.viewOneService);// added by anirbank-93  
router.get('/shop/shopservice-details/:id', ShopServiceController.viewShopServiceDetails); // added by anirbank-93
router.put('/shop/services/:id', upload1.single("image"), ShopServiceController.update);// added by anirbank-93
router.delete('/shop/services/:id', ShopServiceController.Delete);    // added by anirbank-93

// ----------------->Slot management section start
router.post('/shop-service/timing', SellerTimingController.createSlot); // added by anirbank-93
router.get('/shop-service/weekly-timings/:id', SellerTimingController.viewShopServiceTimings);// added by anirbank-93
router.put('/shop-service/timing/:id', SellerTimingController.editSlot);// added by anirbank-93
router.delete('/shop-service/timing/:id', SellerTimingController.deleteSlot);// added by anirbank-93

router.post('/seller/slot', SellerSlots.addSellerServiceSlot);

router.post('/shop-service/availability', SlotBookingController.checkAvailability);// added by anirbank-93
router.post('/shop-service/day-timing', SlotBookingController.viewSlotsForADay);
router.post('/shop-service/book-slot', SlotBookingController.bookAppointment); // added by anirbank-93
router.put('/shop-service/cancel-slot/:id', SlotBookingController.cancelAppointment);// added by anirbank-93
router.put('/shop-service/update-slot/:id', SlotBookingController.editAppointment);  // added by anirbank-93
router.put('/shop-service/complete-slot/:id', SlotBookingController.completeAppointment);// added by anirbank-93
// ------------------>Slot management section end

/**====================Product cart api's======================= */
router.post('/add-to-cart', CartController.addToCart);
router.put('/updateCart/:user_id/:prod_id', CartController.updateCart);
router.get('/get-cart/:user_id', CartController.getCart);
router.delete('/cartDelete/:id',CartController.Delete)
/**=================Product cart api's end======================= */

/**====================Service cart api's======================== */
router.post('/to-service-cart', ServiceCart.addToServiceCart)
router.get('/get-service-cart/:user_id', ServiceCart.getServiceCart)
/**================Service cart api's end======================== */
/** ================================= with login url section end ================================ */

module.exports = router;
