import React, { useEffect, useState } from 'react';
import { initMetaParameterSetup, generateCapiPayload, hashData } from './metaParameterSetup';

function App() {
  const [showFab, setShowFab] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [fbclid, setFbclid] = useState('');

  // 1. Scroll Handler for FAB
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (hero) {
        setShowFab(window.scrollY > hero.offsetHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Facebook Pixel & Visitor ID Tracking & Link Decorator
  useEffect(() => {
    // Unique Visitor ID
    let uid = localStorage.getItem('user_unique_id');
    if (!uid) {
      uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('user_unique_id', uid);
    }
    setVisitorId(uid);

    // Query parameters (fbclid, utms)
    const params = new URLSearchParams(window.location.search);
    let currentFbclid = params.get('fbclid') || localStorage.getItem('fbclid') || '';
    if (params.get('fbclid')) {
      localStorage.setItem('fbclid', currentFbclid);
    }
    setFbclid(currentFbclid);

    // Store UTMs
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach(p => {
      const val = params.get(p);
      if (val) {
        localStorage.setItem(p, val);
      }
    });

    // Inicializa o Meta Parameter Setup para capturar/gerar cookies fbc, fbp e client_ip_address
    initMetaParameterSetup().then(async (metaParams) => {
      console.log('Meta Parameters Configured:', metaParams);
      
      // Hashing external_id as recommended by 'Parâmetros.txt'
      const hashedUid = await hashData(uid);
      
      const pageViewEventId = 'evt_' + Date.now() + '_pv';

      // Advanced Matching Initialization (Client-side Pixel)
      if (window.fbq) {
        window.fbq('init', '2501465437244788', {
          external_id: hashedUid,
          client_ip_address: metaParams.client_ip_address,
          client_user_agent: metaParams.client_user_agent,
          fbc: metaParams.fbc,
          fbp: metaParams.fbp
        });
        
        // Track PageView with Deduplication eventID
        window.fbq('track', 'PageView', {
          external_id: hashedUid,
          action_source: 'website',
          event_source_url: metaParams.event_source_url
        }, { eventID: pageViewEventId });
      }

      // Generate the CAPI Payload ("Auxiliar de carga") for Server-Side Use
      const capiPayload = generateCapiPayload('PageView', pageViewEventId, {
        external_id: [hashedUid]
      });
      console.log('CAPI Payload (PageView):', JSON.stringify(capiPayload, null, 2));
    });

    // Auto-decorate all anchor links on the page that point to checkouts or external URLs
    const decorateLinks = () => {
      document.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && (href.startsWith('http') || href.includes('checkout') || href.includes('pay') || href.includes('lastlink') || href.includes('kiwify') || href.includes('hotmart'))) {
          try {
            const u = new URL(href, window.location.origin);
            if (uid) {
              u.searchParams.set('id', uid);
              u.searchParams.set('external_id', uid);
              u.searchParams.set('user_id', uid);
              u.searchParams.set('lead_id', uid);
            }
            if (currentFbclid) {
              u.searchParams.set('fbclid', currentFbclid);
              u.searchParams.set('src', currentFbclid);
              u.searchParams.set('sck', currentFbclid);
            }
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(p => {
              const storedVal = localStorage.getItem(p);
              if (storedVal && !u.searchParams.has(p)) u.searchParams.set(p, storedVal);
            });
            a.setAttribute('href', u.toString());
          } catch (e) {}
        }
      });
    };

    decorateLinks();
    const interval = setInterval(decorateLinks, 2000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to handle checkout clicks & Meta Pixel InitiateCheckout event
  const handleCheckoutClick = async (e, baseUrl, planName, price) => {
    if (e && e.preventDefault) e.preventDefault();
    let uid = localStorage.getItem('user_unique_id') || visitorId;
    let currentFbclid = localStorage.getItem('fbclid') || fbclid;
    
    const hashedUid = await hashData(uid);
    const checkoutEventId = 'evt_' + Date.now() + '_ic';

    // Track InitiateCheckout in Meta Pixel with Deduplication eventID
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: planName,
        value: price,
        currency: 'BRL',
        action_source: 'website',
        event_source_url: window.location.href,
        external_id: hashedUid,
      }, { eventID: checkoutEventId });
    }

    // Generate CAPI Payload for InitiateCheckout
    const capiPayload = generateCapiPayload('InitiateCheckout', checkoutEventId, {
      external_id: [hashedUid]
    }, {
      currency: 'BRL',
      value: price
    });
    console.log('CAPI Payload (InitiateCheckout):', JSON.stringify(capiPayload, null, 2));

    // Decorate URL
    let finalUrl = baseUrl;
    if (baseUrl && !baseUrl.startsWith('#')) {
      try {
        const u = new URL(baseUrl, window.location.origin);
        if (uid) {
          u.searchParams.set('id', uid);
          u.searchParams.set('external_id', uid);
          u.searchParams.set('user_id', uid);
          u.searchParams.set('lead_id', uid);
        }
        if (currentFbclid) {
          u.searchParams.set('fbclid', currentFbclid);
          u.searchParams.set('src', currentFbclid);
          u.searchParams.set('sck', currentFbclid);
        }
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(p => {
          const storedVal = localStorage.getItem(p);
          if (storedVal) u.searchParams.set(p, storedVal);
        });
        finalUrl = u.toString();
      } catch (err) {}
    }

    if (baseUrl.startsWith('#')) {
      const el = document.querySelector(baseUrl);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = finalUrl;
    }
  };

  useEffect(() => {
    if (!document.getElementById('dancing-script')) {
      const link = document.createElement('link');
      link.id = 'dancing-script';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap';
      document.head.appendChild(link);
    }
    // 1. Dynamic Brazilian Date Formatter for Urgency Bars
    const today = new Date();
    const options = { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(today);
    const elems = document.querySelectorAll('.live-date-val');
    elems.forEach(el => { el.textContent = formattedDate; });

    // 2. FAQ Accordion Interaction
    const toggles = document.querySelectorAll('.faq-toggle');
    const handleClick = (e) => {
      const btn = e.currentTarget;
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = !content.classList.contains('hidden');

      // Close all
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isExpanded) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    };

    toggles.forEach(btn => {
      btn.addEventListener('click', handleClick);
    });

    return () => {
      toggles.forEach(btn => btn.removeEventListener('click', handleClick));
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#1a9e38] shadow-md"><div className="text-white py-3 px-gutter-mobile text-center flex items-center justify-center gap-1.5"><span className="material-symbols-outlined text-[16px] animate-pulse">alarm</span><p className="text-[14px] font-extrabold tracking-tight">A promoção dessa página acaba no dia <span className="live-date-val underline">28/09/2026</span></p></div></header><main className="flex flex-col relative w-full pt-14 pb-36 bg-[#fdfaf5]"><div className="flex flex-col w-full">
{/*  1. Dynamic Urgency Bar  */}
{/*  2. Hero Section  */}
<section id="hero" className="px-gutter-mobile pt-6 pb-10 md:pt-16 md:pb-20 flex flex-col items-center text-center bg-[#fdfaf5]">
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
    {/* Left Column: Text & CTA on Desktop */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 order-2 md:order-1">
      <h1 className="text-[40px] md:text-[52px] leading-[1.05] text-[#c02f23] font-black tracking-tight mb-2">
        Tábuas e petiscos
      </h1>
      <div className="text-[42px] md:text-[56px] text-[#e86b24] leading-none -mt-3 mb-4" style={{fontFamily: "'Dancing Script', cursive", fontWeight: 700}}>
        para o Natal
      </div>
      <div className="flex items-center justify-center md:justify-start gap-3 mb-6 text-[#9a4b27] text-[16px] md:text-[18px] font-serif italic font-bold">
        <span className="w-10 h-[1px] bg-[#d7ae9c]"></span>
        <span>com a Chef Ju</span>
        <span className="w-10 h-[1px] bg-[#d7ae9c]"></span>
      </div>

      <p className="font-medium text-[16px] md:text-[18px] leading-relaxed text-[#5a4843] max-w-[320px] md:max-w-[400px] mx-auto md:mx-0 mb-8">
        Receitas explicadas de maneira simples, com ingredientes acessíveis e combinações que deixam qualquer mesa mais bonita e convidativa.
      </p>

      <div className="flex flex-col items-center md:items-start mb-8 w-full">
        <span className="text-[#d32f2f] font-bold text-[18px]">De <span className="line-through">R$47</span> por apenas</span>
        <span className="text-[#1a9e38] font-black text-[80px] md:text-[96px] leading-none mt-0 tracking-tighter">R$10</span>
      </div>

      <a className="w-full max-w-[340px] md:max-w-[400px] h-[64px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[22px] font-black uppercase tracking-wide shadow-[0_8px_20px_rgba(26,158,56,0.3)] active:scale-95 transition-transform" href="#ofertas">
        <span className="material-symbols-outlined text-[28px]">lock</span>
        <span>QUERO MEU ACESSO</span>
      </a>
      <span className="text-[12px] md:text-[14px] font-bold text-[#8c7b77] flex items-center justify-center md:justify-start gap-1 mt-4 w-full md:max-w-[400px]">
        <span className="material-symbols-outlined text-[15px] md:text-[18px]">verified_user</span>
        Compra 100% segura • Acesso vitalício
      </span>
    </div>

    {/* Right Column: Image on Desktop */}
    <div className="w-full relative max-w-[340px] md:max-w-[450px] mb-8 md:mb-0 flex-1 order-1 md:order-2">
      <img alt="Hero Imagem" className="w-full h-auto rounded-3xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform duration-500" src="./code_files/hero_imagem.webp" />
    </div>
  </div>
</section>

{/*  Seção: Este livro é perfeito para quem quer  */}
<section className="px-gutter-mobile py-8 md:py-16 bg-[#fdf8f5]">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-8 md:mb-12 text-center">
      Este livro é perfeito para quem quer:
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {[
        "Receber amigos e familiares com uma mesa bonita",
        "Ter novas ideias de petiscos para o fim de semana",
        "Preparar aperitivos sem complicação",
        "Montar tábuas gastando pouco",
        "Variar os sabores em festas e comemorações",
        "Criar momentos especiais dentro de casa",
        "Preparar receitas que agradam diferentes gostos",
        "Ter opções prontas para consultar sempre que precisar"
      ].map((item, idx) => (
        <div key={idx} className="flex items-start gap-4 bg-white p-4 md:p-6 rounded-2xl border border-[#f0e4d8] shadow-sm hover:shadow-md transition-shadow">
          <span className="material-symbols-outlined text-[#1a9e38] text-[24px] shrink-0 mt-0.5 font-bold">check_circle</span>
          <span className="text-[#333] font-semibold text-[15px] md:text-[17px] leading-snug">{item}</span>
        </div>
      ))}
    </div>
  </div>
</section>

{/*  Seção Showcase Conteúdo (+90 ideias...)  */}
<section className="px-gutter-mobile py-10 md:py-20 bg-[#fefbf7]">
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
    
    {/* Left Column */}
    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
      <div className="mb-3">
        <div className="text-[54px] md:text-[80px] font-black text-[#c02f23] leading-none mb-1">+90</div>
        <h2 className="text-[22px] md:text-[36px] font-extrabold text-[#5a4843] leading-tight mb-4">
          ideias entre tábuas, petiscos e <span style={{fontFamily: "'Dancing Script', cursive"}} className="text-[#c02f23] text-[30px] md:text-[46px]">aperitivos</span> da Chef Ju!
        </h2>
      </div>

      <p className="text-[14px] md:text-[18px] font-extrabold text-[#5a4843] mb-5 md:mb-8">
        Tudo prático e bonito para você variar os petiscos
      </p>

      <a href="#ofertas" className="w-full max-w-[340px] md:max-w-[400px] h-[54px] md:h-[64px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[17px] md:text-[20px] font-black uppercase tracking-wide shadow-[0_6px_18px_rgba(26,158,56,0.3)] active:scale-95 transition-transform hidden md:flex">
        QUERO TODAS AS 90 RECEITAS
      </a>
    </div>

    {/* Right Column */}
    <div className="flex-1 flex flex-col items-center w-full">
      <div className="w-full max-w-[340px] md:max-w-[450px] mb-6">
        <img src="./code_files/mokup 90 natal.png" alt="Conteúdo +90 Tábuas e Petiscos da Chef Ju" className="w-full h-auto rounded-2xl shadow-lg object-contain hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[340px] sm:max-w-full mb-6 md:mb-0">
        {[
          { icon: "🍢", text: "Tábuas de frios" },
          { icon: "🧀", text: "Tábuas com queijos e embutidos" },
          { icon: "🥓", text: "Petiscos com calabresa" },
          { icon: "🔥", text: "Aperitivos quentes e frios" },
          { icon: "🥣", text: "Molhos e acompanhamentos" },
          { icon: "🍡", text: "Petiscos para festas" },
          { icon: "🏠", text: "Opções para receber visitas" },
          { icon: "✨", text: "Combinações para momentos especiais" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-[#f0e4d8] py-2.5 px-4 rounded-full text-center text-[13px] md:text-[14px] font-bold text-[#8c4327] shadow-sm flex items-center justify-center gap-2 hover:shadow-md transition-shadow">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <a href="#ofertas" className="w-full max-w-[340px] h-[54px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[17px] font-black uppercase tracking-wide shadow-[0_6px_18px_rgba(26,158,56,0.3)] active:scale-95 transition-transform md:hidden">
        QUERO TODAS AS 90 RECEITAS
      </a>
    </div>

  </div>
</section>
{/*  3. Carrossel de Fichas e Entregáveis  */}
<section className="py-space-md bg-surface-container-low">
<div className="px-gutter-mobile mb-6 flex flex-col items-center text-center">
<div className="inline-flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2">
<span className="material-symbols-outlined text-[16px]">menu_book</span>
<span className="">Passo a Passo Visual</span>
</div>
<h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2">
        Confira as Fichas Práticas por Dentro
      </h2>
<p className="font-body-sm text-body-sm md:text-body-md text-on-surface-variant max-w-sm md:max-w-2xl mx-auto">
        Cada receita vem com lista detalhada de ingredientes, medidas certas e fotos em ordem cronológica de montagem.
      </p>
</div>
{/*  Horizontal Swipe Carousel de Fichas  */}
<div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-4 md:gap-6 px-gutter-mobile md:px-6 max-w-5xl mx-auto pb-6 snap-x snap-mandatory">

{/*  Sheet 1  */}
<div className="min-w-[260px] max-w-[270px] md:min-w-0 md:max-w-none md:w-full snap-center bg-surface-container-lowest rounded-xl shadow-md p-2.5 md:p-4 flex flex-col flex-shrink-0 hover:shadow-lg transition-shadow">
<img alt="Tábua Especial de Natal - Ficha Completa" className="w-full rounded-lg object-cover aspect-square shadow-sm mb-2" src="./code_files/unnamed.png" />
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Ficha 01</span>
<h3 className="font-title-lg text-title-lg text-on-surface font-bold line-clamp-1">Tábua Especial de Natal</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">Montagem completa com queijos, frios enrolados, frutas frescas e decoração aromática.</p>
</div>
{/*  Sheet 2  */}
<div className="min-w-[260px] max-w-[270px] md:min-w-0 md:max-w-none md:w-full snap-center bg-surface-container-lowest rounded-xl shadow-md p-2.5 md:p-4 flex flex-col flex-shrink-0 hover:shadow-lg transition-shadow">
<img alt="Ficha Guirlanda Natalina de Petiscos" className="w-full rounded-lg object-cover aspect-square shadow-sm mb-2" src="./code_files/unnamed(1).jpg" />
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Ficha 02</span>
<h3 className="font-title-lg text-title-lg text-on-surface font-bold line-clamp-1">Guirlanda de Petiscos</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">Montagem circular com alecrim fresco, queijo muçarela e flores de salame.</p>
</div>
{/*  Sheet 3  */}
<div className="min-w-[260px] max-w-[270px] snap-center bg-surface-container-lowest rounded-xl shadow-md p-2.5 flex flex-col flex-shrink-0">
<img alt="Ficha Árvore Festiva de Queijos e Frutas" className="w-full rounded-lg object-cover aspect-square shadow-sm mb-2" src="./code_files/unnamed(2).jpg" />
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Ficha 03</span>
<h3 className="font-title-lg text-title-lg text-on-surface font-bold line-clamp-1">Árvore de Queijos &amp; Frutas</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">Camadas triangulares de uvas, morangos, queijo gouda e estrela comestível.</p>
</div>
{/*  Sheet 4  */}
<div className="min-w-[260px] max-w-[270px] snap-center bg-surface-container-lowest rounded-xl shadow-md p-2.5 flex flex-col flex-shrink-0">
<img alt="Ficha Tábua Clássica de Frios e Nozes" className="w-full rounded-lg object-cover aspect-square shadow-sm mb-2" src="./code_files/unnamed(3).jpg" />
<span className="font-label-sm text-label-sm text-secondary font-bold uppercase">Ficha 04</span>
<h3 className="font-title-lg text-title-lg text-on-surface font-bold line-clamp-1">Tábua Clássica de Frios</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">Combinação equilibrada com queijo brie, presunto parma e mel silvestre.</p>
</div>
</div>
</section>
{/*  4. Depoimentos Estilo WhatsApp Natalino (Imediatamente abaixo das fichas)  */}
<section className="px-gutter-mobile py-space-lg md:py-20 bg-surface" id="depoimentos">
<div className="text-center max-w-sm md:max-w-2xl mx-auto mb-space-md md:mb-12">
<div className="inline-flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-1">
<span className="material-symbols-outlined text-[16px]">chat</span>
<span>Conversas Reais no WhatsApp</span>
</div>
<h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2 md:mb-4">
  Quem Fez, Amou e Recebeu Elogios
</h2>
<p className="font-body-sm text-body-sm md:text-body-md text-on-surface-variant max-w-sm md:max-w-2xl mx-auto">
  Veja os prints enviados pelas nossas alunas após montarem suas tábuas na ceia de Natal:
</p>
</div>
{/*  Carrossel de Prints WhatsApp  */}
<div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-4 md:gap-8 pb-6 snap-x snap-mandatory max-w-5xl mx-auto">

{/*  Depoimento 1 (Carla Silveira)  */}
<div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/40 overflow-hidden flex flex-col flex-shrink-0 hover:shadow-xl transition-shadow">
<div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-400"></span>
<span className="font-label-sm text-label-sm font-bold">Carla Silveira</span>
</div>
<span className="text-[10px] text-emerald-200">Ceia de Natal</span>
</div>
<div className="p-1.5 bg-[#efeae2]/50">
<img alt="Depoimento WhatsApp Carla Silveira sobre tábua de Natal" className="w-full h-auto rounded-xl object-contain shadow-inner" src="./code_files/unnamed(4).jpg" />
</div>
<div className="p-2.5 bg-surface-container-low text-center">
<p className="font-label-sm text-label-sm text-secondary font-bold">“Todo mundo tirou foto antes de comer!”</p>
</div>
</div>
{/*  Depoimento 2 (Mariana Santos)  */}
<div className="min-w-[270px] max-w-[290px] snap-center bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/40 overflow-hidden flex flex-col flex-shrink-0">
<div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-emerald-400"></span>
<span className="font-label-sm text-label-sm font-bold">Mariana Santos</span>
</div>
<span className="text-[10px] text-emerald-200">Árvore de Queijos</span>
</div>
<div className="p-1.5 bg-[#efeae2]/50">
<img alt="Depoimento WhatsApp Mariana Santos sobre Árvore de Queijos" className="w-full h-auto rounded-xl object-contain shadow-inner" src="./code_files/unnamed(5).jpg" />
</div>
<div className="p-2.5 bg-surface-container-low text-center">
<p className="font-label-sm text-label-sm text-secondary font-bold">“Nunca tinha montado, ficou idêntica!”</p>
</div>
</div>
{/*  Depoimento Novo  */}
<div className="min-w-[270px] max-w-[290px] snap-center bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/40 overflow-hidden flex flex-col flex-shrink-0">
<div className="p-1.5 bg-[#efeae2]/50 h-full">
<img alt="Depoimento WhatsApp" className="w-full h-full object-cover rounded-xl shadow-inner" src="./code_files/chatgpt_testimonial.png" />
</div>
</div>
</div>
</section>
{/*  5. Conteúdo do Material  */}
<section className="px-gutter-mobile py-space-xl md:py-20 bg-surface-container-low" id="receitas"><div className="text-center max-w-md md:max-w-2xl mx-auto mb-space-lg md:mb-12"><div className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full shadow-sm mb-2 md:mb-4"><span className="material-symbols-outlined text-[15px] text-tertiary">restaurant_menu</span><span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">As Receitas Exclusivas</span></div><h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2 md:mb-4">Veja algumas das tábuas e receitas que você poderá preparar no Natal</h2><p className="font-body-md text-body-md text-on-surface-variant">Apresentações refinadas que combinam sabores, cores e praticidade para encantar toda a sua família na ceia:</p></div><div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-md md:max-w-5xl mx-auto"><div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30"><img alt="Guirlanda de Petiscos Natalina" className="w-full aspect-square object-cover" src="./code_files/unnamed(1).jpg" /><div className="p-3 flex flex-col justify-between flex-grow"><h4 className="font-title-lg text-title-lg text-primary font-bold leading-tight mb-1">GUIRLANDA DE PETISCOS</h4><p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">A queridinha da ceia, aromática, fresca e impressionante.</p></div></div><div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30"><img alt="Árvore Festiva de Queijos &amp; Frutas" className="w-full aspect-square object-cover" src="./code_files/unnamed(2).jpg" /><div className="p-3 flex flex-col justify-between flex-grow"><h4 className="font-title-lg text-title-lg text-primary font-bold leading-tight mb-1">ÁRVORE DE QUEIJOS</h4><p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">Disposição natalina que encanta adultos e crianças na mesa.</p></div></div><div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30"><img alt="Tábua Clássica de Natal" className="w-full aspect-square object-cover" src="./code_files/unnamed(3).jpg" /><div className="p-3 flex flex-col justify-between flex-grow"><h4 className="font-title-lg text-title-lg text-primary font-bold leading-tight mb-1">TÁBUA CLÁSSICA DE NATAL</h4><p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">Farta, elegante e com rendimento perfeito para a família.</p></div></div><div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30"><img alt="Tábua de Petiscos Quentes" className="w-full aspect-square object-cover" src="./code_files/unnamed(8).jpg" /><div className="p-3 flex flex-col justify-between flex-grow"><h4 className="font-title-lg text-title-lg text-primary font-bold leading-tight mb-1">PETISCOS QUENTES</h4><p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">Folhados crocantes dourados e aperitivos fáceis de montar.</p></div></div><div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30"><img alt="Finger Foods &amp; Bruschettas" className="w-full aspect-square object-cover" src="./code_files/unnamed(9).jpg" /><div className="p-3 flex flex-col justify-between flex-grow"><h4 className="font-title-lg text-title-lg text-primary font-bold leading-tight mb-1">FINGER FOODS</h4><p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">Pequenos canapés gourmet com combinação doce e salgada.</p></div></div><div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-outline-variant/30"><img alt="Tábua Doce Natalina com Vinho" className="w-full aspect-square object-cover" src="./code_files/unnamed(10).jpg" /><div className="p-3 flex flex-col justify-between flex-grow"><h4 className="font-title-lg text-title-lg text-primary font-bold leading-tight mb-1">TÁBUA DOCE NATALINA</h4><p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">Combinações com castanhas, frutas secas, queijos e chocolates.</p></div></div></div></section>
{/* Botão de Ancoragem para Preço antes dos Bônus */}
<div className="w-full max-w-md mx-auto py-6 px-gutter-mobile text-center">
  <a href="#ofertas" className="w-full h-[56px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[17px] font-black uppercase tracking-wide shadow-[0_6px_20px_rgba(26,158,56,0.3)] active:scale-95 transition-transform">
    <span className="material-symbols-outlined text-[24px]">lock</span>
    <span>QUERO GARANTIR MEU DESCONTO</span>
  </a>
</div>

{/*  6. Bônus Inclusos na Oferta Completa  */}
<section className="px-gutter-mobile py-10 md:py-20 bg-[#fdf8f3]" id="bonus">
  <div className="max-w-5xl mx-auto text-center">
    {/* Pill Badge */}
    <div className="inline-flex items-center gap-1.5 bg-[#d83a18] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm mb-3">
      <span>🎁 PRESENTE ESPECIAL</span>
    </div>

    {/* Subtitle Divider */}
    <div className="flex items-center justify-center gap-3 mb-2 text-[#c02f23] text-[12px] font-extrabold uppercase tracking-widest">
      <span className="w-8 h-[1px] bg-[#e0c4b8]"></span>
      <span>DE BRINDE</span>
      <span className="w-8 h-[1px] bg-[#e0c4b8]"></span>
    </div>

    {/* Section Headline */}
    <h2 className="text-[26px] leading-[1.15] text-[#c02f23] font-black tracking-tight max-w-sm mx-auto text-center mb-8">
      Ao comprar hoje você ganha três bônus exclusivos
    </h2>

    {/* Bonus Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-md md:max-w-5xl mx-auto mb-8 items-stretch">
      {[
        {
          tag: "BÔNUS 1",
          title: "Guia Especial de Tábuas & Aperitivos de Ano Novo",
          desc: "Receitas exclusivas, combinações com espumantes e aperitivos dourados para celebrar a virada de ano com muita elegância.",
          img: "./code_files/bonus_ano_novo.png",
          originalPrice: "37,00"
        },
        {
          tag: "BÔNUS 2",
          title: "Lista de Supermercado Inteligente e Otimizada",
          desc: "Checklist organizado por setores de feira e mercearia para você não esquecer nada nem gastar a mais.",
          img: "./code_files/unnamed(12).jpg",
          originalPrice: "29,00"
        },
        {
          tag: "BÔNUS 3",
          title: "Marcadores Decorativos de Mesa Imprimíveis",
          desc: "Plaquinhas elegantes para identificar queijos e castanhas, dando acabamento de bufê refinado.",
          img: "./code_files/unnamed(13).jpg",
          originalPrice: "25,00"
        }
      ].map((bonus, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-4 shadow-md border-2 border-[#f2e6dc] flex flex-col items-center text-center relative overflow-hidden">
          {/* Top-left Ribbon Tag */}
          <div className="absolute top-0 left-0 bg-[#d83a18] text-white text-[10px] font-black uppercase px-3 py-1 rounded-br-xl shadow-sm z-10">
            {bonus.tag}
          </div>

          {/* Book Image */}
          <div className="w-full max-w-[220px] h-[170px] my-3 overflow-hidden rounded-xl shadow-sm flex items-center justify-center bg-[#faf6f2]">
            <img src={bonus.img} alt={bonus.title} className="w-full h-full object-cover rounded-xl" />
          </div>

          {/* Title */}
          <h4 className="text-[15px] font-black text-[#1c3a27] leading-tight mb-1.5 px-2">
            {bonus.title}
          </h4>

          {/* Description */}
          <p className="text-[12px] text-[#666] leading-relaxed mb-4 px-2">
            {bonus.desc}
          </p>

          {/* Price & Free Badge */}
          <div className="flex items-center justify-center gap-2 border-t border-[#f2e6dc] w-full pt-3 mt-auto">
            <span className="text-[12px] text-[#c02f23] line-through font-bold">R$ {bonus.originalPrice}</span>
            <span className="bg-[#e8f5e9] text-[#1a9e38] text-[12px] font-black px-3 py-0.5 rounded-full inline-flex items-center gap-1">
              ✓ GRÁTIS
            </span>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Summary Banner */}
    <div className="bg-[#fff7f2] border-2 border-[#f5dcd2] rounded-2xl p-3.5 max-w-md md:max-w-3xl mx-auto text-center shadow-sm">
      <p className="text-[13px] sm:text-[14px] font-black text-[#c02f23] flex items-center justify-center gap-1.5 flex-wrap uppercase tracking-tight">
        <span>💚</span>
        <span>VALOR TOTAL DOS BÔNUS → TUDO GRÁTIS HOJE!</span>
      </p>
    </div>
  </div>
</section>
{/*  7. Seção Final de Planos & Checkout  */}
<section className="px-gutter-mobile py-space-xl md:py-20 bg-surface-container-low text-on-surface" id="ofertas">
  <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
    <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2 md:mb-4">
      Selecione a opção que combina melhor com você
    </h2>
    <p className="font-body-sm text-body-sm md:text-body-md text-on-surface-variant mb-6 md:mb-10 max-w-xs md:max-w-md">
      Acesso imediato e vitalício a todas as receitas e bônus da Chefe Ju
    </p>

    {/* Cards Lado a Lado no Mobile */}
    <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-8 mb-6 md:mb-10 text-left items-stretch max-w-md md:max-w-3xl mx-auto">
      {/* Card 1: Oferta Básica */}
      <div className="bg-white text-on-surface rounded-2xl p-2.5 shadow-md border-2 border-[#e1bfbb] flex flex-col justify-between relative">
        <div>
          <div className="inline-flex items-center justify-center gap-0.5 bg-[#ffedea] text-[#c02f23] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 w-full text-center">
            <span className="material-symbols-outlined text-[11px]">bolt</span>
            <span>OFERTA BÁSICA</span>
          </div>

          <h3 className="text-[13px] font-black text-[#c02f23] text-center mb-2.5 leading-tight">
            +90 Tábuas e Petiscos
          </h3>

          <div className="flex flex-col gap-1.5 mb-3 text-[11px] leading-tight text-[#444]">
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>90 Receitas de Tábuas e Petiscos</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>Acesso Vitalício</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>Entrega imediata por e-mail e WhatsApp</span>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/40 pt-2.5 flex flex-col items-center text-center mt-auto">
          <span className="text-[9px] text-[#c02f23] line-through font-bold block">De R$ 47,00 por apenas</span>
          <div className="text-[28px] font-black text-[#1a9e38] leading-none my-1">R$ 10</div>
          <a 
            className="w-full py-2.5 px-1 rounded-xl bg-[#1a9e38] text-white text-[11px] font-extrabold text-center block shadow-md active:scale-95 transition-transform uppercase tracking-wider cursor-pointer"
            onClick={(e) => { e.preventDefault(); setShowModal(true); }}
          >
            COMPRAR AGORA
          </a>
        </div>
      </div>

      {/* Card 2: Super Oferta */}
      <div className="bg-white text-on-surface rounded-2xl p-2.5 shadow-xl border-2 border-[#1a9e38] flex flex-col justify-between relative pt-3">
        {/* Badge MAIS VENDIDA em verde por cima do card */}
        <div className="absolute -top-2.5 right-1.5 bg-[#1a9e38] text-white text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md z-20 flex items-center gap-0.5">
          <span>★ MAIS VENDIDA</span>
        </div>

        <div>
          <div className="inline-flex items-center justify-center gap-0.5 bg-[#e86b24] text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 w-full text-center">
            <span className="material-symbols-outlined text-[11px]">whatshot</span>
            <span>SUPER OFERTA</span>
          </div>

          <h3 className="text-[13px] font-black text-[#c02f23] text-center mb-2.5 leading-tight">
            +165 Tábuas e Petiscos
          </h3>

          <div className="flex flex-col gap-1.5 mb-2 text-[11px] leading-tight text-[#444]">
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>165 Receitas de Tábuas e Petiscos Premium</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>Tábuas Doces e Salgadas Especiais</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>Aperitivos Rápidos para Receber</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>Acesso Vitalício</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
              <span>Entrega imediata por e-mail e WhatsApp</span>
            </div>
          </div>

          <div className="bg-[#fff8f6] border border-[#f0c8c2] rounded-lg p-1.5 mb-2">
            <span className="text-[9px] font-black text-[#c02f23] uppercase tracking-wider block text-center mb-1">
              BÔNUS EXCLUSIVOS!
            </span>
            <div className="flex flex-col gap-1 text-[9.5px] leading-tight text-[#444]">
              <div className="flex items-start gap-1">
                <span>🎁</span>
                <span>Guia Especial de Tábuas &amp; Aperitivos de Ano Novo</span>
              </div>
              <div className="flex items-start gap-1">
                <span>🎁</span>
                <span>Guia de Molhos e Pastas Irresistíveis</span>
              </div>
              <div className="flex items-start gap-1">
                <span>🎁</span>
                <span>Guia de Substituições</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/40 pt-2.5 flex flex-col items-center text-center mt-auto">
          <span className="text-[9px] text-[#c02f23] line-through font-bold block">De R$ 87,00 por apenas</span>
          <div className="text-[28px] font-black text-[#1a9e38] leading-none my-1">R$ 18</div>
          <a 
            className="w-full py-2.5 px-1 rounded-xl bg-[#1a9e38] text-white text-[11px] font-extrabold text-center block shadow-md active:scale-95 transition-transform uppercase tracking-wider animate-pulse cursor-pointer"
            href="https://lastlink.com/p/CDD90FEEA/checkout-payment/"
            onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/CDD90FEEA/checkout-payment/', 'Super Oferta +165 Receitas VIP', 18)}
          >
            COMPRAR AGORA
          </a>
        </div>
      </div>
    </div>

  </div>
</section>

{/*  Seção de Avaliações e Depoimentos dos Alunos (3.500+ pessoas já montaram)  */}
<section className="px-gutter-mobile py-10 md:py-20 bg-[#fdfaf5]" id="avaliacoes">
  <div className="max-w-5xl mx-auto">
    {/* Header com 3.500+ */}
    <div className="text-center mb-6">
      <div className="text-[58px] font-black text-[#1a9e38] leading-none mb-1 tracking-tight">
        3.500+
      </div>
      <h3 className="text-[20px] font-extrabold text-[#333] leading-tight mb-2">
        pessoas já <span style={{fontFamily: "'Dancing Script', cursive"}} className="text-[#c02f23] text-[28px]">montaram</span> suas tábuas em casa
      </h3>
      <p className="text-[13px] text-[#666] leading-relaxed max-w-xs mx-auto">
        Pessoas que já começaram a preparar tábuas e petiscos mais bonitos, variados e saborosos em casa.
      </p>
    </div>

    {/* Card de Avaliação 4.9 */}
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-[#f0e4d8] mb-8 md:mb-12 flex items-center justify-between gap-3 max-w-md md:max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center shrink-0 pr-3 border-r border-[#eee]">
        <div className="text-[44px] font-black text-[#1c3a27] leading-none">4.9</div>
        <div className="flex text-[#e65100] text-[13px] my-1">
          ★★★★★
        </div>
        <span className="text-[11px] text-[#888] font-semibold">3.541 avaliações</span>
      </div>

      <div className="flex-grow flex flex-col gap-1.5 text-[11px] text-[#666]">
        {[
          { star: "5", width: "w-[92%]" },
          { star: "4", width: "w-[35%]" },
          { star: "3", width: "w-[12%]" },
          { star: "2", width: "w-[4%]" },
          { star: "1", width: "w-[2%]" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-2 font-bold text-right">{item.star}</span>
            <div className="h-2 flex-grow bg-[#eee] rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r from-[#e65100] to-[#c02f23] ${item.width} rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Grid de Cards de Depoimentos Reais */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
      {[
        {
          name: "Ana M.",
          date: "12 de março de 2025",
          avatarBg: "bg-[#e53935]",
          initials: "AM",
          comment: "Montei a tábua de frios clássica para receber minhas amigas e ficou linda. As combinações são simples e o passo a passo ajuda muito.",
          img: "./code_files/galeria-p1.png",
          likes: 34
        },
        {
          name: "Juliana S.",
          date: "3 de abril de 2025",
          avatarBg: "bg-[#43a047]",
          initials: "JS",
          comment: "Comprei pelos petiscos de calabresa e pelos aperitivos quentes. Meus filhos amaram e já virou rotina no fim de semana aqui em casa.",
          img: "./code_files/galeria-p2.png",
          likes: 29
        },
        {
          name: "Camila F.",
          date: "28 de março de 2025",
          avatarBg: "bg-[#8e24aa]",
          initials: "CF",
          comment: "Sempre gastava muito comprando petisco pronto. Agora monto tábuas em casa com ingredientes simples e o resultado fica bem mais bonito.",
          img: "./code_files/galeria-p3.png",
          likes: 51
        },
        {
          name: "Patricia R.",
          date: "19 de fevereiro de 2025",
          avatarBg: "bg-[#fb8c00]",
          initials: "PR",
          comment: "A tábua rápida para visitas me salvou. Fica pronta em minutos com o que eu já tinha na geladeira e todo mundo elogiou.",
          img: "./code_files/review-4.png",
          likes: 62
        },
        {
          name: "Renata B.",
          date: "5 de abril de 2025",
          avatarBg: "bg-[#039be5]",
          initials: "RB",
          comment: "As receitas são bem explicadas, com ingredientes fáceis. Fiz os molhos e a tábua doce e os dois agradaram bastante.",
          img: "./code_files/review-5.png",
          likes: 47
        },
        {
          name: "Larissa C.",
          date: "21 de março de 2025",
          avatarBg: "bg-[#d81b60]",
          initials: "LC",
          comment: "Eu nunca sabia como combinar os queijos e os embutidos. Aqui tem várias ideias prontas e ficou tudo bonito na mesa.",
          img: "./code_files/review-6.png",
          likes: 39
        }
      ].map((rev, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#f0e4d8] flex flex-col justify-between">
          <div>
            <div className="flex text-[#e65100] text-[12px] mb-2">★★★★★</div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className={`w-8 h-8 rounded-full ${rev.avatarBg} text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-sm`}>
                {rev.initials}
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#333] leading-none mb-0.5">{rev.name}</h4>
                <span className="text-[10px] text-[#888]">{rev.date}</span>
              </div>
            </div>
            <p className="text-[12px] text-[#444] leading-relaxed mb-3">
              {rev.comment}
            </p>
          </div>

          <div>
            <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-[#fafafa] mb-3 shadow-inner">
              <img src={rev.img} alt={`Tábua de ${rev.name}`} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 bg-[#f9f9f9] border border-[#eee] rounded-full px-2.5 py-1 text-[11px] text-[#666] font-medium active:scale-95 transition-transform">
                <span>♡</span> Curtir {rev.likes}
              </button>
              <button className="flex items-center gap-1 bg-[#f9f9f9] border border-[#eee] rounded-full px-2.5 py-1 text-[11px] text-[#666] font-medium active:scale-95 transition-transform">
                <span>💬</span> Comentar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Seção de Garantia de 15 Dias com JkRnpY1.png */}
    <div className="bg-[#fffcf7] border-2 border-[#e8d8cb] rounded-3xl p-5 md:p-10 shadow-xl max-w-md md:max-w-4xl mx-auto text-center relative overflow-hidden">
      <div className="inline-flex items-center gap-1 bg-[#e0f2fe] text-[#0284c7] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
        <span className="material-symbols-outlined text-[13px]">verified_user</span>
        <span>RISCO ZERO</span>
      </div>

      <h3 className="text-[20px] font-black text-[#1c3a27] leading-tight mb-3">
        Experimente sem preocupações por 15 dias
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <img src="./code_files/JkRnpY1.png" alt="Garantia Incondicional de 15 Dias" className="w-28 h-auto object-contain shrink-0 mx-auto" />
        <p className="text-[12px] text-[#555] leading-relaxed text-left sm:text-left">
          Você poderá acessar o material, conhecer as receitas e verificar se o conteúdo faz sentido para você. Caso não fique satisfieda dentro do prazo de <strong className="text-[#c02f23]">15 dias</strong>, poderá solicitar o reembolso conforme as condições da garantia.
        </p>
      </div>

      <a href="#ofertas" className="w-full py-3.5 px-4 rounded-xl bg-[#1a9e38] text-white text-[15px] font-black uppercase tracking-wider block shadow-lg shadow-[#1a9e38]/30 active:scale-95 transition-transform text-center">
        QUERO AS 90 RECEITAS
      </a>
    </div>
  </div>
</section>
{/*  8. Perguntas Frequentes (FAQ)  */}
<section className="px-gutter-mobile py-space-lg md:py-20" id="faq">
<div className="text-center max-w-sm md:max-w-2xl mx-auto mb-space-md md:mb-12">
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold block mb-1">
        Tire Suas Dúvidas
      </span>
<h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2">
        Perguntas Frequentes
      </h2>
</div>
<div className="flex flex-col gap-2.5 md:gap-4 max-w-md md:max-w-3xl mx-auto" id="faq-accordion">
{/*  FAQ 1  */}
<div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
<button className="w-full p-space-md flex items-center justify-between text-left gap-2 font-title-lg text-title-lg font-bold text-on-surface faq-toggle" type="button">
<span className="">Qual a diferença entre o pacote de R$ 10 e o de R$ 18?</span>
<span className="material-symbols-outlined transition-transform duration-200 faq-icon text-outline">expand_more</span>
</button>
<div className="px-space-md pb-space-md hidden faq-content text-on-surface-variant font-body-sm text-body-sm">
  O Pacote Básico (R$ 10,00) contém o Guia Principal com todas as mais de 90 fichas de receitas e montagens. O Pacote VIP (R$ 18,00) inclui além do guia principal, todos os 3 bônus exclusivos: o Guia Especial de Ano Novo, a Lista de Compras Inteligente e os Marcadores Decorativos de Mesa para imprimir.
</div>
</div>
{/*  FAQ 2  */}
<div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
<button className="w-full p-space-md flex items-center justify-between text-left gap-2 font-title-lg text-title-lg font-bold text-on-surface faq-toggle" type="button">
<span className="">Como recebo o acesso ao material?</span>
<span className="material-symbols-outlined transition-transform duration-200 faq-icon text-outline">expand_more</span>
</button>
<div className="px-space-md pb-space-md hidden faq-content text-on-surface-variant font-body-sm text-body-sm">
  Imediatamente após a confirmação do pagamento! Você recebe um e-mail com os dados de login e link para baixar todas as fichas no seu celular, tablet ou computador.
</div>
</div>
{/*  FAQ 3  */}
<div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
<button className="w-full p-space-md flex items-center justify-between text-left gap-2 font-title-lg text-title-lg font-bold text-on-surface faq-toggle" type="button">
<span className="">Qual é o formato dos arquivos?</span>
<span className="material-symbols-outlined transition-transform duration-200 faq-icon text-outline">expand_more</span>
</button>
<div className="px-space-md pb-space-md hidden faq-content text-on-surface-variant font-body-sm text-body-sm">
  As fichas são disponibilizadas em formato PDF de alta resolução, otimizadas para leitura no smartphone e também prontas para impressão em tamanho A4 ou livreto.
</div>
</div>
{/*  FAQ 4  */}
<div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
<button className="w-full p-space-md flex items-center justify-between text-left gap-2 font-title-lg text-title-lg font-bold text-on-surface faq-toggle" type="button">
<span className="">Nunca montei tábuas, vou conseguir fazer?</span>
<span className="material-symbols-outlined transition-transform duration-200 faq-icon text-outline">expand_more</span>
</button>
<div className="px-space-md pb-space-md hidden faq-content text-on-surface-variant font-body-sm text-body-sm">
  Com certeza! O método da Chefe Ju foi desenvolvido para iniciantes. Cada ficha mostra a ordem exata do que colocar primeiro, evitando que os itens fiquem bagunçados.
</div>
</div>
{/*  FAQ 5  */}
<div className="bg-surface-container rounded-xl overflow-hidden shadow-sm">
<button className="w-full p-space-md flex items-center justify-between text-left gap-2 font-title-lg text-title-lg font-bold text-on-surface faq-toggle" type="button">
<span className="">Por quanto tempo terei acesso?</span>
<span className="material-symbols-outlined transition-transform duration-200 faq-icon text-outline">expand_more</span>
</button>
<div className="px-space-md pb-space-md hidden faq-content text-on-surface-variant font-body-sm text-body-sm">
  O seu acesso é vitalício! Você poderá consultar as fichas neste Natal e em todas as próximas comemorações da sua família.
</div>
</div>
</div>
</section>

{/* Botão de Ancoragem Final no Fim da Página */}
<div className="w-full max-w-md mx-auto pt-6 pb-10 px-gutter-mobile text-center">
  <a href="#ofertas" className="w-full h-[60px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[18px] font-black uppercase tracking-wide shadow-[0_8px_24px_rgba(26,158,56,0.35)] active:scale-95 transition-transform">
    <span className="material-symbols-outlined text-[26px]">lock</span>
    <span>QUERO MEU ACESSO AGORA</span>
  </a>
  <span className="text-[12px] font-bold text-[#8c7b77] flex items-center justify-center gap-1 mt-3">
    <span className="material-symbols-outlined text-[15px]">verified_user</span>
    Compra 100% segura • Garantia de 15 dias • Acesso imediato
  </span>
</div>

{/*  Interactive Scripts  */}
{/*  Interactive Scripts Converted to useEffect  */}
</div></main>
{/* FAB */}
{showFab && (
  <a href="#ofertas" className="fixed bottom-4 right-4 z-50 bg-secondary text-on-secondary p-3 rounded-full shadow-2xl flex items-center justify-center animate-bounce">
    <span className="material-symbols-outlined text-[28px]">lock</span>
  </a>
)}

{/* Modal Upsell */}
{showModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
    <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-center">
      <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-on-surface-variant p-1">
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-label-sm font-bold uppercase tracking-wider mb-4">
        <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
        <span>OFERTA ESPECIAL!</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-primary font-bold mb-2">Espera! Que tal levar TUDO?</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">
        Por apenas mais <strong className="text-[#1a9e38] text-[16px]">R$ 4,50</strong> (Total: R$ 14,50), você leva o pacote <strong className="text-[#c02f23] font-extrabold">COMPLETO</strong> com +165 receitas e todos os 3 bônus!
      </p>
      <a 
        href="https://lastlink.com/p/C5F29AA19/checkout-payment/" 
        className="w-full py-3.5 px-4 rounded-xl bg-[#1a9e38] text-white font-label-lg text-label-lg font-black block shadow-md shadow-[#1a9e38]/30 active:scale-95 transition-transform uppercase mb-3 text-center cursor-pointer"
        onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/C5F29AA19/checkout-payment/', 'Oferta Especial R$ 14,50', 14.50)}
      >
        Quero o Completo por R$ 14,50
      </a>
      <a 
        href="https://lastlink.com/p/C0487572F/checkout-payment/" 
        className="w-full py-2 px-4 font-label-sm text-label-sm text-outline font-bold block underline text-center cursor-pointer"
        onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/C0487572F/checkout-payment/', 'Oferta Básica R$ 10', 10)}
      >
        Não, quero apenas o básico por R$ 10,00
      </a>
    </div>
  </div>
)}


    </div>
  );
}

export default App;
