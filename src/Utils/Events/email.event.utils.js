import { EventEmitter } from "node:events";
import { sendEmail, subjectEmail } from "../Emails/email.utils.js";
import { template } from "../Emails/generateHTML.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  // confirm email logic (send email)
  await sendEmail({
    to: data.to,
    subject: subjectEmail.CONFIRM_EMAIL,
    html: template(data.otp, data.firstName, subjectEmail.CONFIRM_EMAIL),
  }).catch((err) => {
    console.log(`Error in sending confirm email: ${err}`);
  });
});

eventEmitter.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: subjectEmail.PASSWORD_RESET,
    html: template(data.otp, data.firstName, subjectEmail.PASSWORD_RESET),
  }).catch((err) => {
    console.log(`Error in sending confirm email: ${err}`);
  });
});
