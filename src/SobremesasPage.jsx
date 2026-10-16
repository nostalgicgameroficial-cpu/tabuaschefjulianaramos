import React, { useEffect, useState } from 'react';
import { generateCapiPayload, hashData } from './metaParameterSetup';

function SobremesasPage({ onNavigateHome }) {
  const [showFab, setShowFab] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [fbclid, setFbclid] = useState('');

  // 1. Scroll Handler for FAB
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-sobremesas');
      if (hero) {
        setShowFab(window.scrollY > hero.offsetHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Dynamic Brazilian Date Formatter for Urgency Bars & Tracking
  useEffect(() => {
    // Unique Visitor ID
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

    // Font Dancing Script
    if (!document.getElementById('dancing-script')) {
      const link = document.createElement('link');
      link.id = 'dancing-script';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap';
      document.head.appendChild(link);
    }

    const today = new Date();
    const options = { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(today);
    const elems = document.querySelectorAll('.live-date-val');
    elems.forEach(el => { el.textContent = formattedDate; });

    // FAQ Accordion Interaction
    const toggles = document.querySelectorAll('.faq-toggle-sobremesas');
    const handleClick = (e) => {
      const btn = e.currentTarget;
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = !content.classList.contains('hidden');

      document.querySelectorAll('.faq-content-sobremesas').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon-sobremesas').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isExpanded) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    };

    toggles.forEach(btn => btn.addEventListener('click', handleClick));
    return () => {
      toggles.forEach(btn => btn.removeEventListener('click', handleClick));
    };
  }, []);

  // Handle Checkout Click
  const handleCheckoutClick = async (e, baseUrl, planName, price) => {
    if (e && e.preventDefault) e.preventDefault();
    let uid = localStorage.getItem('user_unique_id') || visitorId;
    let currentFbclid = localStorage.getItem('fbclid') || fbclid;
    
    const hashedUid = await hashData(uid);
    const checkoutEventId = 'evt_' + Date.now() + '_ic';

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

    const capiPayload = generateCapiPayload('InitiateCheckout', checkoutEventId, {
      external_id: [hashedUid]
    }, {
      currency: 'BRL',
      value: price
    });
    console.log('CAPI Payload (InitiateCheckout Sobremesas):', capiPayload);

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
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = finalUrl;
    }
  };

  return (
    <div className="bg-[#fdfaf5] text-[#2b2523] antialiased flex flex-col min-h-screen">
      {/* 1. Header de Urgência */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#1a9e38] shadow-md">
        <div className="text-white py-3 px-4 text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] animate-pulse">alarm</span>
          <p className="text-[13px] sm:text-[14px] font-extrabold tracking-tight">
            A promoção de Sobremesas de Natal acaba no dia <span className="live-date-val underline">28/09/2026</span>
          </p>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-14 pb-36 bg-[#fdfaf5]">
        <div className="flex flex-col w-full">

          {/* 2. Hero Section */}
          <section id="hero-sobremesas" className="px-4 pt-6 pb-10 md:pt-16 md:pb-20 flex flex-col items-center text-center bg-[#fdfaf5]">
            <div className="max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-6 md:gap-x-16 md:gap-y-0">
              
              {/* Left Column: Headline & Price */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-start-1 md:row-start-1 w-full">
                <div className="inline-flex items-center gap-1.5 bg-[#d83a18] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm mb-3">
                  <span>🎄 EDIÇÃO ESPECIAL DE NATAL</span>
                </div>
                
                <h1 className="text-[28px] sm:text-[34px] md:text-[42px] leading-[1.15] text-[#c02f23] font-black tracking-tight mb-2">
                  + 90 Sobremesas Natalinas com <span className="text-[#e86b24]">Recheios Cremosos</span> <span style={{fontFamily: "'Dancing Script', cursive"}} className="text-[#1a9e38] text-[32px] sm:text-[40px] md:text-[50px] inline-block font-bold">Sem Precisar de Fogão</span>
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-3 mb-3 text-[#9a4b27] text-[15px] md:text-[17px] font-serif italic font-bold">
                  <span className="w-10 h-[1px] bg-[#d7ae9c]"></span>
                  <span>com a Chef Ju</span>
                  <span className="w-10 h-[1px] bg-[#d7ae9c]"></span>
                </div>

                {/* Preço de R$10 */}
                <div className="flex flex-col items-center md:items-start mb-3 w-full">
                  <span className="text-[#d32f2f] font-bold text-[14px] sm:text-[16px]">De <span className="line-through">R$47</span> por apenas</span>
                  <span className="text-[#1a9e38] font-black text-[42px] sm:text-[50px] md:text-[58px] leading-none tracking-tighter mt-0.5">R$10</span>
                </div>
              </div>

              {/* Right Column: Hero Image (Chef Ju segurando o livro com as taças) */}
              <div className="w-full relative max-w-[340px] md:max-w-[450px] mb-6 md:mb-0 md:col-start-2 md:row-start-1 md:row-span-2 self-center flex justify-center">
                <img 
                  alt="+ 90 Sobremesas Natalinas Sem Fogo Chef Ju" 
                  width="750" 
                  height="750" 
                  fetchpriority="high" 
                  decoding="async" 
                  className="w-full h-auto rounded-3xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500 border border-[#e8d8cb]" 
                  src="./code_files/hero_sobremesas.webp" 
                />
              </div>

              {/* Subheadline & CTA */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-start-1 md:row-start-2 w-full">
                <p className="font-medium text-[15px] md:text-[17px] leading-relaxed text-[#5a4843] max-w-[340px] md:max-w-[440px] mx-auto md:mx-0 mb-6">
                  Mais de 90 receitas de sobremesas cremosas para completar sua Ceia de Natal. Taças, travessas, pavês e mousses perfeitas, sem passar calor na cozinha e sem risco de empelotar.
                </p>

                <a 
                  className="w-full max-w-[340px] md:max-w-[400px] h-[64px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[20px] md:text-[22px] font-black uppercase tracking-wide shadow-[0_8px_20px_rgba(26,158,56,0.3)] active:scale-95 transition-transform" 
                  href="#ofertas"
                >
                  <span className="material-symbols-outlined text-[28px]">lock</span>
                  <span>QUERO MEU ACESSO</span>
                </a>
                <span className="text-[12px] md:text-[14px] font-bold text-[#8c7b77] flex items-center justify-center md:justify-start gap-1 mt-4 w-full md:max-w-[400px]">
                  <span className="material-symbols-outlined text-[15px] md:text-[18px]">verified_user</span>
                  Compra 100% segura • Acesso vitalício
                </span>
              </div>

            </div>

            {/* 4 Selos de Destaque da Imagem */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mt-8 w-full">
              {[
                { icon: "soup_kitchen", title: "SEM FOGO", desc: "Recheios cremosos sem precisar cozinhar" },
                { icon: "check_circle", title: "RECEITAS TESTADAS", desc: "Combinações que funcionam de verdade" },
                { icon: "menu_book", title: "PASSO A PASSO", desc: "Simples, rápido e muito fácil de seguir" },
                { icon: "star", title: "MAIS DE 90 RECEITAS", desc: "Para deixar sua ceia ainda mais especial" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-[#ecd9cd] shadow-sm flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-[#1a9e38] text-[28px] mb-1">{item.icon}</span>
                  <h4 className="font-black text-[13px] md:text-[14px] text-[#c02f23] uppercase mb-0.5">{item.title}</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>

          </section>

          {/* 3. Carrossel de Fichas e Entregáveis das Sobremesas */}
          <section className="py-10 bg-[#f4ebe1]">
            <div className="px-4 mb-6 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 text-[#1a9e38] font-bold text-[12px] uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Passo a Passo Visual Sem Fogão</span>
              </div>
              <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2">
                Confira as Fichas de Sobremesa por Dentro
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#6d5b54] max-w-sm md:max-w-2xl mx-auto">
                Cada receita traz medidas certas, ponto correto do creme gelado e montagem camada por camada com fotos de dar água na boca.
              </p>
            </div>

            {/* Horizontal Swipe Carousel de Fichas */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-4 md:gap-6 px-4 md:px-6 max-w-5xl mx-auto pb-6 snap-x snap-mandatory">
              
              {/* Sheet 1 */}
              <div className="min-w-[260px] max-w-[270px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-2xl shadow-md p-3 md:p-4 flex flex-col flex-shrink-0 hover:shadow-lg transition-shadow border border-[#e8d8cb]">
                <img 
                  alt="Taça da Felicidade de Morango com Ninho" 
                  width="500" 
                  height="500" 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full rounded-xl object-cover aspect-square shadow-sm mb-2" 
                  src="./code_files/ficha_sobremesa_1.webp" 
                />
                <span className="text-[11px] text-[#1a9e38] font-black uppercase">Ficha 01</span>
                <h3 className="text-[16px] text-[#2b2523] font-bold line-clamp-1">Taça da Felicidade de Morango</h3>
                <p className="text-[12px] text-[#6d5b54] line-clamp-2 mt-0.5">Camadas de morango fresco, creme aveludado de ninho sem fogo e farofinha crocante.</p>
              </div>

              {/* Sheet 2 */}
              <div className="min-w-[260px] max-w-[270px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-2xl shadow-md p-3 md:p-4 flex flex-col flex-shrink-0 hover:shadow-lg transition-shadow border border-[#e8d8cb]">
                <img 
                  alt="Pavê Trufado Especial de Chocolate" 
                  width="500" 
                  height="500" 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full rounded-xl object-cover aspect-square shadow-sm mb-2" 
                  src="./code_files/ficha_sobremesa_2.webp" 
                />
                <span className="text-[11px] text-[#1a9e38] font-black uppercase">Ficha 02</span>
                <h3 className="text-[16px] text-[#2b2523] font-bold line-clamp-1">Pavê Trufado de Chocolate</h3>
                <p className="text-[12px] text-[#6d5b54] line-clamp-2 mt-0.5">Creme de chocolate trufado sem panela, biscoito umedecido e raspas nobres.</p>
              </div>

              {/* Sheet 3 */}
              <div className="min-w-[260px] max-w-[270px] snap-center bg-white rounded-2xl shadow-md p-3 flex flex-col flex-shrink-0 border border-[#e8d8cb]">
                <img 
                  alt="Bombom de Uva e Morango na Travessa" 
                  width="500" 
                  height="500" 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full rounded-xl object-cover aspect-square shadow-sm mb-2" 
                  src="./code_files/ficha_sobremesa_3.webp" 
                />
                <span className="text-[11px] text-[#1a9e38] font-black uppercase">Ficha 03</span>
                <h3 className="text-[16px] text-[#2b2523] font-bold line-clamp-1">Bombom na Travessa</h3>
                <p className="text-[12px] text-[#6d5b54] line-clamp-2 mt-0.5">Uvas verdes Thompson e morangos sob creme branco aveludado e ganache brilhante.</p>
              </div>

              {/* Sheet 4 */}
              <div className="min-w-[260px] max-w-[270px] snap-center bg-white rounded-2xl shadow-md p-3 flex flex-col flex-shrink-0 border border-[#e8d8cb]">
                <img 
                  alt="Taça Cremosa de Maracujá Sem Fogão" 
                  width="500" 
                  height="500" 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full rounded-xl object-cover aspect-square shadow-sm mb-2" 
                  src="./code_files/ficha_sobremesa_4.webp" 
                />
                <span className="text-[11px] text-[#1a9e38] font-black uppercase">Ficha 04</span>
                <h3 className="text-[16px] text-[#2b2523] font-bold line-clamp-1">Taça Cremosa de Maracujá</h3>
                <p className="text-[12px] text-[#6d5b54] line-clamp-2 mt-0.5">Equilíbrio perfeito do azedinho do maracujá com recheio doce e raspas de chocolate.</p>
              </div>

            </div>
          </section>

          {/* 4. Depoimentos Estilo WhatsApp Natalino das Sobremesas */}
          <section className="px-4 py-12 md:py-20 bg-white" id="depoimentos">
            <div className="text-center max-w-sm md:max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="inline-flex items-center gap-1 text-[#1a9e38] font-bold text-[12px] uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Conversas Reais no WhatsApp</span>
              </div>
              <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2 md:mb-4">
                Quem Fez, Amou e Recebeu Elogios
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#666] max-w-sm md:max-w-2xl mx-auto">
                Veja as mensagens e fotos enviadas pelas alunas após prepararem suas sobremesas cremosas para a família:
              </p>
            </div>

            {/* Carrossel de Prints WhatsApp com as 3 novas imagens geradas */}
            <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-4 md:gap-8 pb-6 snap-x snap-mandatory max-w-5xl mx-auto">
              
              {/* Depoimento 1 (Camila) */}
              <div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-2xl shadow-lg border border-[#e8d8cb] overflow-hidden flex flex-col flex-shrink-0 hover:shadow-xl transition-shadow">
                <div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[13px] font-bold">Camila Silveira</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">Taça da Felicidade</span>
                </div>
                <div className="p-1.5 bg-[#efeae2]/50">
                  <img 
                    alt="Depoimento WhatsApp Camila sobre sobremesa sem fogão" 
                    width="500" 
                    height="800" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto rounded-xl object-contain shadow-inner" 
                    src="./code_files/depoimento_whats_1.webp" 
                  />
                </div>
                <div className="p-2.5 bg-[#fbf6f0] text-center">
                  <p className="text-[12px] text-[#c02f23] font-bold">“A família inteira raspou a travessa!”</p>
                </div>
              </div>

              {/* Depoimento 2 (Juliana) */}
              <div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-2xl shadow-lg border border-[#e8d8cb] overflow-hidden flex flex-col flex-shrink-0 hover:shadow-xl transition-shadow">
                <div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[13px] font-bold">Juliana Rocha</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">Pavê Trufado</span>
                </div>
                <div className="p-1.5 bg-[#efeae2]/50">
                  <img 
                    alt="Depoimento WhatsApp Juliana Rocha sobre pavê cremoso" 
                    width="500" 
                    height="800" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto rounded-xl object-contain shadow-inner" 
                    src="./code_files/depoimento_whats_2.webp" 
                  />
                </div>
                <div className="p-2.5 bg-[#fbf6f0] text-center">
                  <p className="text-[12px] text-[#c02f23] font-bold">“Nunca tinha acertado um creme tão aveludado!”</p>
                </div>
              </div>

              {/* Depoimento 3 (Mariana) */}
              <div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-2xl shadow-lg border border-[#e8d8cb] overflow-hidden flex flex-col flex-shrink-0 hover:shadow-xl transition-shadow">
                <div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[13px] font-bold">Mariana Costa</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">Tacinhas na Ceia</span>
                </div>
                <div className="p-1.5 bg-[#efeae2]/50">
                  <img 
                    alt="Depoimento WhatsApp Mariana Costa sobre tacinhas individuais" 
                    width="500" 
                    height="800" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto rounded-xl object-contain shadow-inner" 
                    src="./code_files/depoimento_whats_3.webp" 
                  />
                </div>
                <div className="p-2.5 bg-[#fbf6f0] text-center">
                  <p className="text-[12px] text-[#c02f23] font-bold">“Parece de confeitaria fina e sem ir ao fogo!”</p>
                </div>
              </div>

            </div>
          </section>

          {/* 5. Este livro é perfeito para quem quer */}
          <section className="px-4 py-8 md:py-16 bg-[#fdf8f5]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-8 md:mb-12 text-center">
                Este livro de sobremesas é perfeito para quem quer:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  "Preparar sobremesas cremosas sem passar horas na frente do fogão mexendo panela",
                  "Encantar a família inteira na Ceia de Natal com doces dignos de vitrine de confeitaria",
                  "Acertar o ponto perfeito de recheios aveludados que não desandam e não empelotam",
                  "Economizar tempo e dinheiro comprando ingredientes simples em qualquer mercado",
                  "Montar taças da felicidade e travessas fartas para receber amigos e parentes",
                  "Criar memórias afetivas inesquecíveis na noite de Natal",
                  "Ter opções práticas que podem ser feitas no dia anterior ou de última hora",
                  "Mais de 90 receitas testadas e aprovadas para consultar sempre que quiser"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-white p-4 md:p-6 rounded-2xl border border-[#f0e4d8] shadow-sm hover:shadow-md transition-shadow">
                    <span className="material-symbols-outlined text-[#1a9e38] text-[24px] shrink-0 mt-0.5 font-bold">check_circle</span>
                    <span className="text-[#333] font-semibold text-[15px] md:text-[17px] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Showcase do Conteúdo (+90 receitas...) */}
          <section className="px-4 py-10 md:py-20 bg-[#fefbf7]">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
              
              {/* Left Column */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="mb-3">
                  <div className="text-[54px] md:text-[80px] font-black text-[#c02f23] leading-none mb-1">+90</div>
                  <h2 className="text-[22px] md:text-[36px] font-extrabold text-[#5a4843] leading-tight mb-4">
                    sobremesas cremosas, taças e <span style={{fontFamily: "'Dancing Script', cursive"}} className="text-[#1a9e38] text-[30px] md:text-[46px]">recheios sem fogo</span> da Chef Ju!
                  </h2>
                </div>

                <p className="text-[14px] md:text-[18px] font-extrabold text-[#5a4843] mb-5 md:mb-8">
                  Tudo fácil, rápido e com texturas irresistíveis para a sua Ceia de Natal
                </p>

                <a href="#ofertas" className="w-full max-w-[340px] md:max-w-[400px] h-[54px] md:h-[64px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[17px] md:text-[20px] font-black uppercase tracking-wide shadow-[0_6px_18px_rgba(26,158,56,0.3)] active:scale-95 transition-transform hidden md:flex">
                  QUERO TODAS AS 90 RECEITAS
                </a>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col items-center w-full">
                <div className="w-full max-w-[340px] md:max-w-[450px] mb-6">
                  <img 
                    src="./code_files/hero_sobremesas.webp" 
                    width="700" 
                    height="700" 
                    loading="lazy" 
                    decoding="async" 
                    alt="Conteúdo +90 Sobremesas Natalinas da Chef Ju" 
                    className="w-full h-auto rounded-3xl shadow-xl object-contain hover:scale-105 transition-transform duration-500 border border-[#ecd9cd]" 
                  />
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[340px] sm:max-w-full mb-6 md:mb-0">
                  {[
                    { icon: "🍓", text: "Taças da Felicidade de Morango" },
                    { icon: "🍫", text: "Pavês Trufados e Cremosos" },
                    { icon: "🍇", text: "Bombons de Travessa com Frutas" },
                    { icon: "🍮", text: "Mousses Geladas e Aveludadas" },
                    { icon: "🍨", text: "Sobremesas Individuais na Taça" },
                    { icon: "🥥", text: "Delícias de Abacaxi e Coco" },
                    { icon: "✨", text: "Recheios Frios Sem Fogão" },
                    { icon: "🎄", text: "Sobremesas Temáticas de Natal" }
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

          {/* 7. Receitas em Destaque na Ceia */}
          <section className="px-4 py-12 md:py-20 bg-[#f4ebe1]" id="receitas">
            <div className="text-center max-w-md md:max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="inline-flex items-center gap-1.5 bg-[#e8f5e9] text-[#1a9e38] px-3 py-1 rounded-full shadow-sm mb-2 md:mb-4">
                <span className="material-symbols-outlined text-[15px]">cake</span>
                <span className="text-[12px] uppercase tracking-wider font-bold">Sobremesas em Destaque</span>
              </div>
              <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2 md:mb-4">
                Veja algumas das delícias que você poderá preparar no Natal
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#6d5b54]">
                Texturas sedosas, camadas perfeitas e recheios frios que encantam os olhos e conquistam o paladar de todos:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-md md:max-w-5xl mx-auto">
              
              <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#e8d8cb]">
                <img alt="Taça da Felicidade de Morango e Ninho" width="500" height="500" loading="lazy" decoding="async" className="w-full aspect-square object-cover" src="./code_files/review_sobremesa_1.webp" />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h4 className="text-[14px] md:text-[16px] text-[#c02f23] font-bold leading-tight mb-1">TAÇA DE MORANGO & NINHO</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-snug">Camadas generosas de creme aveludado, morangos e farofinha especial.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#e8d8cb]">
                <img alt="Pavê Trufado Cremoso Natalino" width="500" height="500" loading="lazy" decoding="async" className="w-full aspect-square object-cover" src="./code_files/review_sobremesa_2.webp" />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h4 className="text-[14px] md:text-[16px] text-[#c02f23] font-bold leading-tight mb-1">PAVÊ TRUFADO CREMOSO</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-snug">Creme de chocolate trufado sem ir ao fogo e com raspas generosas.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#e8d8cb]">
                <img alt="Bombom de Uva na Travessa" width="500" height="500" loading="lazy" decoding="async" className="w-full aspect-square object-cover" src="./code_files/review_sobremesa_3.webp" />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h4 className="text-[14px] md:text-[16px] text-[#c02f23] font-bold leading-tight mb-1">BOMBOM DE UVA NA TRAVESSA</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-snug">Uvas verdes sob creme branco aveludado e cobertura de ganache crocante.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#e8d8cb]">
                <img alt="Mousse Aveludada de Maracujá" width="500" height="500" loading="lazy" decoding="async" className="w-full aspect-square object-cover" src="./code_files/review_sobremesa_4.webp" />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h4 className="text-[14px] md:text-[16px] text-[#c02f23] font-bold leading-tight mb-1">MOUSSE DE MARACUJÁ REAL</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-snug">Textura aerada e calda brilhante com sementinhas e hortelã fresca.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#e8d8cb]">
                <img alt="Delícia Gelada de Abacaxi com Coco" width="500" height="500" loading="lazy" decoding="async" className="w-full aspect-square object-cover" src="./code_files/review_sobremesa_5.webp" />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h4 className="text-[14px] md:text-[16px] text-[#c02f23] font-bold leading-tight mb-1">DELÍCIA DE ABACAXI & COCO</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-snug">Combinação tropical refrescante com coco tostado e cerejas natalinas.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#e8d8cb]">
                <img alt="Tacinhas Individuais Gourmet" width="500" height="500" loading="lazy" decoding="async" className="w-full aspect-square object-cover" src="./code_files/review_sobremesa_6.webp" />
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h4 className="text-[14px] md:text-[16px] text-[#c02f23] font-bold leading-tight mb-1">TACINHAS INDIVIDUAIS</h4>
                  <p className="text-[11px] md:text-[12px] text-[#666] leading-snug">Porções individuais elegantes que deixam a mesa da ceia impecável.</p>
                </div>
              </div>

            </div>
          </section>

          {/* Botão de Ancoragem antes dos Bônus */}
          <div className="w-full max-w-md mx-auto py-6 px-4 text-center">
            <a href="#ofertas" className="w-full h-[56px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[17px] font-black uppercase tracking-wide shadow-[0_6px_20px_rgba(26,158,56,0.3)] active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[24px]">lock</span>
              <span>QUERO GARANTIR MEU DESCONTO</span>
            </a>
          </div>

          {/* 8. Bônus Inclusos */}
          <section className="px-4 py-10 md:py-20 bg-[#fdf8f3]" id="bonus">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 bg-[#d83a18] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm mb-3">
                <span>🎁 PRESENTE ESPECIAL</span>
              </div>

              <div className="flex items-center justify-center gap-3 mb-2 text-[#c02f23] text-[12px] font-extrabold uppercase tracking-widest">
                <span className="w-8 h-[1px] bg-[#e0c4b8]"></span>
                <span>DE BRINDE</span>
                <span className="w-8 h-[1px] bg-[#e0c4b8]"></span>
              </div>

              <h2 className="text-[26px] leading-[1.15] text-[#c02f23] font-black tracking-tight max-w-sm mx-auto text-center mb-8">
                Ao comprar hoje você ganha três bônus exclusivos
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-md md:max-w-5xl mx-auto mb-8 items-stretch">
                {[
                  {
                    tag: "BÔNUS 1",
                    title: "Guia Especial de Sobremesas na Taça de Ano Novo",
                    desc: "Receitas douradas com espumante, frutas amarelas e tacinhas individuais para brindar o Réveillon.",
                    img: "./code_files/bonus_ano_novo.webp",
                    originalPrice: "37,00"
                  },
                  {
                    tag: "BÔNUS 2",
                    title: "Lista Inteligente de Ingredientes e Substituições",
                    desc: "Checklist para comprar as melhores marcas gastando menos e trocas inteligentes sem perder a cremosidade.",
                    img: "./code_files/unnamed(12).webp",
                    originalPrice: "29,00"
                  },
                  {
                    tag: "BÔNUS 3",
                    title: "Etiquetas & Marcadores Natalinos Imprimíveis",
                    desc: "Tags elegantes para identificar cada sobremesa na mesa da ceia e presentear potinhos de lembrança.",
                    img: "./code_files/unnamed(13).webp",
                    originalPrice: "25,00"
                  }
                ].map((bonus, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-4 shadow-md border-2 border-[#f2e6dc] flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-[#d83a18] text-white text-[10px] font-black uppercase px-3 py-1 rounded-br-xl shadow-sm z-10">
                      {bonus.tag}
                    </div>

                    <div className="w-full max-w-[220px] h-[170px] my-3 overflow-hidden rounded-xl shadow-sm flex items-center justify-center bg-[#faf6f2]">
                      <img src={bonus.img} alt={bonus.title} width="500" height="386" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-xl" />
                    </div>

                    <h4 className="text-[15px] font-black text-[#1c3a27] leading-tight mb-1.5 px-2">
                      {bonus.title}
                    </h4>

                    <p className="text-[12px] text-[#666] leading-relaxed mb-4 px-2">
                      {bonus.desc}
                    </p>

                    <div className="flex items-center justify-center gap-2 border-t border-[#f2e6dc] w-full pt-3 mt-auto">
                      <span className="text-[12px] text-[#c02f23] line-through font-bold">R$ {bonus.originalPrice}</span>
                      <span className="bg-[#e8f5e9] text-[#1a9e38] text-[12px] font-black px-3 py-0.5 rounded-full inline-flex items-center gap-1">
                        ✓ GRÁTIS
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#fff7f2] border-2 border-[#f5dcd2] rounded-2xl p-3.5 max-w-md md:max-w-3xl mx-auto text-center shadow-sm">
                <p className="text-[13px] sm:text-[14px] font-black text-[#c02f23] flex items-center justify-center gap-1.5 flex-wrap uppercase tracking-tight">
                  <span>💚</span>
                  <span>VALOR TOTAL DOS BÔNUS → TUDO GRÁTIS HOJE!</span>
                </p>
              </div>
            </div>
          </section>

          {/* 9. Seção de Planos & Checkout */}
          <section className="px-4 py-12 md:py-20 bg-[#f4ebe1] text-[#2b2523]" id="ofertas">
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
              <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2 md:mb-4">
                Selecione a opção que combina melhor com você
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#666] mb-6 md:mb-10 max-w-xs md:max-w-md">
                Acesso imediato e vitalício a todas as receitas e bônus da Chefe Ju
              </p>

              {/* Cards Lado a Lado no Mobile */}
              <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-8 mb-6 md:mb-10 text-left items-stretch max-w-md md:max-w-3xl mx-auto">
                
                {/* Card 1: Oferta Básica */}
                <div className="bg-white text-[#2b2523] rounded-2xl p-2.5 shadow-md border-2 border-[#e1bfbb] flex flex-col justify-between relative">
                  <div>
                    <div className="inline-flex items-center justify-center gap-0.5 bg-[#ffedea] text-[#c02f23] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 w-full text-center">
                      <span className="material-symbols-outlined text-[11px]">bolt</span>
                      <span>OFERTA BÁSICA</span>
                    </div>

                    <h3 className="text-[13px] font-black text-[#c02f23] text-center mb-2.5 leading-tight">
                      +90 Sobremesas Sem Fogo
                    </h3>

                    <div className="flex flex-col gap-1.5 mb-3 text-[11px] leading-tight text-[#444]">
                      <div className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
                        <span>90 Receitas de Sobremesas Cremosas</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
                        <span>Recheios Práticos Sem Levar ao Fogão</span>
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

                  <div className="border-t border-[#f0dcd6] pt-2.5 flex flex-col items-center text-center mt-auto">
                    <span className="text-[9px] text-[#c02f23] line-through font-bold block">De R$ 47,00 por apenas</span>
                    <div className="text-[28px] font-black text-[#1a9e38] leading-none my-1">R$ 10</div>
                    <a 
                      className="w-full py-2.5 px-1 rounded-xl bg-[#1a9e38] text-white text-[11px] font-extrabold text-center block shadow-md active:scale-95 transition-transform uppercase tracking-wider cursor-pointer"
                      href="https://lastlink.com/p/C3FE05EB8/checkout-payment/"
                      onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/C3FE05EB8/checkout-payment/', 'Oferta Básica Sobremesas R$ 10', 10)}
                    >
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>

                {/* Card 2: Super Oferta */}
                <div className="bg-white text-[#2b2523] rounded-2xl p-2.5 shadow-xl border-2 border-[#1a9e38] flex flex-col justify-between relative pt-3">
                  <div className="absolute -top-2.5 right-1.5 bg-[#1a9e38] text-white text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md z-20 flex items-center gap-0.5">
                    <span>★ MAIS VENDIDA</span>
                  </div>

                  <div>
                    <div className="inline-flex items-center justify-center gap-0.5 bg-[#e86b24] text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 w-full text-center">
                      <span className="material-symbols-outlined text-[11px]">whatshot</span>
                      <span>SUPER OFERTA</span>
                    </div>

                    <h3 className="text-[13px] font-black text-[#c02f23] text-center mb-2.5 leading-tight">
                      +165 Sobremesas & Doces VIP
                    </h3>

                    <div className="flex flex-col gap-1.5 mb-2 text-[11px] leading-tight text-[#444]">
                      <div className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
                        <span>165 Receitas de Sobremesas & Doces Premium</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
                        <span>Taças, Travessas e Sobremesas Individuais</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
                        <span>Recheios Nobres Sem Fogão</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38] font-bold shrink-0 mt-0.5">check</span>
                        <span>Acesso Vitalício</span>
                      </div>
                    </div>

                    <div className="bg-[#fff8f6] border border-[#f0c8c2] rounded-lg p-1.5 mb-2">
                      <span className="text-[9px] font-black text-[#c02f23] uppercase tracking-wider block text-center mb-1">
                        BÔNUS EXCLUSIVOS!
                      </span>
                      <div className="flex flex-col gap-1 text-[9.5px] leading-tight text-[#444]">
                        <div className="flex items-start gap-1">
                          <span>🎁</span>
                          <span>Guia de Sobremesas na Taça de Ano Novo</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span>🎁</span>
                          <span>Lista Inteligente de Ingredientes</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span>🎁</span>
                          <span>Etiquetas Natalinas Imprimíveis</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#f0dcd6] pt-2.5 flex flex-col items-center text-center mt-auto">
                    <span className="text-[9px] text-[#c02f23] line-through font-bold block">De R$ 87,00 por apenas</span>
                    <div className="text-[28px] font-black text-[#1a9e38] leading-none my-1">R$ 18</div>
                    <a 
                      className="w-full py-2.5 px-1 rounded-xl bg-[#1a9e38] text-white text-[11px] font-extrabold text-center block shadow-md active:scale-95 transition-transform uppercase tracking-wider animate-pulse cursor-pointer"
                      href="https://lastlink.com/p/CF56C7F34/checkout-payment/"
                      onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/CF56C7F34/checkout-payment/', 'Super Oferta Sobremesas +165 Receitas VIP', 18)}
                    >
                      COMPRAR AGORA
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* 10. Avaliações com 3.500+ Alunas que Fizeram as Sobremesas */}
          <section className="px-4 py-10 md:py-20 bg-[#fdfaf5]" id="avaliacoes">
            <div className="max-w-5xl mx-auto">
              
              <div className="text-center mb-6">
                <div className="text-[58px] font-black text-[#1a9e38] leading-none mb-1 tracking-tight">
                  3.500+
                </div>
                <h3 className="text-[20px] font-extrabold text-[#333] leading-tight mb-2">
                  famílias já <span style={{fontFamily: "'Dancing Script', cursive"}} className="text-[#c02f23] text-[28px]">provaram</span> e aprovaram na ceia
                </h3>
                <p className="text-[13px] text-[#666] leading-relaxed max-w-xs mx-auto">
                  Pessoas que já preparam sobremesas mais cremosas, fáceis e elogiadas sem precisar passar calor no fogão.
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

              {/* Grid com as 6 novas fotos de receitas das alunas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                {[
                  {
                    name: "Ana M.",
                    date: "14 de dezembro de 2025",
                    avatarBg: "bg-[#e53935]",
                    initials: "AM",
                    comment: "Fiz a sobremesa na véspera de Natal aqui em casa na cozinha mesmo, tirei foto com o celular na hora! Ficou maravilhosa, o creme sem fogão é super prático e não empelotou nada.",
                    img: "./code_files/aluna_cozinha_real.webp",
                    likes: 42
                  },
                  {
                    name: "Juliana S.",
                    date: "25 de dezembro de 2025",
                    avatarBg: "bg-[#43a047]",
                    initials: "JS",
                    comment: "Olha como ficou o meu pavê trufado na mesa da ceia! Coloquei os pratos e as taças ao redor, todo mundo ficou doido querendo saber a receita. Super rápido de fazer!",
                    img: "./code_files/aluna_foto_pave.webp",
                    likes: 38
                  },
                  {
                    name: "Camila F.",
                    date: "28 de dezembro de 2025",
                    avatarBg: "bg-[#8e24aa]",
                    initials: "CF",
                    comment: "Mandei a foto no grupo da família e no zap da Chef Ju! As camadas de morango com o creme aveludado ficaram perfeitas na taça grande, não sobrou um pedaço sequer.",
                    img: "./code_files/aluna_foto_taca.webp",
                    likes: 56
                  },
                  {
                    name: "Patricia R.",
                    date: "19 de dezembro de 2025",
                    avatarBg: "bg-[#fb8c00]",
                    initials: "PR",
                    comment: "Fiz as tacinhas individuais na bandeja como a Ju ensinou. Ficou super delicado e prático para servir as crianças e os parentes na ceia!",
                    img: "./code_files/aluna_foto_tacinhas.webp",
                    likes: 64
                  },
                  {
                    name: "Renata B.",
                    date: "22 de dezembro de 2025",
                    avatarBg: "bg-[#039be5]",
                    initials: "RB",
                    comment: "Tirei essa foto tirando a primeira colherada da travessa para vocês verem a cremosidade. É inacreditável que não vai ao fogo, fica um veludo!",
                    img: "./code_files/aluna_colher_sobremesa.webp",
                    likes: 49
                  },
                  {
                    name: "Larissa C.",
                    date: "24 de dezembro de 2025",
                    avatarBg: "bg-[#d81b60]",
                    initials: "LC",
                    comment: "Minha travessa Marinex ficou pesada de tanto recheio gostoso! Segui a receita passo a passo em menos de 20 minutos e já deixei gelando pra noite de Natal.",
                    img: "./code_files/aluna_marinex_close.webp",
                    likes: 51
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
                        <img src={rev.img} alt={`Sobremesa de ${rev.name}`} width="500" height="375" loading="lazy" decoding="async" className="w-full h-full object-cover" />
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

              {/* Seção de Garantia de 15 Dias */}
              <div className="bg-[#fffcf7] border-2 border-[#e8d8cb] rounded-3xl p-5 md:p-10 shadow-xl max-w-md md:max-w-4xl mx-auto text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-1 bg-[#e0f2fe] text-[#0284c7] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span>
                  <span>RISCO ZERO</span>
                </div>

                <h3 className="text-[20px] font-black text-[#1c3a27] leading-tight mb-3">
                  Experimente sem preocupações por 15 dias
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <img src="./code_files/JkRnpY1.webp" alt="Garantia Incondicional de 15 Dias" width="200" height="200" loading="lazy" decoding="async" className="w-28 h-auto object-contain shrink-0 mx-auto" />
                  <p className="text-[12px] text-[#555] leading-relaxed text-left sm:text-left">
                    Você poderá acessar o guia completo de sobremesas, conhecer todas as receitas sem fogão e verificar como é simples de preparar. Caso sinta que não valeu a pena dentro de <strong className="text-[#c02f23]">15 dias</strong>, poderá solicitar o reembolso integral sem burocracia.
                  </p>
                </div>

                <a href="#ofertas" className="w-full py-3.5 px-4 rounded-xl bg-[#1a9e38] text-white text-[15px] font-black uppercase tracking-wider block shadow-lg shadow-[#1a9e38]/30 active:scale-95 transition-transform text-center">
                  QUERO AS 90 RECEITAS DE SOBREMESAS
                </a>
              </div>

            </div>
          </section>

          {/* 11. FAQ Sobremesas */}
          <section className="px-4 py-10 md:py-20" id="faq">
            <div className="text-center max-w-sm md:max-w-2xl mx-auto mb-8 md:mb-12">
              <span className="text-[12px] text-[#888] uppercase tracking-wider font-bold block mb-1">
                Tire Suas Dúvidas
              </span>
              <h2 className="text-[28px] md:text-[36px] leading-[1.1] text-[#c02f23] font-black tracking-tight mb-2">
                Perguntas Frequentes
              </h2>
            </div>
            <div className="flex flex-col gap-2.5 md:gap-4 max-w-md md:max-w-3xl mx-auto" id="faq-accordion-sobremesas">
              
              <div className="bg-[#f5ece4] rounded-xl overflow-hidden shadow-sm">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#2b2523] faq-toggle-sobremesas" type="button">
                  <span>As sobremesas realmente não precisam ir ao fogão?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-sobremesas text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-sobremesas text-[#555] text-[13px]">
                  Sim! Todas as receitas foram criadas com o método exclusivo da Chef Ju com recheios frios, emulsões práticas no liquidificador ou batedeira, e bases que ganham ponto de corte e cremosidade aveludada na geladeira sem precisar queimar o braço na beira do fogão.
                </div>
              </div>

              <div className="bg-[#f5ece4] rounded-xl overflow-hidden shadow-sm">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#2b2523] faq-toggle-sobremesas" type="button">
                  <span>Qual a diferença entre o pacote de R$ 10 e o de R$ 18?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-sobremesas text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-sobremesas text-[#555] text-[13px]">
                  O Pacote Básico (R$ 10,00) contém o Guia Principal com todas as mais de 90 receitas de sobremesas cremosas de Natal sem fogão. O Pacote VIP (R$ 18,00) inclui além do guia principal, todos os 3 bônus exclusivos: o Guia de Sobremesas na Taça de Ano Novo, a Lista Inteligente de Ingredientes e Substituições, e as Etiquetas Natalinas Decorativas para imprimir.
                </div>
              </div>

              <div className="bg-[#f5ece4] rounded-xl overflow-hidden shadow-sm">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#2b2523] faq-toggle-sobremesas" type="button">
                  <span>Como recebo o acesso ao material?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-sobremesas text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-sobremesas text-[#555] text-[13px]">
                  Imediatamente após a confirmação do pagamento! Você recebe um e-mail com o link de download e acesso para abrir em qualquer celular, tablet ou computador.
                </div>
              </div>

              <div className="bg-[#f5ece4] rounded-xl overflow-hidden shadow-sm">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#2b2523] faq-toggle-sobremesas" type="button">
                  <span>Sou iniciante na cozinha, vou conseguir fazer?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-sobremesas text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-sobremesas text-[#555] text-[13px]">
                  Com certeza! O material foi feito exatamente para quem não tem prática e não quer errar o ponto. As instruções são diretas ao ponto, com fotos e dicas para a sobremesa ficar linda de primeira.
                </div>
              </div>

              <div className="bg-[#f5ece4] rounded-xl overflow-hidden shadow-sm">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#2b2523] faq-toggle-sobremesas" type="button">
                  <span>Por quanto tempo terei acesso?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-sobremesas text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-sobremesas text-[#555] text-[13px]">
                  O seu acesso é vitalício! Você poderá consultar as receitas neste Natal, no Réveillon e em todas as confraternizações dos próximos anos.
                </div>
              </div>

            </div>
          </section>

          {/* Botão Final */}
          <div className="w-full max-w-md mx-auto pt-6 pb-10 px-4 text-center">
            <a href="#ofertas" className="w-full h-[60px] rounded-full bg-[#1a9e38] text-white flex items-center justify-center gap-2 text-[18px] font-black uppercase tracking-wide shadow-[0_8px_24px_rgba(26,158,56,0.35)] active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[26px]">lock</span>
              <span>QUERO MEU ACESSO AGORA</span>
            </a>
            <span className="text-[12px] font-bold text-[#8c7b77] flex items-center justify-center gap-1 mt-3">
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              Compra 100% segura • Garantia de 15 dias • Acesso imediato
            </span>
          </div>

        </div>
      </main>

      {/* FAB */}
      {showFab && (
        <a href="#ofertas" className="fixed bottom-4 right-4 z-50 bg-[#1a9e38] text-white p-3 rounded-full shadow-2xl flex items-center justify-center animate-bounce">
          <span className="material-symbols-outlined text-[28px]">lock</span>
        </a>
      )}

      {/* Modal Upsell */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[#888] p-1">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="inline-flex items-center gap-1 bg-[#ffedea] text-[#c02f23] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>OFERTA ESPECIAL!</span>
            </div>
            <h3 className="text-[20px] text-[#c02f23] font-black mb-2">Espera! Que tal levar TUDO?</h3>
            <p className="text-[13px] text-[#555] mb-5">
              Por apenas mais <strong className="text-[#1a9e38] text-[16px]">R$ 4,50</strong> (Total: R$ 14,50), você leva o pacote <strong className="text-[#c02f23] font-extrabold">COMPLETO</strong> com +165 receitas de sobremesas & doces natalinos e todos os 3 bônus!
            </p>
            <a 
              href="https://lastlink.com/p/CF56C7F34/checkout-payment/" 
              className="w-full py-3.5 px-4 rounded-xl bg-[#1a9e38] text-white text-[13px] font-black block shadow-md shadow-[#1a9e38]/30 active:scale-95 transition-transform uppercase mb-3 text-center cursor-pointer"
              onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/CF56C7F34/checkout-payment/', 'Super Oferta Sobremesas +165 Receitas VIP', 18)}
            >
              Quero o Pacote Completo
            </a>
            <a 
              href="https://lastlink.com/p/C3FE05EB8/checkout-payment/" 
              className="w-full py-2 px-4 text-[12px] text-[#888] font-bold block underline text-center cursor-pointer"
              onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/C3FE05EB8/checkout-payment/', 'Oferta Básica Sobremesas R$ 10', 10)}
            >
              Não, quero apenas o básico por R$ 10,00
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

export default SobremesasPage;
