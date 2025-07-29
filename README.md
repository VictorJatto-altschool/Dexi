# Dexi Landing Page

A modern, responsive landing page for Dexi - the social and freelance platform for creative professionals.

## Features

- **Responsive Design**: Optimized for all devices
- **Waitlist Functionality**: Email collection with automated notifications
- **Co-founder CTA**: Integrated application process
- **Dark/Light Mode**: Theme toggle support
- **Smooth Animations**: Scroll-triggered animations and interactions
- **Email Integration**: Automated email notifications using Nodemailer

## Waitlist Setup

### Email Configuration

1. **Gmail Setup** (Recommended):
   - Enable 2-factor authentication on your Gmail account
   - Generate an app-specific password
   - Update `.env.local` with your credentials

2. **Environment Variables**:
   \`\`\`
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   \`\`\`

3. **Alternative Email Services**:
   - SendGrid
   - Mailgun
   - AWS SES
   - Resend

### Features

- **Dual Email System**: Sends notifications to both admin and user
- **Professional Templates**: HTML email templates with Montserrat font
- **Error Handling**: Comprehensive error handling and user feedback
- **Privacy Compliant**: Secure data handling and validation
- **Analytics Ready**: Built-in tracking for conversion optimization

## Font Implementation

The entire landing page uses **Montserrat** font family with the following weights:
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (Semi-bold)
- 700 (Bold)
- 800 (Extra-bold)
- 900 (Black)

## Email Templates

### Admin Notification Email
- Clean, professional design
- User details and signup information
- Recommended next steps
- Branded with Dexi colors

### User Welcome Email
- Engaging welcome message
- Clear next steps explanation
- Social media integration
- Professional branding

## Security Features

- Email validation
- Rate limiting
- Input sanitization
- CSRF protection ready
- Privacy-compliant data handling

## Deployment

1. **Environment Setup**:
   - Copy `.env.local.example` to `.env.local`
   - Configure email credentials
   - Set up domain and SMTP settings

2. **Email Service Integration**:
   - For production, consider using dedicated email services
   - Configure SPF, DKIM, and DMARC records
   - Set up email templates in your service provider

3. **Analytics**:
   - Google Analytics integration ready
   - Conversion tracking implemented
   - A/B testing framework included

## Support

For questions about the waitlist functionality or email setup, please refer to the documentation or contact the development team.
