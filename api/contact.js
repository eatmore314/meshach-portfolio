'use strict';

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  /* CORS headers */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, project, budget, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 16px; margin-bottom: 24px;">New Portfolio Inquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 10px 0; color: #888; width: 140px;">Name</td><td style="padding: 10px 0;"><strong>${name}</strong></td></tr>
        <tr><td style="padding: 10px 0; color: #888;">Email</td><td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding: 10px 0; color: #888;">Project Type</td><td style="padding: 10px 0;">${project || '—'}</td></tr>
        <tr><td style="padding: 10px 0; color: #888;">Budget</td><td style="padding: 10px 0;">${budget || '—'}</td></tr>
      </table>
      <div style="margin-top: 24px; padding: 20px; background: #f9f9f9; border-radius: 4px;">
        <p style="color: #888; font-size: 12px; margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase;">Message</p>
        <p style="white-space: pre-wrap; line-height: 1.7;">${message}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #aaa;">Sent via meshachjacobs.com contact form</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO || 'jacobs.meshachiv@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${project ? project + ' — ' : ''}${name}`,
      html,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err.message);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};
