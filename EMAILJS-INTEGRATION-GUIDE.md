# 🚀 EmailJS Integration Guide - Website Domination Analyzer

## 📋 **Setup Steps:**

### **1. Environment Variables**
Add these to your `.env.local` file:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# EmailJS Configuration (Public Key - safe to expose)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
```

### **2. EmailJS Template Setup**

#### **Step A: Create Client Template**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/admin/templates)
2. Click "Create New Template"
3. Copy the HTML from `public/emailjs-templates/client-analysis-template.html`
4. Paste it into the EmailJS template editor
5. Save the template and **copy the Template ID**
6. This will be your `CLIENT_TEMPLATE_ID`

#### **Step B: Create Admin Template**
1. Create another new template in EmailJS
2. Copy the HTML from `public/emailjs-templates/admin-analysis-template.html`
3. Paste it into the EmailJS template editor
4. Save the template and **copy the Template ID**
5. This will be your `ADMIN_TEMPLATE_ID`

### **3. Update Component with Template IDs** ✅ COMPLETED
Template IDs have been integrated into `src/components/WebsiteDominationAnalyzer.tsx`:
```javascript
// Line 258: Client template ID integrated
'template_4hroedw', // Client template ID

// Line 265: Admin template ID integrated
'template_rlhix8p', // Admin template ID
```

### **4. EmailJS Service Configuration**
Your service ID is already configured: `service_hers22k`

## 📧 **Email Template Parameters**

Both templates use these parameters (all automatically populated):

### **User Information:**
- `{{USER_EMAIL}}` - Lead's email address
- `{{WEBSITE_URL}}` - Website that was analyzed
- `{{ANALYSIS_DATE}}` - Date of analysis
- `{{ANALYSIS_TIME}}` - Time of analysis

### **Scores:**
- `{{OVERALL_SCORE}}` - Overall website score (0-100)
- `{{SCORE_STATUS}}` - Status text (CRITICALLY VULNERABLE, etc.)
- `{{SEO_SCORE}}` - SEO performance score
- `{{DESIGN_SCORE}}` - Design quality score
- `{{CONVERSION_SCORE}}` - Conversion optimization score

### **Issues & Opportunities:**
- `{{CRITICAL_ISSUE_1}}` through `{{CRITICAL_ISSUE_5}}` - Critical problems found
- `{{OPPORTUNITY_1}}` through `{{OPPORTUNITY_5}}` - Improvement opportunities

### **Detailed Analysis:**
- `{{SEO_ISSUE_1}}`, `{{SEO_ISSUE_2}}`, `{{SEO_ISSUE_3}}` - SEO problems
- `{{SEO_REC_1}}`, `{{SEO_REC_2}}` - SEO recommendations
- `{{DESIGN_ISSUE_1}}`, `{{DESIGN_ISSUE_2}}`, `{{DESIGN_ISSUE_3}}` - Design problems
- `{{DESIGN_REC_1}}`, `{{DESIGN_REC_2}}` - Design recommendations
- `{{CONV_ISSUE_1}}`, `{{CONV_ISSUE_2}}`, `{{CONV_ISSUE_3}}` - Conversion problems
- `{{CONV_REC_1}}`, `{{CONV_REC_2}}` - Conversion recommendations

### **Service Recommendations:**
- `{{SERVICE_1_TITLE}}`, `{{SERVICE_1_DESC}}`, `{{SERVICE_1_IMPACT}}`, `{{SERVICE_1_PRICE}}`
- `{{SERVICE_2_TITLE}}`, `{{SERVICE_2_DESC}}`, `{{SERVICE_2_IMPACT}}`, `{{SERVICE_2_PRICE}}`
- `{{SERVICE_3_TITLE}}`, `{{SERVICE_3_DESC}}`, `{{SERVICE_3_IMPACT}}`, `{{SERVICE_3_PRICE}}`

### **Admin Only:**
- `{{ADMIN_EMAIL}}` - Your admin email address

## 🗂️ **Local JSON Storage**

### **File Location:**
`src/data/leads.json`

### **Data Structure:**
```json
{
  "leads": [
    {
      "id": "1640995200000",
      "email": "client@example.com",
      "website": "https://example.com",
      "analysisScore": 34,
      "analysisData": {
        "overallScore": 34,
        "criticalIssues": [...],
        "opportunities": [...],
        "seoAnalysis": {...},
        "designAnalysis": {...},
        "conversionAnalysis": {...}
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "source": "website-analyzer"
    }
  ],
  "lastUpdated": "2024-01-01T12:00:00.000Z",
  "totalAnalyses": 1
}
```

## 🔄 **GitHub Auto-Upload**

The system automatically:
1. Saves lead data to `src/data/leads.json`
2. Commits the file to Git
3. Pushes to GitHub with message: "Auto-update: New website analysis lead - [timestamp]"

**Note:** Ensure your deployment environment has Git configured and push permissions.

## 🎯 **Email Flow:**

1. **User submits website** for analysis
2. **AI analyzes** website and generates report
3. **Lead data saved** to local JSON file
4. **GitHub auto-upload** commits and pushes data
5. **Client email sent** with detailed analysis report
6. **Admin email sent** with lead information and sales strategy
7. **User sees results** on website interface

## 📱 **Template Features:**

### **Client Email:**
- Professional design with your brand colors
- Interactive score displays
- Detailed vulnerability breakdown
- Service recommendations with pricing
- Urgency messaging
- Clear call-to-action buttons

### **Admin Email:**
- Lead priority assessment
- Revenue potential calculation
- Sales strategy recommendations
- Contact information
- Action items and follow-up guidance

## 🚨 **Important Notes:**

1. **Template IDs:** You MUST replace the placeholder template IDs with your actual EmailJS template IDs
2. **Public Key:** Add your EmailJS public key to environment variables
3. **Admin Email:** Update the admin email address in the component
4. **Git Permissions:** Ensure your server can commit and push to GitHub
5. **Rate Limiting:** Consider implementing rate limiting to prevent abuse

## ✅ **Testing:**

1. Test with a real website URL
2. Check that both emails are received
3. Verify lead data is saved to JSON file
4. Confirm GitHub auto-upload works
5. Test all template parameters populate correctly

## 🎉 **Ready to Launch!**

Once you've:
- ✅ Added your EmailJS public key to `.env.local`
- ✅ Created both email templates in EmailJS
- ✅ Updated the component with your template IDs
- ✅ Configured your admin email address

Your Website Domination Analyzer will be fully operational and ready to generate high-quality leads automatically! 🚀💥
