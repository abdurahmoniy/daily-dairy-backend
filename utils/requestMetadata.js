function firstHeaderValue(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function getRequestIpAddress(req) {
  const forwardedFor = firstHeaderValue(req.headers?.['x-forwarded-for']);
  const forwardedIp = forwardedFor?.split(',')[0]?.trim();
  return req.ip || forwardedIp || 'unknown';
}

module.exports = { getRequestIpAddress };
