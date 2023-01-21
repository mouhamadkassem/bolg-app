const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dg2j5sfkf",
  api_key: 773947928629166,
  api_secret: "Vlh5LDt0Ums5OqdETb7WFUiZy6I",
});

async function cloudinaryUploadImg(fileToUpload) {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: data?.secure_url,
    };
  } catch (err) {
    return err;
  }
}

module.exports = cloudinaryUploadImg;
