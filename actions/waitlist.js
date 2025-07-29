"use server"

import nodemailer from "nodemailer"

export async function submitToWaitlist(formData) {
  const email = formData.get("email")
  const userType = formData.get("userType")

  if (!email || !userType) {
    return {
      success: false,
      error: "Email and user type are required",
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    }
  }

  try {
    // Create transporter for sending emails
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASS || "your-app-password",
      },
    })

    // Email content for Victor
    const adminEmailContent = {
      from: process.env.EMAIL_USER || "noreply@dexi.app",
      to: "jattovictor32@gmail.com",
      subject: "New Dexi Waitlist Signup",
      html: `
        <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">New Waitlist Signup</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Someone just joined the Dexi waitlist!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; font-weight: 700;">User Details</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0; color: #374151;"><strong>User Type:</strong> ${userType}</p>
              <p style="margin: 10px 0; color: #374151;"><strong>Signup Date:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 10px 0; color: #374151;"><strong>Source:</strong> Landing Page</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0; font-size: 16px; font-weight: 600;">Next Steps</h3>
              <ul style="color: #6b7280; margin: 10px 0; padding-left: 20px;">
                <li>Add to your email marketing list</li>
                <li>Send welcome email to the user</li>
                <li>Update waitlist counter</li>
                <li>Consider reaching out for feedback</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 14px;">
            <p>This email was sent automatically from the Dexi landing page.</p>
          </div>
        </div>
      `,
    }

    // Welcome email for the user
    const userEmailContent = {
      from: process.env.EMAIL_USER || "noreply@dexi.app",
      to: email,
      subject: "Welcome to the Dexi Waitlist! 🚀",
      html: `
        <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Welcome to Dexi! 🎉</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 16px;">You're now part of our exclusive waitlist</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 22px; font-weight: 700;">What happens next?</h2>
            
            <div style="margin: 30px 0;">
              <div style="display: flex; align-items: flex-start; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #6366f1;">
                <div style="background: #6366f1; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">1</div>
                <div>
                  <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Early Access Invitation</h3>
                  <p style="color: #6b7280; margin: 0; line-height: 1.5;">You'll be among the first to access Dexi when we launch our beta.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #10b981;">
                <div style="background: #10b981; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">2</div>
                <div>
                  <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Exclusive Updates</h3>
                  <p style="color: #6b7280; margin: 0; line-height: 1.5;">Get behind-the-scenes updates on our development progress and new features.</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <div style="background: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">3</div>
                <div>
                  <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Special Perks</h3>
                  <p style="color: #6b7280; margin: 0; line-height: 1.5;">Enjoy exclusive launch bonuses and premium features as an early supporter.</p>
                </div>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <h3 style="color: white; margin: 0 0 10px 0; font-size: 18px; font-weight: 700;">Stay Connected</h3>
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">Follow our journey and connect with other creative professionals</p>
              <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <a href="#" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; font-weight: 600;">Twitter</a>
                <a href="#" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; font-weight: 600;">LinkedIn</a>
                <a href="#" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; font-weight: 600;">Discord</a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">Questions? Reply to this email - we'd love to hear from you!</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 5px 0;">© 2024 Dexi. All rights reserved.</p>
            <p style="margin: 5px 0;">You're receiving this because you signed up for our waitlist.</p>
          </div>
        </div>
      `,
    }

    // Send emails
    await transporter.sendMail(adminEmailContent)
    await transporter.sendMail(userEmailContent)

    return {
      success: true,
      message: "Successfully joined the waitlist!",
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return {
      success: false,
      error: "Failed to process your request. Please try again.",
    }
  }
}
