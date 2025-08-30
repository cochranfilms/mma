# 🚀 Discovery Call EmailJS Integration Setup Guide

## 📋 **Overview**
This guide will help you set up the complete discovery call email flow for your Marketing Mousetrap Agency website. The system will automatically send confirmation emails to clients and notification emails to your admin team when someone books a discovery call.

## 🔧 **Step 1: EmailJS Template Setup**

### **A. Create Client Confirmation Template**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin/templates)
2. Click "Create New Template"
3. Copy the HTML from `public/emailjs-templates/discovery-call-client.html`
4. Paste it into the EmailJS template editor
5. Save the template and **copy the Template ID**
6. This will be your `CLIENT_TEMPLATE_ID`

### **B. Create Admin Notification Template**
1. Create another new template in EmailJS
2. Copy the HTML from `public/emailjs-templates/discovery-call-admin.html`
3. Paste it into the EmailJS template editor
4. Save the template and **copy the Template ID**
5. This will be your `ADMIN_TEMPLATE_ID`

## 🔑 **Step 2: Update Template IDs in Code**

Once you have your template IDs, update the `CalendarBooking.tsx` component:

```typescript
// In the sendDiscoveryCallEmails function, update these lines:

// Send client confirmation email
const clientResponse = await emailjs.send(
  'service_hers22k', // Your service ID
  'YOUR_CLIENT_TEMPLATE_ID_HERE', // Replace with actual client template ID
  templateParams
);

// Send admin notification email
const adminResponse = await emailjs.send(
  'service_hers22k', // Your service ID
  'YOUR_ADMIN_TEMPLATE_ID_HERE', // Replace with actual admin template ID
  templateParams
);
```

## 📧 **Step 3: Email Template Parameters**

Both templates use these parameters (automatically populated):

### **Client Information:**
- `{{CLIENT_NAME}}` - Lead's full name
- `{{CLIENT_EMAIL}}` - Lead's email address
- `{{CLIENT_PHONE}}` - Lead's phone number
- `{{CLIENT_COMPANY}}` - Lead's company name
- `{{CLIENT_JOBTITLE}}` - Lead's job title
- `{{CLIENT_WEBSITE}}` - Lead's website
- `{{CLIENT_NOTES}}` - Additional notes from the lead

### **Appointment Details:**
- `{{APPOINTMENT_DATE}}` - Scheduled date (or "To be scheduled via follow-up")
- `{{APPOINTMENT_TIME}}` - Scheduled time (or "To be scheduled via follow-up")
- `{{APPOINTMENT_DURATION}}` - Call duration (e.g., "30 minutes")
- `{{SERVICE_TYPE}}` - Service name (e.g., "Free Discovery Call")

### **System Information:**
- `{{CONFIRMATION_DATE}}` - Date when request was submitted
- `{{CONFIRMATION_TIME}}` - Time when request was submitted
- `{{ADMIN_EMAIL}}` - Your admin email address

## 🎯 **Step 4: How It Works**

### **User Flow:**
1. User selects "Free Discovery Call" service
2. User fills out contact form with their information
3. User clicks "Submit Discovery Call Request"
4. System automatically sends:
   - **Client confirmation email** to the user
   - **Admin notification email** to your team
5. Form resets and user sees success message

### **Email Flow:**
- **Client Email:** Professional confirmation with preparation tips and next steps
- **Admin Email:** Lead information, appointment details, and action items for follow-up

## 🚀 **Step 5: Testing**

### **Test the Integration:**
1. Fill out the discovery call form on your website
2. Submit the request
3. Check that both emails are sent:
   - Client receives confirmation email
   - Admin receives notification email
4. Verify all template parameters are populated correctly

### **Troubleshooting:**
- Check browser console for EmailJS errors
- Verify template IDs are correct
- Ensure EmailJS service ID is valid
- Check that all required fields are filled

## 📱 **Step 6: Customization**

### **Modify Email Templates:**
- Edit the HTML files in `public/emailjs-templates/`
- Update colors, branding, and messaging
- Add/remove template parameters as needed
- Test changes in EmailJS dashboard

### **Update Form Fields:**
- Add/remove form fields in `CalendarBooking.tsx`
- Update template parameters accordingly
- Ensure EmailJS integration handles new fields

## 🔒 **Step 7: Security & Best Practices**

### **Environment Variables:**
- Keep EmailJS private keys secure
- Use environment variables for sensitive data
- Never expose private keys in client-side code

### **Rate Limiting:**
- Consider implementing rate limiting for form submissions
- Add CAPTCHA or other anti-spam measures if needed
- Monitor for unusual activity

## 📊 **Step 8: Analytics & Tracking**

### **Track Discovery Call Requests:**
- Monitor EmailJS delivery rates
- Track form completion rates
- Analyze lead quality and conversion rates
- Integrate with your CRM for lead tracking

## 🎉 **You're All Set!**

Your discovery call system is now fully integrated with EmailJS and will:
- ✅ Automatically send client confirmation emails
- ✅ Notify your admin team of new leads
- ✅ Capture comprehensive lead information
- ✅ Provide professional email templates
- ✅ Handle the complete booking flow

## 📞 **Need Help?**

If you encounter any issues:
1. Check the browser console for error messages
2. Verify EmailJS template IDs and service ID
3. Test with a simple email first
4. Check EmailJS dashboard for delivery status

---

**Created by:** Marketing Mousetrap Agency Development Team  
**Last Updated:** Current Date  
**Version:** 1.0
