const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

app.get('/health', (req, res) => {
  res.send('Server is running!');
});



const app = express();
app.use(cors()); // CORS erlauben, damit Frontend mit Backend reden kann
app.use(express.json()); // JSON Body parsen

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "meta.repons@gmail.com",    // Deine Gmail-Adresse
        pass: "ynsdskhgvwcbkqcx"          // Dein App-Passwort (kein normales Gmail Passwort!)
    }
});

app.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        let info = await transporter.sendMail({
            from: '"exploit" <meta.repons@gmail.com>',  // Absender E-Mail anpassen
            to,
            subject,
            text: body,
            html: `<p>${body.replace(/\n/g, "<br>")}</p>`
        });
        console.log("Message sent:", info.messageId);
        res.json({ message: "Email sent" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
