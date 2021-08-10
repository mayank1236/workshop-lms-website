var express = require('express');
var router = express.Router();

const ProductController = require('../../Controller/Admin/Product');
const CategoryController = require('../../Controller/Admin/Category');
const SubscriptionController = require('../../Controller/Admin/Subscription');
const UserSellersController = require('../../Controller/Admin/UserSellers'); // added by anirbank-93
const ServiceController = require('../../Controller/Admin/Service');         // added by anirbank-93
const ServiceSubCategoryController = require('../../Controller/Admin/SubCategory');// added by anirbank-93

const multer = require('multer');
 
var storage = multer.memoryStorage()
var upload = multer({storage: storage});


router.get('/',function(req,res,next)
{
    return res.send({
        status:false
    })
})

router.use((req,res,next)=>{
    if (req.userType == "Admin") {
        next();
    } else {
        res.send({status: false, msg: "parmison not found" });
    }
})

router.post('/product/Product',upload.single("image"),ProductController.create)
router.get('/product/Product',ProductController.viewAll)
router.put('/product/Product/:id',upload.single("image"),ProductController.update)
router.delete('/product/Product/:id',ProductController.Delete)

router.post('/subscription',SubscriptionController.create)
router.get('/subscription',SubscriptionController.viewAll)
router.put('/subscription/:id',SubscriptionController.update)
router.delete('/subscription/:id',SubscriptionController.Delete)

router.get('/subscription/purchasehistory',SubscriptionController.subscriptionHistory)





router.post('/category/Category',CategoryController.create)
router.get('/category/Category',CategoryController.viewAll)
router.put('/category/Category/:id',CategoryController.update)
router.delete('/category/Category/:id',CategoryController.Delete)

router.get('/userlist', UserSellersController.viewUserList)     // added by anirbank-93
router.get('/viewuser/:id', UserSellersController.viewUser)     // added by anirbank-93
router.get('/sellerlist', UserSellersController.viewSellerList) // added by anirbank-93
router.get('/viewseller/:id', UserSellersController.viewSeller)  // added by anirbank-93

router.post('/service-category',upload.single("image"),ServiceController.create)// added by anirbank-93
router.get('/service-category', ServiceController.viewAllServices)              // added by anirbank-93
router.put('/service-category/:id',upload.single("image"),ServiceController.update)// added by anirbank-93
router.delete('/service-category/:id', ServiceController.Delete)                   // added by anirbank-93

router.post('/service/subcategory',ServiceSubCategoryController.create)    // added by anirbank-93
router.get('/service/subcategory', ServiceSubCategoryController.viewAll)   // added by anirbank-93
router.put('/service/subcategory/:id', ServiceSubCategoryController.update)// added by anirbank-93
router.delete('/service/subcategory/:id', ServiceSubCategoryController.Delete)// added by anirbank-93

module.exports = router;