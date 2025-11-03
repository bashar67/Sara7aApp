import { EventEmitter } from "node:events";
import { sendEmail, subjectEmail } from "../Emails/email.utils.js";
import { template } from "../Emails/generateHTML.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  // confirm email logic (send email)
  await sendEmail({
    to: data.to,
    subject: subjectEmail.CONFIRM_EMAIL,
    html: template(data.otp, data.firstName),
  }).catch((err) => {
    console.log(`Error in sending confirm email: ${err}`);
  });
});
