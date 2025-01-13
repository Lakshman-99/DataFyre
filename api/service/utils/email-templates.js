import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables from .env file
dotenv.config();

// Setup email transporter using your email provider's settings
const transporter = nodemailer.createTransport({
    service: "Gmail", // Use the email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Verification Error:", error);
    } else {
        console.log("SMTP connection successful.");
    }
});

const origin = process.env.ORIGIN;

// Function to send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
    const verificationLink = `${origin}/verify/email?token=${verificationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Please verify your email address",
        html: `<html> <head> <style> body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 20px; } .container { background-color: #fff;
            padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; } .header { font-size: 24px; font-weight: bold; 
            color: #007bff; margin-bottom: 20px; } .content { font-size: 16px; line-height: 1.6; margin-bottom: 20px; } .button { display: inline-block; 
            background-color: #007bff; color: white !important; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 4px; margin-top: 20px; 
            transition: background-color 0.3s; } .button:hover { background-color: #0056b3; } </style> </head> <body> <div class="container"> <div class="header">
            Welcome to Our Service!</div> <div class="content"> <p>Hi there,</p> <p>Thank you for signing up! To complete your registration and verify your email address, 
            please click the button below:</p> <a href="${verificationLink}" class="button">Verify Your Email</a> <p>If you didn’t sign up for an account, you can ignore 
            this email.</p> </div> <footer style="font-size: 14px; color: #777;"> <p>&copy;${new Date().getFullYear()} DataFyre Corporation. All rights reserved.</p> </footer> 
            </div> </body> </html>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send verification email');
    }
};

export const sendInvitationEmail = async (email, applicationName, createdBy, verificationToken) => {
    const invitationLink = `${origin}/api/v1/verifications/invite-accept?token=${verificationToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `You’ve been invited to collaborate on ${applicationName}`,
        html: `<html> <head> <style> body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 20px; } .container { background-color: #fff; 
        padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; } .header { font-size: 24px; font-weight: bold; 
        color: #007bff; margin-bottom: 20px; } .content { font-size: 16px; line-height: 1.6; margin-bottom: 20px; } .button { display: inline-block; background-color: #007bff; 
        color: white !important; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 4px; margin-top: 20px; transition: background-color 0.3s; } 
        .button:hover { background-color: #0056b3; } </style> </head> <body> <div class="container"> <div class="header">You’ve been invited to collaborate on ${applicationName}
        </div> <div class="content"> <p>Hi there,</p> <p>You’ve been invited to join the application <strong>${applicationName}</strong> by ${createdBy}.</p> <p>To accept 
        the invitation and join the collaboration, please click the button below:</p> <a href="${invitationLink}" class="button">Accept Invitation</a> <p>If you didn’t expect 
        this invitation, you can ignore this email.</p> </div> <footer style="font-size: 14px; color: #777;"> <p>&copy;${new Date().getFullYear()} DataFyre Corporation. 
        All rights reserved.</p> </footer> </div> </body> </html>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send invitation email');
    }
};

export const sendTaskCompletionEmail = async (email, data) => {
    const dashboardLink = `${process.env.ORIGIN}/dashboard`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Task Completion Summary`,
        html: `<html> <head> <style> body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 20px; } .container { background-color: #fff; 
        padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto; } .header { font-size: 24px; font-weight: bold; 
        color: #007bff; margin-bottom: 20px; } .content { font-size: 16px; line-height: 1.6; margin-bottom: 20px; } .button { display: inline-block; background-color: #007bff; 
        color: white !important; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 4px; margin-top: 20px; transition: background-color 0.3s; } 
        .button:hover { background-color: #0056b3; } .summary-table { width: 100%; border-collapse: collapse; margin-top: 20px; } .summary-table th, .summary-table td 
        { border: 1px solid #ddd; padding: 8px; text-align: left; } .summary-table th { background-color: #f2f2f2; font-weight: bold; } </style> </head> <body> 
        <div class="container"> <div class="header">Task Completion Summary</div> <div class="content"> <p>Hi there,</p> <p>Your task execution has completed. Here is 
        the summary of the task:</p> <table class="summary-table"> <tr> <th>Status</th> <td>${data.status}</td> </tr> <tr> <th>Success Count</th> <td>${data.success_count}
        </td> </tr> <tr> <th>Failure Count</th> <td>${data.failure_count}</td> </tr> <tr> <th>Execution Time</th> <td>${Math.round(data.execution_time / 1000)} seconds
        </td> </tr> <tr> <th>Failure Responses</th> <td><pre style="white-space: pre-wrap;">${data.failure_responses}</pre></td> </tr> </table> <p>To view more details, 
        you can go to your dashboard:</p> <a href="${dashboardLink}" class="button">Go to Dashboard</a> </div> <footer style="font-size: 14px; color: #777;"> 
        <p>&copy;${new Date().getFullYear()} DataFyre Corporation. All rights reserved.</p> </footer> </div> </body> </html>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Failed to send task completion email");
    }
};
