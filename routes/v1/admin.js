var express = require('express');
var multer = require('multer');
var nodeCron = require('node-cron');

var router = express.Router();

const ProductController = require('../../Controller/Admin/Product');
const CategoryController = require('../../Controller/Admin/Category');
const SubscriptionController = require('../../Controller/Admin/Subscription');
const CouponController = require('../../Controller/Admin/Coupons');
const UserSellersController = require('../../Controller/Admin/UserSellers'); // added by anirbank-93
const ServiceController = require('../../Controller/Admin/ServiceCategory'); // added by anirbank-93
const OrderHistory = require('../../Controller/Admin/Orderhistory')
const ServiceSubCategoryController = require('../../Controller/Admin/SubCategory');// added by anirbank-93
const SellerBookingController = require('../../Controller/Admin/Slot/SellerBooking');//added by anirbank-93
const SellerReviews = require('../../Controller/Admin/ServiceReview');    // added by anirbank-93
const RefundPersonnel = require('../../Controller/Admin/RefundPersonnel');// added by anirbank-93
const ServiceRefund = require('../../Controller/Admin/ServiceRefund');    // added by anirbank-93
const MyAccountController = require('../../Controller/Admin/Myaccount');
const AdminCommission = require('../../Controller/Admin/AdminCommision');
const ReportController = require('../../Controller/Admin/Report');
const GrievanceController = require('../../Controller/Admin/Grievance');
const FeedbackController = require('../../Controller/Admin/Feedback');
const JobApplications = require('../../Controller/Admin/JobApplications');
const UserContacts = require('../../Controller/Admin/UserContact');
/** ----------------utility modules--------------- */
const csv_reports = require('../../service/csv_reports');
/**-------------utility modules end--------------- */

const AboutUs = require('../../Controller/Admin/Website_info/AboutUs');
const BlogController = require('../../Controller/Admin/Blog');
const TermsNConditn = require('../../Controller/Admin/Website_info/TermsNConditn');
const PrivacyPolicy = require('../../Controller/Admin/Website_info/PrivacyPolicy');
const SocialMediaInfo = require('../../Controller/Admin/Website_info/SocialMediaInfo');
const ContactUsInfo = require('../../Controller/Admin/Website_info/ContactUsInfo');
const SafetyGuide = require('../../Controller/Admin/Website_info/SafetyGuide');
const Associates = require('../../Controller/Admin/Website_info/Associates');
const LegalNotice = require('../../Controller/Admin/Website_info/LegalNotice');
const Careers = require('../../Controller/Admin/Website_info/Careers');
const CmsController = require('../../Controller/Admin/Website_info/Cms');

const AutomatedApi = require('../../Controller/Admin/AutomatedApi');
 
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

router.post('/category/Category',CategoryController.create)
router.get('/category/Category',CategoryController.viewAll)
router.put('/category/Category/:id',CategoryController.update)
router.delete('/category/Category/:id',CategoryController.Delete)

router.get('/category/new_catrequest',CategoryController.viewAllrequestdCategory)
router.put('/category/new_catrequest/:id',CategoryController.setStatus)

router.post('/subscription',SubscriptionController.create)
router.get('/subscription',SubscriptionController.viewAll)
router.put('/subscription/:id',SubscriptionController.update)
router.delete('/subscription/:id',SubscriptionController.Delete)
// all users subscription purchase history
router.post('/subscription/purchasehistory',SubscriptionController.allSubscriptionHistory) // added by anirbank-93
// single user subscription purchase history
router.get('/subscription/purchasehistory/:id', SubscriptionController.oneSubscriptionHistory) // added by anirbank-93

router.post('/coupons', CouponController.create); // added by anirbank-93
router.get('/coupons', CouponController.viewAll); // added by anirbank-93
router.delete('/coupons/:id', CouponController.Delete);// added by anirbank-93


