import { sendEmail } from '../../libs/sndEmail';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    try {
      await sendEmail('abdelazizebrahim@gmail.com', subject, text);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}