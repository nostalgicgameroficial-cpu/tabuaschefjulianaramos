export const initMetaParameterSetup = async () => {
  const domainParts = window.location.hostname.split('.');
  // subdomain index (1 for domain.com, 2 for sub.domain.com, etc)
  const subdomainIndex = domainParts.length > 2 ? 2 : 1; 
  const creationTime = Date.now();

  // 1. Get or create _fbp
  let fbp = getCookie('_fbp');
  if (!fbp) {
    const randomNumber = Math.floor(Math.random() * 2147483648);
    fbp = `fb.${subdomainIndex}.${creationTime}.${randomNumber}`;
    setCookie('_fbp', fbp, 90);
  }

  // 2. Get or create _fbc from fbclid
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  let fbc = getCookie('_fbc');

  if (fbclid) {
    // Only generate new fbc if fbclid is present in the URL
    fbc = `fb.${subdomainIndex}.${creationTime}.${fbclid}`;
    setCookie('_fbc', fbc, 90);
  }

  // 3. Fetch Client IP Address (IPv6 prioritized) and save in cookie
  let clientIp = getCookie('client_ip_address');
  if (!clientIp) {
    try {
      const response = await fetch('https://api64.ipify.org?format=json');
      const data = await response.json();
      clientIp = data.ip;
      setCookie('client_ip_address', clientIp, 90);
    } catch (e) {
      console.warn("Could not fetch client IP", e);
    }
  }

  // 4. Referrer & Event Source
  const referrerUrl = document.referrer || '';
  const eventSourceUrl = window.location.href;

  return {
    fbp,
    fbc,
    client_ip_address: clientIp,
    referrer_url: referrerUrl,
    event_source_url: eventSourceUrl,
    client_user_agent: navigator.userAgent
  };
};

// Hashes a string using SHA-256 (Required for em, ph, fn, ln, etc.)
export async function hashData(string) {
  if (!string) return null;
  const utf8 = new TextEncoder().encode(string.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generates the CAPI Payload as specified in "Auxiliar de carga"
export function generateCapiPayload(eventName, eventId, userData, customData) {
  return {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: {
          client_ip_address: getCookie('client_ip_address'),
          client_user_agent: navigator.userAgent,
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
          ...userData
        },
        custom_data: customData || {},
      }
    ]
  };
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // Setting cookie on the base domain to ensure tracking across subdomains
  const domain = window.location.hostname.includes('.') 
    ? '.' + window.location.hostname.split('.').slice(-2).join('.') 
    : window.location.hostname;
    
  document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
