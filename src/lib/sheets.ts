import { LeadData } from './email';

// Google Sheets utility for lead tracking
export class GoogleSheetsService {
  private spreadsheetId: string;
  private apiKey: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '';
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY || '';
  }

  async addLead(leadData: LeadData): Promise<boolean> {
    if (!this.spreadsheetId || !this.apiKey) {
      console.warn('Google Sheets not configured - skipping lead tracking');
      return false;
    }

    try {
      const timestamp = new Date().toISOString();
      const values = [
        [
          timestamp,
          leadData.company,
          leadData.role,
          leadData.needs.join(', '),
          leadData.timeline,
          leadData.budget,
          leadData.geography,
          leadData.name,
          leadData.email,
          leadData.phone || '',
          leadData.currentSite || '',
          'Website Form',
          'New'
        ]
      ];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Leads!A:M:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
          majorDimension: 'ROWS'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Google Sheets API error:', error);
        return false;
      }

      console.log('Lead successfully added to Google Sheets');
      return true;
    } catch (error) {
      console.error('Error adding lead to Google Sheets:', error);
      return false;
    }
  }

  async getLeads(): Promise<any[]> {
    if (!this.spreadsheetId || !this.apiKey) {
      console.warn('Google Sheets not configured');
      return [];
    }

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Leads!A:M?key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching leads from Google Sheets:', error);
      return [];
    }
  }
}

// Fallback service for development
export class LocalStorageService {
  private storageKey = 'mma_leads';

  async addLead(leadData: LeadData): Promise<boolean> {
    try {
      const leads = await this.getLeads();
      const newLead = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...leadData
      };
      
      leads.push(newLead);
      localStorage.setItem(this.storageKey, JSON.stringify(leads));
      
      console.log('Lead saved to localStorage:', newLead);
      return true;
    } catch (error) {
      console.error('Error saving lead to localStorage:', error);
      return false;
    }
  }

  async getLeads(): Promise<any[]> {
    try {
      const leads = localStorage.getItem(this.storageKey);
      return leads ? JSON.parse(leads) : [];
    } catch (error) {
      console.error('Error reading leads from localStorage:', error);
      return [];
    }
  }
}

// Service factory
export function createLeadTrackingService() {
  if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SHEETS_API_KEY) {
    return new GoogleSheetsService();
  }
  return new LocalStorageService();
}

// Lead tracking function
export async function trackLead(leadData: LeadData): Promise<boolean> {
  const service = createLeadTrackingService();
  return service.addLead(leadData);
}
