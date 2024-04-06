const { Router } = require('express');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/usersController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');


// Create a new user
router.post(
  '/signUp', 
  [
    check('name', 'Name is mandatory').not().isEmpty(),
    check('email', 'Email is mandatory').isEmail(),
    check('password', 'Password min length is 6').isLength({ min: 6 }),
    validateFields
  ],
  createUser
);

router.post(
  '/logIn', 
  [
    check('email', 'Email is mandatory').isEmail(),
    check('password', 'Password is mandatory').not().isEmpty(),
    validateFields
  ],
  loginUser
);

router.get('/renew', renewToken);

module.exports = router;