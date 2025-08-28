/*
  HubSpot CRM helpers
  Requires env: HUBSPOT_PRIVATE_APP_TOKEN
*/

const HUBSPOT_API_BASE = 'https://api.hubapi.com';

function getAuthHeaders() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    throw new Error('HUBSPOT_PRIVATE_APP_TOKEN is not set');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as Record<string, string>;
}

export async function findContactByEmail(email: string) {
  const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            },
          ],
        },
      ],
      limit: 1,
      properties: ['email', 'firstname', 'lastname', 'company', 'phone', 'website'],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot search failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  const result = data?.results?.[0];
  return result ? { id: result.id as string, properties: result.properties as Record<string, any> } : null;
}

export async function upsertContact(params: {
  email: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  phone?: string;
  website?: string;
  jobtitle?: string;
}) {
  const existing = await findContactByEmail(params.email);
  const properties: Record<string, any> = {
    email: params.email,
  };
  if (params.firstname) properties.firstname = params.firstname;
  if (params.lastname) properties.lastname = params.lastname;
  if (params.company) properties.company = params.company;
  if (params.phone) properties.phone = params.phone;
  if (params.website) properties.website = params.website;
  if (params.jobtitle) properties.jobtitle = params.jobtitle;

  if (existing) {
    // Update
    const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existing.id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ properties }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HubSpot update contact failed: ${res.status} ${res.statusText} - ${text}`);
    }
    return existing.id;
  }

  // Create
  const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot create contact failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const data = await res.json();
  return data?.id as string;
}

export async function createNoteForContact(params: {
  contactId: string;
  title: string;
  body: string;
}) {
  // Create note
  const noteRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      properties: {
        hs_note_body: params.body,
        hs_timestamp: new Date().toISOString(),
        note_title: params.title,
      },
    }),
  });
  if (!noteRes.ok) {
    const text = await noteRes.text();
    throw new Error(`HubSpot create note failed: ${noteRes.status} ${noteRes.statusText} - ${text}`);
  }
  const note = await noteRes.json();
  const noteId = note?.id as string;

  // Associate note to contact
  const assocRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/notes/${noteId}/associations/contacts/${params.contactId}/note_to_contact`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!assocRes.ok) {
    const text = await assocRes.text();
    throw new Error(`HubSpot associate note failed: ${assocRes.status} ${assocRes.statusText} - ${text}`);
  }
  return noteId;
}


