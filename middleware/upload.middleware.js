const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');


const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
  folder: "devconnect_profiles",
  format: file.mimetype.split("/")[1], // 🔥 important
  public_id: Date.now() + "-" + file.originalname,
})
    
})
const upload = multer({storage  ,limits: {
    fileSize: 5 * 1024 * 1024, // 🔥 5MB limit
  },})


module.exports = upload