router.get('/userlist', UserSellersController.viewUserList)     // added by anirbank-93
router.get('/viewuser/:id', UserSellersController.viewUser)     // added by anirbank-93
router.get('/seller-requests', UserSellersController.getSellerRequest);// added by anirbank-93
router.put('/approve-seller-requests/:id', UserSellersController.approveSellerRequest);// added by anirbank-93
router.put('/reject-seller-requests/:id', UserSellersController.rejectSellerRequest);// added by anirbank-93
router.get('/sellerlist', UserSellersController.viewSellerList) // added by anirbank-93
router.get('/viewseller/:id', UserSellersController.viewSeller)  // added by anirbank-93
router.put('/top-sellers/:id', UserSellersController.selectTopSeller);
router.get('/booking-and-user-stat', UserSellersController.bookingNUserStat);
router.delete('/userDelete/:id', UserSellersController.Delete);// added by anirbank-93


router.post('/service-category',upload.single("image"),ServiceController.create)// added by anirbank-93
router.get('/service-category', ServiceController.viewAllServices)              // added by anirbank-93
router.put('/service-category/:id',upload.single("image"),ServiceController.update)// added by anirbank-93
router.delete('/service-category/:id', ServiceController.Delete)                   // added by anirbank-93
router.get('/suggested-category', ServiceController.suggestedCategories)           // added by anirbank-93
router.put('/suggested-category/:id', ServiceController.approveSuggestedCategory)  // added by anirbank-93

router.get('/service-category/shop-services/:cat_id', ServiceController.shopServicePerCategory)// added by anirbank-93

router.get('/service-order-history', OrderHistory.viewAll)   // added by anirbank-93

router.post('/service/subcategory',ServiceSubCategoryController.create)    // added by anirbank-93
router.get('/service/subcategory', ServiceSubCategoryController.viewAll)   // added by anirbank-93
router.put('/service/subcategory/:id', ServiceSubCategoryController.update)// added by anirbank-93
router.delete('/service/subcategory/:id', ServiceSubCategoryController.Delete)// added by anirbank-93

// ----------------->Slot management section start
router.get('/seller-service/new-bookings', SellerBookingController.newBookings);
router.get('/seller-service/accepted-bookings', SellerBookingController.viewAcceptedBookings);
router.get('/seller-service/rejected-bookings', SellerBookingController.viewRejectedBookings);
// router.get('/booking-and-user-stat', SellerBookingController.serviceBookingStat);
// ------------------>Slot management section end

router.get('/seller-service/reviews', SellerReviews.getReviews);

router.put('/myaccount/update-password/:id', MyAccountController.updatePassword);

router.post('/service-commision', AdminCommission.addNEditCommission);

router.post('/add-report', upload.single("report"), csv_reports.reportAdd);
router.post('/user-subscriptions', ReportController.allUserSubscriptions);

router.get('/complaint', GrievanceController.viewAllComplaints);
router.get('/complaint/:id', GrievanceController.viewComplaintById);

router.get('/feedback', FeedbackController.viewAllFeedback);
router.get('/feedback/:id', FeedbackController.viewFeedbackById);

router.get('/received-applications', JobApplications.viewAll);
router.get('/received-applications/:id', JobApplications.viewById);

router.get('/contact-us', UserContacts.getAllContacts);

router.post('/personnel-register', RefundPersonnel.register);
router.get('/refund-personnel', RefundPersonnel.refundPersonnelList);
router.put('/refund-personnel/:id', RefundPersonnel.setStatus);

router.get('/service-refund-requests', ServiceRefund.getAllRefundRequests);
router.put('/approve-service-refund/:id', ServiceRefund.approveRefund);
router.get('/approved-service-refunds', ServiceRefund.getApprovedRefundList);
router.put('/reject-service-refund/:id', ServiceRefund.rejectRefund);
router.put('/initate-service-refund/:id', ServiceRefund.adminInitiateRefund);
/**==========================CMS Section========================== */
router.post('/about-us', AboutUs.addNEditSegment);
router.get('/about-us', AboutUs.viewAllSegments);
router.get('/about-us/:id', AboutUs.viewSegmentById);
router.delete('/about-us/:id', AboutUs.deleteSegment);

router.post('/terms-and-condition', TermsNConditn.addNEditSegment);
router.get('/terms-and-condition', TermsNConditn.viewAllSegments);
router.get('/terms-and-condition/:id', TermsNConditn.viewSegmentById);
router.delete('/terms-and-condition/:id', TermsNConditn.deleteSegment);

