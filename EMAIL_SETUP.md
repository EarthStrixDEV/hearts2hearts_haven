# Email Setup Instructions

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

## Gmail Setup Steps

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this app password (not your regular Gmail password) in `EMAIL_PASS`

## Email Configuration

The email system is configured to:
- Send emails to: `warapon.jitsook@gmail.com`
- Use a beautiful baby blue themed HTML template
- Include sender information for easy replies
- Provide both HTML and plain text versions

## Features

- ✅ Beautiful baby blue themed email template
- ✅ Responsive design
- ✅ Form validation
- ✅ Loading states
- ✅ Success/error feedback
- ✅ Direct reply functionality
- ✅ Professional email formatting
