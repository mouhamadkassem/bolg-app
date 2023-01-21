const express = require("express");
const app = express();
const dbConnect = require("./config/db/dbConnect");
const dotenv = require("dotenv"); // we use this package to secure the data bases
const PORT = process.env.PORT || 1200;
const userRoutes = require("./route/users/UsersRoute");
const postRoutes = require("./route/posts/postRoute");
const mailRoute = require("./route/sendMail/sendMailRoute");
const categoryRoute = require("./route/category/categoryRoute");
const { errorHandler, notFound } = require("./middlewars/error/erroHandler");
const commentRoutes = require("./route/comments/commentRoute");
const cors = require("cors");

dotenv.config();

app.listen(PORT, console.log(`this is your link : http://localhost:${PORT}`));

dbConnect();

// connet network
app.use(cors());

app.use(express.json());

// users route
app.use("/api/users", userRoutes);
// posts route
app.use("/api/posts", postRoutes);
// comment route
app.use("/api/comments", commentRoutes);
// send mail from user to user
app.use("/api/sendMail", mailRoute);
// category route
app.use("/api/category", categoryRoute);

app.get("/", (req, res) => {
  res.send("hello from server !!??????????");
});

app.use(notFound);

app.use(errorHandler);