router.post('/privacy-policy', PrivacyPolicy.addNEditSegment);
router.get('/privacy-policy', PrivacyPolicy.viewAllSegments);
router.get('/privacy-policy/:id', PrivacyPolicy.viewSegmentById);
router.delete('/privacy-policy/:id', PrivacyPolicy.deleteSegment);

router.post('/social-media-info', SocialMediaInfo.addNEdit);
router.get('/social-media-info', SocialMediaInfo.viewAll);
router.get('/social-media-info/:id', SocialMediaInfo.viewById);
router.delete('/social-media-info/:id', SocialMediaInfo.deleteSegment);

router.post('/contact-us-info', ContactUsInfo.addNEdit);
router.get('/contact-us-info', ContactUsInfo.viewAll);
router.get('/contact-us-info/:id', ContactUsInfo.viewById);
router.delete('/contact-us-info/:id', ContactUsInfo.deleteSegment);

router.post('/safety-guide', SafetyGuide.addNEditSegment);
router.get('/safety-guide', SafetyGuide.viewAllSegments);
router.get('/safety-guide/:id', SafetyGuide.viewSegmentById);
router.delete('/safety-guide/:id', SafetyGuide.deleteSegment);

router.post('/blog', BlogController.addBlog);
router.post('/blog/image-upload', upload.single("image"), BlogController.imageUpload);
router.get('/blog', BlogController.viewAllBlogs);
router.get('/blog/:id', BlogController.viewBlogById);
router.put('/blog/:id', BlogController.editBlog);
router.delete('/blog/:id', BlogController.deleteBlog);

router.get('/blog-comment', CmsController.viewAllBlogComments);

router.post('/associate', Associates.addAssociate);
router.post('/associate/image-upload', upload.single("image"), Associates.imageUpload);
router.get('/associate', Associates.viewAllAssociates);
router.get('/associate/:id', Associates.viewAssociateById);
router.put('/associate/:id', Associates.editAssociate);
router.delete('/associate/:id', Associates.deleteAssociate);

router.post('/legal-notice', LegalNotice.addNEditSegment);
router.get('/legal-notice', LegalNotice.viewAllSegments);
router.get('/legal-notice/:id', LegalNotice.viewSegmentById);
router.delete('/legal-notice/:id', LegalNotice.deleteSegment);

router.post('/careers', Careers.addJobPost);
router.get('/careers', Careers.viewAllPostedJobs);
router.get('/careers/:id', Careers.viewPostedJobById);
router.put('/careers/:id', Careers.editPostedJob);
router.delete('/careers/:id', Careers.deletePostedJob);

router.post('/faq', CmsController.addFaq);
router.get('/faq', CmsController.viewAllFAQs);
router.get('/faq/:id', CmsController.viewFAQById);
router.put('/faq/:id', CmsController.editFAQ);
router.delete('/faq/:id', CmsController.deleteFAQ);

router.post('/articles', upload.single("image"), CmsController.addArticle);
router.get('/articles', CmsController.viewAllArticles);
router.get('/articles/:id', CmsController.viewArticleById);
router.put('/articles/:id', upload.single("image"), CmsController.editArticle);
router.delete('/articles/:id', CmsController.deleteArticle);

router.post('/cms/testimonials', upload.single("image"), CmsController.addTestimonial);
router.get('/cms/testimonials', CmsController.viewAllTestimonials);
router.get('/cms/testimonials/:id', CmsController.viewTestimonialById);
router.put('/cms/testimonials/:id', upload.single("image"), CmsController.editTestimonial);
router.delete('/cms/testimonials/:id', CmsController.deleteTestimonial);
/**========================CMS Section End======================== */

/**===================================== Automated tasks =====================================*/
/**---------------Clear all due payments every 3 days of a week ---------------*/
const clearDueEarnings = nodeCron.schedule("59 59 23 * * 0-6/3", AutomatedApi.payForServOrNot);
const payClaimedEarnings = nodeCron.schedule("59 59 23 * * 0-6/3", AutomatedApi.payForService);
const clearServiceRefund = nodeCron.schedule("59 59 23 * * 0-6/3", AutomatedApi.clearServiceRefunds);
const resetRefundClaimStatus = nodeCron.schedule("59 59 23 * * 0-6/3", AutomatedApi.resetRefundClaimStatus);
/**-----------------------------------------------------------------------------*/
/**===========================================================================================*/

module.exports = router;