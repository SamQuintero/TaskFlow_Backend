import { Request, Response } from "express";
import mailer from '../models/mailer.js';


export async function sendVerificationEmail(email: string, token: string, name:string) {

const mailOptions = {
  from: process.env.GMAIL_ADRESS,
  to: email,
  subject: "Verifica tu cuenta | TaskFlow",
  template: "verifyEmail",  
  context: {
    name,
    verifyUrl: `${process.env.BACKEND_URL}/auth/verify?token=${token}`
  }
};
 try {
        const mailerInstance = await mailer;
        await mailerInstance.sendMail(mailOptions);
       
        console.log(mailOptions);
    } catch (error) {
        console.log(error)
    }
}

export async function sendResetPassword(email: string, resetLink: string, name: string){

    const mailOptions = {
      to: email,
      from: process.env.GMAIL_ADRESS,
      subject: "Recuperación de contraseña",
      template: "resetPassword",     
      context: {
        name: name,
        resetLink
      }
    };
    try {
        const mailerInstance = await mailer;
        await mailerInstance.sendMail(mailOptions);
       
        console.log(mailOptions);
    } catch (error) {
        console.log(error)
    }
    
}