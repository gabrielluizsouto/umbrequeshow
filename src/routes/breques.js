const express = require('express');
const router = express.Router();

//import middlewares
//const checkAuth = require('../middlewares/check-auth');
//const checkAuthAdmin = require('../middlewares/check-auth-admin');

//import controlers
const BrequesController = require('../controllers/breques');

// Handle incoming requests 
router.get('/', BrequesController.breques_get_all);

router.get('/random', BrequesController.breques_get_random);

router.get('/id/:brequeId', BrequesController.breques_get_one);

router.get('/specificcategory/:category', BrequesController.breques_get_category);

router.get('/categories/', BrequesController.breques_get_categories);

router.post('/', BrequesController.breques_add);



//router.delete('/delete-all', checkAuthAdmin, BrequesController.breques_delete_all);

//router.delete('/:brequeId', checkAuthAdmin, BrequesController.breques_delete_breque);


module.exports = router;