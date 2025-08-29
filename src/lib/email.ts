import { z } from 'zod';

// Email schema for validation
export const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
  text: z.string().optional(),
});

export type EmailData = z.infer<typeof emailSchema>;

// Lead data schema
export const leadSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  needs: z.array(z.string()).min(1, 'Please select at least one service need'),
  timeline: z.string().min(1, 'Timeline is required'),
  budget: z.string().min(1, 'Budget range is required'),
  geography: z.string().min(1, 'Geography is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  currentSite: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'Consent is required'),
});

export type LeadData = z.infer<typeof leadSchema>;

// Email service interface
interface EmailService {
  sendEmail(data: EmailData): Promise<boolean>;
}

// Postmark implementation
class PostmarkService implements EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = process.env.POSTMARK_API_KEY || '';
    this.fromEmail = process.env.POSTMARK_FROM_EMAIL || 'sales@marketingmousetrapagency.com';
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Postmark API key not configured');
      return false;
    }

    try {
      const response = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': this.apiKey,
        },
        body: JSON.stringify({
          From: this.fromEmail,
          To: data.to,
          Subject: data.subject,
          HtmlBody: data.html,
          TextBody: data.text || data.html.replace(/<[^>]*>/g, ''),
          MessageStream: 'outbound',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Postmark email failed:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending email via Postmark:', error);
      return false;
    }
  }
}

// Fallback email service (console logging for development)
class ConsoleEmailService implements EmailService {
  async sendEmail(data: EmailData): Promise<boolean> {
    console.log('=== EMAIL WOULD BE SENT ===');
    console.log('To:', data.to);
    console.log('Subject:', data.subject);
    console.log('HTML:', data.html);
    console.log('==========================');
    return true;
  }
}

// Email service factory
export function createEmailService(): EmailService {
  if (process.env.POSTMARK_API_KEY) {
    return new PostmarkService();
  }
  return new ConsoleEmailService();
}

// Lead notification email
export async function sendLeadNotification(leadData: LeadData): Promise<boolean> {
  const emailService = createEmailService();
  
  const html = `
    <h2>New Lead from MMA Website</h2>
    <h3>Company Information</h3>
    <p><strong>Company:</strong> ${leadData.company}</p>
    <p><strong>Role:</strong> ${leadData.role}</p>
    
    <h3>Service Needs</h3>
    <ul>
      ${leadData.needs.map(need => `<li>${need}</li>`).join('')}
    </ul>
    
    <h3>Project Details</h3>
    <p><strong>Timeline:</strong> ${leadData.timeline}</p>
    <p><strong>Budget:</strong> ${leadData.budget}</p>
    <p><strong>Geography:</strong> ${leadData.geography}</p>
    
    <h3>Contact Information</h3>
    <p><strong>Name:</strong> ${leadData.name}</p>
    <p><strong>Email:</strong> ${leadData.email}</p>
    ${leadData.phone ? `<p><strong>Phone:</strong> ${leadData.phone}</p>` : ''}
    ${leadData.currentSite ? `<p><strong>Current Site:</strong> ${leadData.currentSite}</p>` : ''}
    
    <p><em>This lead was submitted through the MMA website contact form.</em></p>
  `;

  const emailData: EmailData = {
    to: process.env.SALES_EMAIL || 'sales@marketingmousetrapagency.com',
    subject: `New Lead: ${leadData.company} - ${leadData.name}`,
    html,
  };

  return emailService.sendEmail(emailData);
}

// Confirmation email to lead
export async function sendLeadConfirmation(leadData: LeadData): Promise<boolean> {
  const emailService = createEmailService();
  
  const html = `
    <h2>Thank you for contacting Marketing Mousetrap Agency!</h2>
    <p>Hi ${leadData.name},</p>
    
    <p>We've received your inquiry and are excited to learn more about how we can help ${leadData.company} upgrade your media presence and connections.</p>
    
    <p><strong>What happens next?</strong></p>
    <ol>
      <li>Our team will review your needs within 24 hours</li>
      <li>We'll schedule a consultation call to discuss your goals</li>
      <li>You'll receive a customized proposal tailored to your specific needs</li>
    </ol>
    
    <p>In the meantime, you can:</p>
    <ul>
      <li>Schedule a call directly: <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL || '#'}">Book Consultation</a></li>
      <li>Explore our case studies: <a href="${process.env.NEXT_PUBLIC_SITE_URL || '#'}/work">View Our Work</a></li>
      <li>Learn more about our services: <a href="${process.env.NEXT_PUBLIC_SITE_URL || '#'}/services">Our Services</a></li>
    </ul>
    
    <p>If you have any immediate questions, feel free to reply to this email or call us directly.</p>
    
    <p>Best regards,<br>
    The MMA Team</p>
  `;

  const emailData: EmailData = {
    to: leadData.email,
    subject: 'Thank you for contacting MMA - Next Steps',
    html,
  };

  return emailService.sendEmail(emailData);
}
