/**
 * @author : Mor NDIAYE - Lucas CHEN
 * @copyright: 2019 - 2020
 * Permet de mettre la première lettre d'une chaîne de caractère en majuscule
 *  dans notre cas: les champs firstName, country, etc
 * @param {*} s
 */

// Mettre la première lettre d'une chaîne de caractères en Majuscule
exports.capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// sendEmail methode: Permet d'envoyer des mails sécurisé avec le protocole smtp
const nodeMailer = require("nodemailer");
const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "quickpay.pli@gmail.com",
            pass: "myPassword"
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};

