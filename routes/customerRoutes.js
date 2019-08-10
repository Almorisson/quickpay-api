const express = require('express');
const { authenticate } = require('../helpers/authHelpers');
const {
        register, login, logout,
        findCustomerById, profile,
        allCustomers, getCustomerById,
        unregister, update, addPhoto,
        customerPhoto
        } = require('../controller/CustomerController');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage });

// exports.user = (function(){
//     var user = express.Router();

//     user.route('/register/').post(usersController.register);
//     user.route('/login/').post(usersController.login);
//     user.route('/profile/').get(usersController.profile);
//     user.route('/users').get(usersController.listUsers);
//     user.route('/users').put(usersController.updateProfile);
//     user.route('/users/password').put(usersController.updatePassword);
//     user.route('/users/').delete(usersController.delete);
//     user.route('/unregister/').delete(usersController.unregister);
//     //user.post("/profile/photo", folderName("uploads").single("image"), usersController.addPhoto);
//     user.post("/profile/photo", upload.single("image"), usersController.addPhoto);
//     user.route('/transaction').post(usersController.transaction);
//     return user;
// })();


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:customerId', authenticate, profile);
router.get('/logout', logout);
router.get('/', allCustomers);
router.get('/:customerId', authenticate, getCustomerById);
router.delete('/:customerId', authenticate, unregister);
router.put('/:customerId', authenticate, update);
router.post("/profile/photo", upload.single("image"), addPhoto);
router.put("/profile/photo", customerPhoto);
// router.put('/users', CustomerController.updateProfile);
// router.put('/password', CustomerController.updatePassword);
// router.delete('/users/', CustomerController.delete);
// router.delete('/unregister', CustomerController.unregister);
// //user.post("/profile/photo", folderName("uploads").single("image"), usersController.addPhoto);
// router.post("/profile/photo", upload.single("image"), CustomerController.addPhoto);
// router.post('/transaction', CustomerController.transaction);

router.param("customerId", findCustomerById) // any route with :traderId will execute this findCustomerById() first

module.exports = router
