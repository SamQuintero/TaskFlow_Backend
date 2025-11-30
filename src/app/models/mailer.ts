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

export default setupMailer();