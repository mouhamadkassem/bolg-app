const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      // we use this way for the secure (.env file)
      process.env.MONGODB_URL
      //   {
      //     useCreateIndex: true,
      //     useFindModify: true,
      //     useUnifiedTopology: true,
      //     useNewUrlParser: true,
      //   }
    );
    console.log("your application is connect");
  } catch (err) {
    console.log(`error ${err}`);
  }
};

module.exports = dbConnect;
