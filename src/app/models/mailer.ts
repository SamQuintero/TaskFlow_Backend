import nodemailer from 'nodemailer';
import path from 'path';

const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADRESS,
        pass: process.env.GMAIL_PASSWORD
    }
})

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./src/app/views/"),
    defaultLayout: "",
  },
  viewPath: path.resolve("./src/app/views/"),
};

async function setupMailer() {
  const hbs = (await import("nodemailer-express-handlebars")).default;
  // Registramos el plugin
  mailer.use("compile", hbs(handlebarOptions));
  return mailer;
}

const mailerPromise =
  process.env.NODE_ENV === "test"
    ? Promise.resolve({
        // Dummy transporter for tests
        sendMail: async (_opts: any) => ({ accepted: [], rejected: [] }),
      } as any)
    : setupMailer();

export default mailerPromise;
