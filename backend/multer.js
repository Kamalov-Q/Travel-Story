const multer = require("multer");

const path = require("path");

//Storage configuration
const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "./uploads/"); //Destination folder for storing uploaded files
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


//File filter to accept only images
const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

//Initialize multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
