const util = require("util");
const multer = require("multer");
const moment = require('moment');
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/uploads/files");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);

    const dateTime = moment().format("YYYYMMDDhhmmss");
    const fileName = file.originalname.split('.');
    const len = parseInt(fileName.length) - 1;
    const finalFileName = fileName[0]+'_'+dateTime+'.'+fileName[len];
    cb(null, finalFileName);
  },
});

let uploadFile = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    console.log('FILE---', file);
    console.log('FILE mimetype---', file.mimetype);
  	if (
      file.mimetype == "text/plain" || 
      file.mimetype == "image/jpeg" || 
      file.mimetype == "image/png" || 
      file.mimetype == "application/pdf" ||
      file.mimetype == "application/msword" ||
      file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype == "application/vnd.ms-excel" ||
      file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx and .txt extensions allowed!'));
    }
  }
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;