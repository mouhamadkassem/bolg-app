const expressAsyncHandler = require("express-async-handler");
const EmailMsg = require("../../model/emailMessaging/emailMessaging");
const Filter = require("bad-words");

const sgMail = require("@sendgrid/mail");

const sendEmailMsgCtrl = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  const testMessage = subject + " " + message;
  const filter = new Filter();
  const isProfane = filter.isProfane(testMessage);
  if (isProfane)
    throw new Error(
      "you can't send this message because it's conten a bad words"
    );
  try {
    const msg = {
      to,
      subject,
      text: message,
      from: "mohamadkassem101@gmail.com",
    };
    await sgMail.send(msg);

    const showMessage = await EmailMsg.create({
      sentBy: req.user._id,
      fromEmail: req.user.email,
      toEmail: to,
      subject,
      message,
    });
    res.json("showMessage");
  } catch (err) {
    res.json(err);
  }
});

module.exports = {
  sendEmailMsgCtrl,
};
