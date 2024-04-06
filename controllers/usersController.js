const { response } = require('express');
const User = require('../models/User');

const jwt = require('jsonwebtoken');


const createUser = async (req, res = response) => {
  const { name, email, password } = req.body

  const secret = 'shhhhh';

  const token = jwt.sign({
    email, password
  }, secret, { expiresIn: '1h' });

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'User already exists'
        }
      });
    }

    user = new User({ name, email, password });

    await user.save();

    res.json({
      ok: true,
      msg: 'registered',
      user: {
        id: user.id, email: user.email
      },
      token
    });
  } catch (error) {
    console.error('[ERROR]', error);

    res.status(500).json({
      ok: false,
      error: {
        message: 'Something went worng, please contact to admin'
      }
    })
  }
};

const loginUser = async (req, res = response, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email });

  let data = null;

  if (!user) {
    return res.status(400).json({
      ok: false,
      error: {
        message: 'Wrong Credentials'
      }
    });
  }

  const token = req.headers.authorization

  if (!token){
    return res.status(401).json({
      ok: false,
      error: {
        message: 'Missing Token'
      }
    })
  }

  jwt.verify(token, 'shhhhh', (error, decoded) => {
    if (error) {
      return res.status(403).json({
        ok: false,
        error: {
          message: 'Invalid Token'
        }
      })
    };
    data = decoded
    next();
  })


  try {
    res.status(200).json({
      ok: true,
      uid: user.id,
      email: user.email,
      data: data
    });

  } catch (error) {
    console.error('[ERROR]', error);

    res.status(500).json({
      ok: false,
      error: {
        message: 'Something went worng, please contact to admin'
      }
    });
  }
}

const renewToken = (req, res = response) => {
  const { token } = req.body;

  res.json({
    ok: true,
    msg: 'renew',
    token: token
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken
};