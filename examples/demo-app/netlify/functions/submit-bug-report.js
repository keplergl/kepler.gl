// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Netlify serverless function – proxies bug reports to a Slack webhook.
// Required environment variable: SLACK_BUG_WEBHOOK_URL
//
// Rate-limiting: max 5 submissions per IP per 10 minutes (in-memory,
// resets on cold start – intentionally lightweight; primary guard is the
// client-side localStorage cooldown).

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

// In-memory store: { [ip]: { count, windowStart } }
const ipStore = {};

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipStore[ip];
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipStore[ip] = {count: 1, windowStart: now};
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count += 1;
  return false;
}

function buildSlackBlocks({title, description, steps, expected, browserInfo}) {
  const fields = [
    {
      type: 'mrkdwn',
      text: `*Browser:*\n${browserInfo.browser || 'Unknown'}`
    },
    {
      type: 'mrkdwn',
      text: `*OS:*\n${browserInfo.os || 'Unknown'}`
    },
    {
      type: 'mrkdwn',
      text: `*Resolution:*\n${browserInfo.resolution || 'Unknown'}`
    },
    {
      type: 'mrkdwn',
      text: `*kepler.gl version:*\n${browserInfo.keplerVersion || 'Unknown'}`
    }
  ];

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `🐛 Bug Report: ${title}`,
        emoji: true
      }
    },
    {
      type: 'section',
      fields
    }
  ];

  if (browserInfo.url) {
    blocks.push({
      type: 'section',
      text: {type: 'mrkdwn', text: `*URL:*\n${browserInfo.url}`}
    });
  }

  if (description) {
    blocks.push(
      {type: 'divider'},
      {
        type: 'section',
        text: {type: 'mrkdwn', text: `*What happened:*\n${description}`}
      }
    );
  }

  if (steps) {
    blocks.push({
      type: 'section',
      text: {type: 'mrkdwn', text: `*Steps to reproduce:*\n${steps}`}
    });
  }

  if (expected) {
    blocks.push({
      type: 'section',
      text: {type: 'mrkdwn', text: `*Expected behavior:*\n${expected}`}
    });
  }

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Submitted at <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} {time}|${new Date().toISOString()}>`
      }
    ]
  });

  return blocks;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {statusCode: 405, body: 'Method Not Allowed'};
  }

  const webhookUrl = process.env.SLACK_BUG_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_BUG_WEBHOOK_URL env var is not set');
    return {statusCode: 500, body: JSON.stringify({error: 'Server configuration error'})};
  }

  // Rate limiting by IP
  const ip =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    'unknown';

  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({error: 'Too many requests. Please wait before submitting again.'})
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({error: 'Invalid JSON body'})
    };
  }

  const {title, description, steps, expected, browserInfo = {}} = body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return {
      statusCode: 400,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({error: 'Title is required'})
    };
  }

  if (title.length > 200) {
    return {
      statusCode: 400,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({error: 'Title is too long (max 200 characters)'})
    };
  }

  const blocks = buildSlackBlocks({
    title: title.trim(),
    description: description?.trim(),
    steps: steps?.trim(),
    expected: expected?.trim(),
    browserInfo
  });

  const slackPayload = JSON.stringify({blocks});

  const https = require('https');
  const url = new URL(webhookUrl);

  const response = await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(slackPayload)}
      },
      res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve({status: res.statusCode, body: data}));
      }
    );
    req.on('error', reject);
    req.write(slackPayload);
    req.end();
  });

  if (response.status !== 200 || response.body !== 'ok') {
    console.error('Slack webhook error:', response.status, response.body);
    return {
      statusCode: 502,
      headers: {'Access-Control-Allow-Origin': '*'},
      body: JSON.stringify({error: 'Failed to send report. Please try again.'})
    };
  }

  return {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify({ok: true})
  };
};
