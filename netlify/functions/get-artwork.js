const baseId = process.env.AIRTABLE_BASE_ID || 'appgc0qthpwkgKRNW';
const tableName = process.env.AIRTABLE_TABLE_NAME || 'Content queue';
const airtableToken = process.env.AIRTABLE_PAT;

const buildResponse = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return buildResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'GET') {
    return buildResponse(405, { error: 'Method not allowed' });
  }

  if (!airtableToken) {
    return buildResponse(500, {
      error: 'Missing AIRTABLE_PAT environment variable. Add it in Netlify site settings.',
    });
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return buildResponse(response.status || 500, {
        error: data?.error || 'Airtable request failed',
      });
    }

    const records = Array.isArray(data.records)
      ? data.records.map((record) => {
          const fields = record.fields || {};
          const coverArt = Array.isArray(fields['Cover Art']) ? fields['Cover Art'][0] : null;

          return {
            id: record.id,
            title: fields.Title || 'Untitled',
            description: fields.Description || 'No description provided yet.',
            year: fields['Release Date'] ? new Date(fields['Release Date']).getFullYear() : '2026',
            medium: fields.Medium || fields.Status || 'Mixed Media',
            category: fields.Category || fields['Content Type'] || 'abstract',
            image: coverArt?.url || fields['Image URL'] || 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
          };
        })
      : [];

    return buildResponse(200, { records });
  } catch (error) {
    return buildResponse(500, {
      error: 'Failed to fetch Airtable data',
      details: error.message,
    });
  }
};
