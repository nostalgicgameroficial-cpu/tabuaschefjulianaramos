import React, { useEffect, useState } from 'react';
import { initMetaParameterSetup, generateCapiPayload, hashData } from './metaParameterSetup';
import HubPage from './HubPage';
import TabuasPage from './TabuasPage';
import CaseirinhosPage from './CaseirinhosPage';
import SobremesasPage from './SobremesasPage';
import MemberApp from './MemberApp';

function App() {
  const [viewMode, setViewMode] = useState('hub'); // 'hub' | 'tabuas90' | 'caseirinhos' | 'sobremesas90' | 'app'
  const [visitorId, setVisitorId] = useState('');
  const [fbclid, setFbclid] = useState('');

  // 1. Navigation Helper that updates URL history smoothly
  const navigateTo = (target) => {
    let mode = 'hub';
    let path = '/';

    if (target.includes('caseirinho')) {
      mode = 'caseirinhos';
      path = '/caseirinhos';
    } else if (target.includes('sobremesas')) {
      mode = 'sobremesas90';
      path = '/sobremesas90';
    } else if (target.includes('tabuas')) {
      mode = 'tabuas90';
      path = '/tabuas90';
    } else if (target.includes('app')) {
      mode = 'app';
      path = '/app';
    }

    const currentSearch = window.location.search;
    window.history.pushState({ mode }, '', path + currentSearch);
    setViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Initial Route Resolution from URL pathname, query or hash
  useEffect(() => {
    const resolveRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      if (
        path.includes('caseirinho') || 
        hash.includes('caseirinho') || 
        params.get('page') === 'caseirinhos' || 
        params.get('p') === 'caseirinhos'
      ) {
        return 'caseirinhos';
      }
      
      if (
        path.includes('sobremesas90') || 
        path.includes('sobremesas') ||
        hash.includes('sobremesas90') || 
        params.get('page') === 'sobremesas90' || 
        params.get('p') === 'sobremesas90'
      ) {
        return 'sobremesas90';
      }

      if (
        path.includes('tabuas90') || 
        path.includes('tabuas') ||
        hash.includes('tabuas90') || 
        params.get('page') === 'tabuas90' || 
        params.get('p') === 'tabuas90'
      ) {
        return 'tabuas90';
      }

      if (params.get('app') === 'true' || params.get('view') === 'app' || hash === '#app' || path.includes('/app')) {
        return 'app';
      }

      // Default root path '/' shows the HubPage
      return 'hub';
    };

    setViewMode(resolveRoute());

    // Listen to popstate for browser Back/Forward navigation
    const handlePopState = () => {
      setViewMode(resolveRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Global Tracking & Meta Pixel Parameter Setup
  useEffect(() => {
    let uid = localStorage.getItem('user_unique_id');
    if (!uid) {
      uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('user_unique_id', uid);
    }
    setVisitorId(uid);

    const params = new URLSearchParams(window.location.search);
    let currentFbclid = params.get('fbclid') || localStorage.getItem('fbclid') || '';
    if (params.get('fbclid')) {
      localStorage.setItem('fbclid', currentFbclid);
    }
    setFbclid(currentFbclid);

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach(p => {
      const val = params.get(p);
      if (val) localStorage.setItem(p, val);
    });

    initMetaParameterSetup().then(async (metaParams) => {
      const hashedUid = await hashData(uid);
      const pageViewEventId = 'evt_' + Date.now() + '_pv';

      if (window.fbq) {
        window.fbq('init', '2501465437244788', {
          external_id: hashedUid,
          client_ip_address: metaParams.client_ip_address,
          client_user_agent: metaParams.client_user_agent,
          fbc: metaParams.fbc,
          fbp: metaParams.fbp
        });
        
        window.fbq('track', 'PageView', {
          external_id: hashedUid,
          action_source: 'website',
          event_source_url: metaParams.event_source_url
        }, { eventID: pageViewEventId });
      }

      const capiPayload = generateCapiPayload('PageView', pageViewEventId, {
        external_id: [hashedUid]
      });
      console.log('CAPI Payload (PageView):', capiPayload);
    });
  }, []);

  // 4. View Mode Routing Render
  if (viewMode === 'caseirinhos') {
    return <CaseirinhosPage onNavigateHome={() => navigateTo('/')} />;
  }

  if (viewMode === 'sobremesas90') {
    return <SobremesasPage onNavigateHome={() => navigateTo('/')} />;
  }

  if (viewMode === 'tabuas90') {
    return <TabuasPage onNavigateHome={() => navigateTo('/')} />;
  }

  if (viewMode === 'app') {
    return <MemberApp onBackToSalesPage={() => navigateTo('/')} />;
  }

  // Root Homepage Hub
  return <HubPage onNavigate={navigateTo} />;
}

export default App;
