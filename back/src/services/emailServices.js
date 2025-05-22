import nodemailer from 'nodemailer';


// Crea un objeto transporter usando el servicio Gmail y las credenciales del remitente
const transporter = nodemailer.createTransport({
    service: "gmail", // Uso del servicio de Gmails
    auth: {
        user: "marmaladegirl7@gmail.com", //Dirección de correo del remitente
        pass: "vicy wjti racu aeie", //Contraseña de la aplicación de Gmail (no la contraseña normal de Gmail)
    },
});

// Envia un correo utilizando un transportador 
export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: "marmaladegirl7@gmail.com",
            to: to,
            subject: subject,
            html: html,
        }

        await transporter.sendMail(mailOptions)
        console.log("El correo se ha enviado correctamente");

    } catch (error) {
        console.log("No se ha enviado el correo", error);

    }
}
