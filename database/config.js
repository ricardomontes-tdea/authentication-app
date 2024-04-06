const mongoose = require('mongoose');

const {
  MONGODB_URI,
  DB_NAME
} = process.env 


const dbConnection = async () => {
  try {
    mongoose.connect(`${ MONGODB_URI }/${ DB_NAME }`);
    console.log('[INFO] MONGODB is connected');
  } catch (error) {
    console.log(error);
    throw new Error('[ERROR] Is not possible initialize MongoDB connection :( ');
  }
}

module.exports = {
  dbConnection
};

