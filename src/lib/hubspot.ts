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
        // HubSpot Notes don't support a separate title property in v3; prefix into body
        hs_note_body: params.title ? `${params.title}\n\n${params.body}` : params.body,
        hs_timestamp: new Date().toISOString(),
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

// Lists helpers (Contacts Lists API v1)
export async function ensureStaticList(listName: string): Promise<number> {
  // Try to find list by name (paginate)
  let offset = 0;
  const count = 250;
  while (true) {
    const res = await fetch(`${HUBSPOT_API_BASE}/contacts/v1/lists?count=${count}&offset=${offset}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HubSpot lists fetch failed: ${res.status} ${res.statusText} - ${text}`);
    }
    const data = await res.json();
    const lists: Array<{ listId: number; name: string }> = data?.lists || [];
    const found = lists.find((l) => l.name === listName);
    if (found) return found.listId;
    if (!data?.hasMore) break;
    offset = data?.offset || 0;
    if (!offset) break;
  }

  // Create list
  const createRes = await fetch(`${HUBSPOT_API_BASE}/contacts/v1/lists`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: listName, dynamic: false }),
  });
  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`HubSpot create list failed: ${createRes.status} ${createRes.statusText} - ${text}`);
  }
  const created = await createRes.json();
  return created?.listId as number;
}

export async function addEmailToList(listId: number, email: string) {
  const res = await fetch(`${HUBSPOT_API_BASE}/contacts/v1/lists/${listId}/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ emails: [email] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot add to list failed: ${res.status} ${res.statusText} - ${text}`);
  }
}

// Deals (CRM) – create basic deal and associate to contact
export async function createDeal(params: {
  dealname: string;
  amount?: number; // in currency units (e.g., dollars)
  pipeline?: string; // default pipeline
  dealstage?: string; // e.g., 'closedwon'
  closeDate?: string; // ISO
  currency?: string;
  contactId?: string; // associate if provided
}) {
  const properties: Record<string, any> = {
    dealname: params.dealname,
  };
  if (params.amount !== undefined) properties.amount = params.amount;
  if (params.pipeline) properties.pipeline = params.pipeline;
  if (params.dealstage) properties.dealstage = params.dealstage;
  if (params.closeDate) properties.closedate = params.closeDate;
  if (params.currency) properties.hs_currency = params.currency.toUpperCase();

  // Create deal
  const dealRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/deals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ properties }),
  });
  if (!dealRes.ok) {
    const text = await dealRes.text();
    throw new Error(`HubSpot create deal failed: ${dealRes.status} ${dealRes.statusText} - ${text}`);
  }
  const deal = await dealRes.json();
  const dealId = deal?.id as string;

  // Associate to contact if provided
  if (params.contactId) {
    const assocRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/deals/${dealId}/associations/contacts/${params.contactId}/deal_to_contact`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!assocRes.ok) {
      const text = await assocRes.text();
      throw new Error(`HubSpot associate deal failed: ${assocRes.status} ${assocRes.statusText} - ${text}`);
    }
  }

  return dealId;
}


// Fetch associated deals for a contact (minimal properties)
export async function getDealsForContact(contactId: string) {
  // 1) Get association IDs
  const assocRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}/associations/deals`, {
    headers: getAuthHeaders(),
  });
  if (!assocRes.ok) {
    const text = await assocRes.text();
    throw new Error(`HubSpot fetch contact->deals association failed: ${assocRes.status} ${assocRes.statusText} - ${text}`);
  }
  const assocData = await assocRes.json();
  const dealIds: string[] = (assocData?.results || []).map((r: any) => r.to?.id).filter(Boolean);
  if (dealIds.length === 0) return [] as Array<Record<string, any>>;

  // 2) Fetch each deal (could be optimized via batch read)
  const properties = ['dealname','amount','dealstage','pipeline','hs_currency','closedate'];
  const results: Array<Record<string, any>> = [];
  for (const id of dealIds) {
    const dealRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/deals/${id}?properties=${properties.join(',')}`, {
      headers: getAuthHeaders(),
    });
    if (!dealRes.ok) continue;
    const deal = await dealRes.json();
    results.push({ id: deal?.id, ...(deal?.properties || {}) });
  }
  return results;
}

// Fetch associated notes for a contact (minimal properties)
export async function getNotesForContact(contactId: string) {
  const assocRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${contactId}/associations/notes`, {
    headers: getAuthHeaders(),
  });
  if (!assocRes.ok) {
    const text = await assocRes.text();
    throw new Error(`HubSpot fetch contact->notes association failed: ${assocRes.status} ${assocRes.statusText} - ${text}`);
  }
  const assocData = await assocRes.json();
  const noteIds: string[] = (assocData?.results || []).map((r: any) => r.to?.id).filter(Boolean);
  if (noteIds.length === 0) return [] as Array<Record<string, any>>;

  const properties = ['note_title','hs_note_body','hs_timestamp'];
  const notes: Array<Record<string, any>> = [];
  for (const id of noteIds) {
    const noteRes = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/notes/${id}?properties=${properties.join(',')}`, {
      headers: getAuthHeaders(),
    });
    if (!noteRes.ok) continue;
    const note = await noteRes.json();
    notes.push({ id: note?.id, ...(note?.properties || {}) });
  }
  return notes;
}


