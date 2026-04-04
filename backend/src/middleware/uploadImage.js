const multer = require("multer");

// Upload langsung
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname;
//     cb(null, originalName);
//   },
// });

// const upload = multer({ storage: storage });
// End Upload langsung

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|webp|avif|svg|PNG)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

module.exports = upload;
