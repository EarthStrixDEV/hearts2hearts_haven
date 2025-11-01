import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const to = formData.get('to') as string;
    const from = formData.get('from') as string;
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const image = formData.get('image') as File | null;
    const youtubeUrl = formData.get('youtubeUrl') as string;

    // Validate required fields
    if (!to || !from || !name || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'Email credentials are not set' },
        { status: 500 }
      );
    }

    // Create transporter (using Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Process image attachment
    let imageAttachment = null;
    let imageBase64 = '';
    if (image && image.size > 0) {
      const imageBuffer = await image.arrayBuffer();
      imageBase64 = Buffer.from(imageBuffer).toString('base64');
      imageAttachment = {
        filename: image.name,
        content: Buffer.from(imageBuffer),
        contentType: image.type,
        cid: 'submitted-image'
      };
    }

    // Extract YouTube video ID from URL
    let youtubeEmbedHtml = '';
    if (youtubeUrl) {
      const youtubeId = extractYouTubeId(youtubeUrl);
      if (youtubeId) {
        youtubeEmbedHtml = `
          <div class="field">
            <div class="field-label">🎥 YouTube Video</div>
            <div class="youtube-container">
              <iframe 
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/${youtubeId}" 
                frameborder="0" 
                allowfullscreen
                style="border-radius: 10px; max-width: 100%;">
              </iframe>
              <p style="margin-top: 10px; font-size: 14px; color: #666;">
                <a href="${youtubeUrl}" target="_blank" style="color: #1976d2;">Watch on YouTube</a>
              </p>
            </div>
          </div>
        `;
      }
    }

    // Beautiful HTML email template with baby blue theme
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message from H2H Website</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #81d4fa 0%, #4fc3f7 100%);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .message-box {
            background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
            border: 2px solid #81d4fa;
            border-radius: 15px;
            padding: 25px;
            margin: 20px 0;
          }
          .field {
            margin-bottom: 20px;
          }
          .field-label {
            font-weight: bold;
            color: #1976d2;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .field-value {
            background: white;
            padding: 12px 15px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            font-size: 16px;
            word-wrap: break-word;
          }
          .message-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #4fc3f7;
            font-size: 16px;
            line-height: 1.7;
            white-space: pre-wrap;
          }
          .image-container {
            text-align: center;
            margin: 20px 0;
          }
          .image-container img {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .youtube-container {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
          }
          .footer {
            background: #f5f5f5;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .heart {
            color: #e91e63;
            font-size: 18px;
          }
          .emoji {
            font-size: 20px;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><span class="emoji">💌</span> New Message from H2H Website</h1>
            <p>Someone reached out through the Hearts2Hearts fan site!</p>
          </div>
          
          <div class="content">
            <div class="message-box">
              <div class="field">
                <div class="field-label">👤 From</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">📧 Email</div>
                <div class="field-value">${to}</div>
              </div>
              
              <div class="field">
                <div class="field-label">📝 Subject</div>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="field-label">💬 Message</div>
                <div class="message-content">${message}</div>
              </div>
              
              ${imageBase64 ? `
                <div class="field">
                  <div class="field-label">📸 Attached Image</div>
                  <div class="image-container">
                    <img src="data:${image?.type || 'image/jpeg'};base64,${imageBase64}" alt="Submitted image" />
                  </div>
                </div>
              ` : ''}
              
              ${youtubeEmbedHtml}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-style: italic;">
                <span class="heart">💕</span> 
                This message was sent from the Hearts2Hearts fan website 
                <span class="heart">💕</span>
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>
              <strong>Hearts2Hearts Fan Website</strong><br>
              Powered by S2U love <span class="heart">💙</span>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    let textTemplate = `
New Message from H2H Website
============================

From: ${name}
Email: ${from}
Subject: ${subject}

Message:
${message}`;

    if (image && image.size > 0) {
      textTemplate += `\n\nAttached Image: ${image.name}`;
    }

    if (youtubeUrl) {
      textTemplate += `\n\nYouTube Video: ${youtubeUrl}`;
    }

    textTemplate += `\n\n---
This message was sent from the Hearts2Hearts fan website
Powered by S2U love 💙`;

    // Email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"H2H Fan Website" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `💌 New Message from H2H Website: ${subject}`,
      text: textTemplate,
      html: htmlTemplate,
      replyTo: from, // Allow direct reply to sender
    };

    // Add image attachment if present
    if (imageAttachment) {
      mailOptions.attachments = [imageAttachment];
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
