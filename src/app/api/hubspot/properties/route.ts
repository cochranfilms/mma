import { NextRequest, NextResponse } from 'next/server';

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

function getAuthHeaders() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) throw new Error('HUBSPOT_PRIVATE_APP_TOKEN is not set');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as Record<string, string>;
}

// Creates quiz-related contact properties if they do not exist
export async function POST(_req: NextRequest) {
  const properties = [
    {
      name: 'quiz_last_completed',
      label: 'Quiz Last Completed',
      type: 'datetime',
      fieldType: 'date',
      groupName: 'contactinformation'
    },
    {
      name: 'quiz_top_matches',
      label: 'Quiz Top Matches',
      type: 'string',
      fieldType: 'text',
      groupName: 'contactinformation'
    },
    {
      name: 'quiz_answers_json',
      label: 'Quiz Answers (JSON)',
      type: 'string',
      fieldType: 'textarea',
      groupName: 'contactinformation'
    },
    { name: 'quiz_goal', label: 'Quiz Goal', type: 'enumeration', fieldType: 'select', groupName: 'contactinformation', options: [
      { label: 'Increase brand awareness and visibility', value: 'brand-awareness' },
      { label: 'Generate more qualified leads', value: 'lead-generation' },
      { label: 'Build strategic partnerships', value: 'partnerships' },
      { label: 'Improve digital presence and conversion', value: 'digital-presence' },
    ] },
    { name: 'quiz_industry', label: 'Quiz Industry', type: 'enumeration', fieldType: 'select', groupName: 'contactinformation', options: [
      { label: 'B2B/Professional Services', value: 'b2b' },
      { label: 'E-commerce/Retail', value: 'ecommerce' },
      { label: 'Events/Experiential', value: 'events' },
      { label: 'Technology/SaaS', value: 'technology' },
    ] },
    { name: 'quiz_budget_timeline', label: 'Quiz Budget/Timeline', type: 'enumeration', fieldType: 'select', groupName: 'contactinformation', options: [
      { label: 'Quick wins with limited budget', value: 'quick-wins' },
      { label: 'Strategic long-term investment', value: 'strategic-investment' },
      { label: 'Event-specific budget', value: 'event-focused' },
      { label: 'Growth-focused with flexible budget', value: 'growth-focused' },
    ] },
    { name: 'quiz_current_challenge', label: 'Quiz Current Challenge', type: 'enumeration', fieldType: 'select', groupName: 'contactinformation', options: [
      { label: 'Lack of visibility in your industry', value: 'visibility' },
      { label: 'Website not converting visitors', value: 'conversion' },
      { label: 'Difficulty building industry relationships', value: 'relationships' },
      { label: 'Inconsistent brand messaging', value: 'brand-consistency' },
    ] },
  ];

  const created: string[] = [];
  const skipped: string[] = [];

  try {
    // Fetch existing properties
    const existingRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/properties/contacts`, {
      headers: getAuthHeaders(),
    });
    if (!existingRes.ok) {
      const text = await existingRes.text();
      throw new Error(`Failed to list properties: ${existingRes.status} ${text}`);
    }
    const existing = await existingRes.json();
    const existingNames = new Set((existing?.results || []).map((p: any) => p.name));

    for (const prop of properties) {
      if (existingNames.has(prop.name)) {
        skipped.push(prop.name);
        continue;
      }
      const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/properties/contacts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(prop),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Create property ${prop.name} failed: ${res.status} ${text}`);
      }
      created.push(prop.name);
    }

    return NextResponse.json({ ok: true, created, skipped });
  } catch (e: any) {
    console.error('Property creation error', e);
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}


