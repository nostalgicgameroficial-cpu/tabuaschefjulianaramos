import React, { useEffect, useState } from 'react';
import { generateCapiPayload, hashData } from './metaParameterSetup';

function CaseirinhosPage({ onNavigateHome }) {
  const [showFab, setShowFab] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [fbclid, setFbclid] = useState('');

  // 1. Scroll Handler for FAB
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-caseirinhos');
      if (hero) {
        setShowFab(window.scrollY > hero.offsetHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Dynamic Brazilian Date Formatter & Tracking
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

    // Font Dancing Script & Outfit / Poppins feel
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
    const toggles = document.querySelectorAll('.faq-toggle-caseirinhos');
    const handleClick = (e) => {
      const btn = e.currentTarget;
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = !content.classList.contains('hidden');

      document.querySelectorAll('.faq-content-caseirinhos').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon-caseirinhos').forEach(i => i.style.transform = 'rotate(0deg)');

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

  // Handle Checkout Click with Tracking
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
    console.log('CAPI Payload (InitiateCheckout Caseirinhos):', capiPayload);

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
    <div className="bg-[#fffbf5] text-[#2c1d11] antialiased flex flex-col min-h-screen font-sans">
      
      {/* 1. Header de Urgência & Renda Extra */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#c2410c] shadow-md">
        <div className="text-white py-2.5 px-4 text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[17px] animate-pulse">trending_up</span>
          <p className="text-[12px] sm:text-[14px] font-black tracking-tight">
            🔥 Nova Turma de Renda Extra: Vagas com desconto especial encerram hoje (<span className="live-date-val underline">16/10/2026</span>)
          </p>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-14 pb-36 bg-[#fffbf5]">
        <div className="flex flex-col w-full">

          {/* 2. Hero Section com Chef Ju Apontando para os Caseirinhos */}
          <section id="hero-caseirinhos" className="px-4 pt-6 pb-12 md:pt-16 md:pb-20 flex flex-col items-center text-center bg-gradient-to-b from-[#fef5ea] via-[#fffbf5] to-[#fffbf5] relative overflow-hidden">
            
            {/* Adesivos Flutuantes de Fundo com visual 3D */}
            <div className="absolute -top-6 -left-10 w-28 md:w-36 opacity-30 md:opacity-40 pointer-events-none rotate-[-15deg] filter drop-shadow-xl hidden sm:block">
              <img src="./code_files/caseirinho_adesivo_cenoura.webp" alt="Sticker decorativo mini bolo" className="w-full" />
            </div>
            <div className="absolute top-20 -right-8 w-28 md:w-40 opacity-30 md:opacity-40 pointer-events-none rotate-[18deg] filter drop-shadow-xl hidden sm:block">
              <img src="./code_files/caseirinho_adesivo_redvelvet.webp" alt="Sticker decorativo caseirinho" className="w-full" />
            </div>

            <div className="max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-2 items-center justify-center gap-6 md:gap-x-12 md:gap-y-0 relative z-10">
              
              {/* Left Column: Headline & Price */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-start-1 md:row-start-1 w-full">
                
                {/* Badge Renda Extra de Natal */}
                <div className="inline-flex items-center gap-1.5 bg-[#ea580c] text-white text-[10.5px] sm:text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm mb-3">
                  <span>🎄 ESPECIAL DE NATAL: RENDA EXTRA COM CASEIRINHOS</span>
                </div>
                
                <h1 className="text-[23px] xs:text-[26px] sm:text-[34px] md:text-[42px] leading-[1.18] text-[#3e1f0e] font-black tracking-tight mb-2.5">
                  Descubra + de 120 Receitas Rápidas de <span className="text-[#ea580c]">Caseirinhos Lucrativos</span> para <span className="text-[#059669]">Faturar Muito Neste Natal! 🎄</span>
                </h1>

                <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3 text-[#854d0e] text-[13.5px] sm:text-[15px] md:text-[16px] font-serif italic font-bold">
                  <span className="w-8 sm:w-10 h-[1px] bg-[#d97706]/40"></span>
                  <span>com a Chef Ju</span>
                  <span className="w-8 sm:w-10 h-[1px] bg-[#d97706]/40"></span>
                </div>

                {/* Preço de R$ 14 */}
                <div className="flex flex-col items-center md:items-start mb-3 w-full">
                  <span className="text-[#c2410c] font-bold text-[13px] sm:text-[15px]">De <span className="line-through">R$67</span> por apenas</span>
                  <span className="text-[#059669] font-black text-[42px] sm:text-[50px] md:text-[58px] leading-none tracking-tighter mt-0.5">R$14</span>
                </div>

              </div>

              {/* Right Column: Hero Image (Chef Ju com a foto real apontando para os Caseirinhos) */}
              <div className="w-full relative max-w-[320px] sm:max-w-[360px] md:max-w-[450px] mb-4 md:mb-0 md:col-start-2 md:row-start-1 md:row-span-2 self-center flex justify-center">
                <div className="relative">
                  <img 
                    alt="+120 Caseirinhos e Mini Bolos Lucrativos Chef Ju" 
                    width="750" 
                    height="750" 
                    fetchpriority="high" 
                    decoding="async" 
                    className="w-full h-auto rounded-3xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-500 border border-[#ecd9cd]" 
                    src="./code_files/hero_caseirinhos.webp" 
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#059669] text-white text-[10px] sm:text-[11.5px] font-black uppercase px-3 py-1 rounded-full shadow-lg border border-white/90 whitespace-nowrap flex items-center gap-1.5">
                    <span>🎅</span>
                    <span>Lucro Imediato Neste Fim de Ano</span>
                  </div>
                </div>
              </div>

              {/* Subheadline & CTA */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-start-1 md:row-start-2 w-full mt-2 md:mt-0">
                <p className="font-medium text-[13.5px] sm:text-[15px] md:text-[17px] leading-relaxed text-[#5c3e2e] max-w-[340px] md:max-w-[440px] mx-auto md:mx-0 mb-4 sm:mb-5">
                  Aprenda massas fofinhas e o método com <strong>recheios aveludados sem levar ao fogão</strong>: processo muito mais fácil, 3x mais rápido, sem passar calor na panela. Custo de R$ 2,00 e venda por R$ 15,00 para lucrar mais de 600% neste fim de ano.
                </p>

                <a 
                  className="w-full max-w-[340px] sm:max-w-[400px] min-h-[56px] sm:min-h-[64px] py-3.5 px-4 rounded-full bg-[#059669] text-white flex items-center justify-center gap-2 text-[16px] sm:text-[19px] font-black uppercase tracking-wide shadow-[0_8px_20px_rgba(5,150,105,0.3)] active:scale-95 transition-transform text-center" 
                  href="#ofertas"
                >
                  <span className="material-symbols-outlined text-[24px] sm:text-[28px]">lock</span>
                  <span>QUERO MEU ACESSO</span>
                </a>
                <span className="text-[12px] md:text-[14px] font-bold text-[#854d0e] flex items-center justify-center md:justify-start gap-1 mt-3 w-full md:max-w-[400px]">
                  <span className="material-symbols-outlined text-[15px] md:text-[18px]">verified_user</span>
                  Compra 100% segura • Acesso vitalício
                </span>
              </div>

            </div>

            {/* 4 Selos de Lucro e Vantagens */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 max-w-4xl mx-auto mt-8 sm:mt-10 w-full relative z-10">
              {[
                { icon: "soup_kitchen", title: "SEM FOGO", desc: "Recheios frios sem panela: mais fácil e rápido" },
                { icon: "attach_money", title: "LUCRO DE +600%", desc: "Gaste R$ 2,00 por bolo e venda por R$ 15,00" },
                { icon: "takeout_dining", title: "EMBALAGENS QUE VENDEM", desc: "Apresentação em blister e hambúrguer irresistível" },
                { icon: "schedule", title: "VENDA RÁPIDA", desc: "Perfeito para vender a pronta entrega no WhatsApp" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3 sm:p-3.5 rounded-2xl border-2 border-[#fed7aa]/60 shadow-md flex flex-col items-center text-center hover:border-[#ea580c] transition-colors">
                  <span className="material-symbols-outlined text-[#ea580c] text-[26px] sm:text-[30px] mb-1">{item.icon}</span>
                  <h4 className="font-black text-[12px] sm:text-[13px] md:text-[14px] text-[#3e1f0e] uppercase mb-0.5">{item.title}</h4>
                  <p className="text-[10.5px] sm:text-[11px] md:text-[12px] text-[#78350f] leading-tight font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Destaque do Mecanismo Único: Recheios Sem Levar ao Fogão */}
            <div className="w-full max-w-4xl mx-auto mt-6 bg-gradient-to-r from-[#fff7ed] via-white to-[#ecfdf5] border-2 border-[#ea580c]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[28px] sm:text-[32px]">soup_kitchen</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[#ea580c] text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider mb-0.5">
                    <span>⚡ MECANISMO ÚNICO & EXCLUSIVO</span>
                  </div>
                  <h3 className="text-[16px] sm:text-[18px] md:text-[19px] font-black text-[#3e1f0e] leading-snug">
                    Recheios Cremosos Sem Levar ao Fogão!
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-[#6b4226] leading-tight">
                    Esqueça passar calor na beira do fogão mexendo panela quente. Recheios aveludados que não queimam, não empelotam, economizam seu gás e aceleram sua produção em até 3x.
                  </p>
                </div>
              </div>
              <div className="shrink-0 w-full sm:w-auto">
                <span className="bg-[#059669] text-white text-[12px] font-black px-4 py-2 rounded-full uppercase tracking-wide shadow-sm inline-block w-full sm:w-auto text-center">
                  Processo Fácil & Rápido
                </span>
              </div>
            </div>

            {/* Checklist dos 5 Entregáveis Principais */}
            <div className="w-full max-w-4xl mx-auto mt-6 bg-white border-2 border-[#059669] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-[#059669] text-white text-[10px] sm:text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm mb-3">
                <span>📦 TUDO O QUE VOCÊ VAI RECEBER</span>
              </div>
              
              <h3 className="text-[19px] sm:text-[23px] font-black text-[#3e1f0e] mb-3.5">
                O Pacote Completo Para Começar a Faturar Hoje:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[13px] sm:text-[15px] font-bold text-[#3e1f0e]">
                <div className="flex items-center gap-2 bg-[#f0fdf4] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#bbf7d0]">
                  <span className="text-[18px]">✅</span>
                  <span>120 receitas de caseirinhos</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f0fdf4] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#bbf7d0]">
                  <span className="text-[18px]">✅</span>
                  <span>100 recheios irresistíveis (sem fogo)</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f0fdf4] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#bbf7d0]">
                  <span className="text-[18px]">✅</span>
                  <span>50 massas de bolo fofinhas e lucrativas</span>
                </div>
                <div className="flex items-center gap-2 bg-[#f0fdf4] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#bbf7d0]">
                  <span className="text-[18px]">✅</span>
                  <span>Apostila de precificação (saiba quanto cobrar)</span>
                </div>
                <div className="flex items-center gap-2 bg-[#fef2f2] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-[#fecaca] sm:col-span-2">
                  <span className="text-[18px]">🎄</span>
                  <span>Receitas especiais para o Natal</span>
                </div>
              </div>
            </div>

          </section>

          {/* 3. Seção com os Adesivos 3D Colados na Página (Visual Diferente e Único) */}
          <section className="py-10 md:py-16 bg-[#fbf4ec] relative overflow-hidden">
            <div className="px-4 mb-6 sm:mb-8 flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-[#ea580c] bg-[#ffedd5] px-3 py-1 rounded-full font-black text-[11px] sm:text-[12px] uppercase tracking-wider mb-2 border border-[#fed7aa]">
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                <span>Os Modelos Mais Desejados e Vendidos</span>
              </div>
              
              <h2 className="text-[26px] sm:text-[34px] md:text-[38px] leading-[1.12] text-[#3e1f0e] font-black tracking-tight mb-2">
                Conheça os Caseirinhos que Fizeram Nossas Alunas Faturarem
              </h2>
              
              <p className="text-[13px] sm:text-[15px] md:text-[16px] text-[#6b4226] max-w-xl mx-auto font-medium">
                Fotos reais dos mini bolos prontos para entrega. As pessoas compram com os olhos e encomendam toda semana:
              </p>
            </div>

            {/* Grid dos 4 Adesivos 3D Responsivo: 2 Colunas no Mobile para visual de catálogo moderno */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-6 max-w-5xl mx-auto">
              
              {/* Adesivo 1: Red Velvet */}
              <div className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_8px_24px_rgba(100,40,15,0.10)] border border-[#fcd34d]/50 flex flex-col items-center text-center relative hover:scale-105 transition-all duration-300">
                <div className="absolute -top-2.5 sm:-top-3 right-1 sm:-right-2 bg-[#e11d48] text-white text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
                  REQUINTE
                </div>
                
                {/* 3D Sticker Image com Efeito Colado */}
                <div className="w-full aspect-square flex items-center justify-center p-1 sm:p-2 mb-2 sm:mb-3">
                  <img 
                    alt="Caseirinho Red Velvet Frutas Vermelhas Adesivo 3D" 
                    width="450" 
                    height="450" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto object-contain filter drop-shadow-[0_8px_14px_rgba(180,40,40,0.22)] group-hover:scale-105 transition-transform duration-300" 
                    src="./code_files/caseirinho_adesivo_redvelvet.webp" 
                  />
                </div>

                <span className="text-[9.5px] sm:text-[11px] text-[#ea580c] font-black uppercase tracking-wider mb-0.5">Fórmula 01</span>
                <h3 className="text-[13px] sm:text-[17px] text-[#3e1f0e] font-black leading-tight mb-1 line-clamp-1 sm:line-clamp-none">Red Velvet Vermelhas</h3>
                <p className="text-[10.5px] sm:text-[12px] text-[#6b4226] mb-2 sm:mb-3 leading-snug line-clamp-2">Massa rubi com cream cheese brilhante e morangos frescos.</p>
                
                <div className="mt-auto pt-2 border-t border-[#fed7aa]/50 w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[12px]">
                  <span className="text-[#888] font-bold">Custo: <strong className="text-[#3e1f0e]">R$ 2,40</strong></span>
                  <span className="text-[#059669] font-black bg-[#ecfdf5] px-1.5 sm:px-2 py-0.5 rounded-md">Venda: R$ 16</span>
                </div>
              </div>

              {/* Adesivo 2: Ninho & Morango Vulcão */}
              <div className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_8px_24px_rgba(100,40,15,0.10)] border border-[#fcd34d]/50 flex flex-col items-center text-center relative hover:scale-105 transition-all duration-300">
                <div className="absolute -top-2.5 sm:-top-3 right-1 sm:-right-2 bg-[#d97706] text-white text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
                  MAIS VENDIDO
                </div>

                <div className="w-full aspect-square flex items-center justify-center p-1 sm:p-2 mb-2 sm:mb-3">
                  <img 
                    alt="Mini Bolo Vulcão Leite Ninho e Morango Adesivo 3D" 
                    width="450" 
                    height="450" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto object-contain filter drop-shadow-[0_8px_14px_rgba(180,100,20,0.22)] group-hover:scale-105 transition-transform duration-300" 
                    src="./code_files/caseirinho_adesivo_ninho.webp" 
                  />
                </div>

                <span className="text-[9.5px] sm:text-[11px] text-[#ea580c] font-black uppercase tracking-wider mb-0.5">Fórmula 02</span>
                <h3 className="text-[13px] sm:text-[17px] text-[#3e1f0e] font-black leading-tight mb-1 line-clamp-1 sm:line-clamp-none">Vulcão Ninho & Nutella</h3>
                <p className="text-[10.5px] sm:text-[12px] text-[#6b4226] mb-2 sm:mb-3 leading-snug line-clamp-2">Creme aveludado de Ninho que escorre no corte com Nutella.</p>
                
                <div className="mt-auto pt-2 border-t border-[#fed7aa]/50 w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[12px]">
                  <span className="text-[#888] font-bold">Custo: <strong className="text-[#3e1f0e]">R$ 2,10</strong></span>
                  <span className="text-[#059669] font-black bg-[#ecfdf5] px-1.5 sm:px-2 py-0.5 rounded-md">Venda: R$ 15</span>
                </div>
              </div>

              {/* Adesivo 3: Meio a Meio / Bento Burger */}
              <div className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_8px_24px_rgba(100,40,15,0.10)] border border-[#fcd34d]/50 flex flex-col items-center text-center relative hover:scale-105 transition-all duration-300">
                <div className="absolute -top-2.5 sm:-top-3 right-1 sm:-right-2 bg-[#059669] text-white text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
                  HAMBÚRGUER
                </div>

                <div className="w-full aspect-square flex items-center justify-center p-1 sm:p-2 mb-2 sm:mb-3">
                  <img 
                    alt="Caseirinho Meio a Meio Dois Amores Adesivo 3D" 
                    width="450" 
                    height="450" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto object-contain filter drop-shadow-[0_8px_14px_rgba(50,30,10,0.22)] group-hover:scale-105 transition-transform duration-300" 
                    src="./code_files/caseirinho_adesivo_meioameio.webp" 
                  />
                </div>

                <span className="text-[9.5px] sm:text-[11px] text-[#ea580c] font-black uppercase tracking-wider mb-0.5">Fórmula 03</span>
                <h3 className="text-[13px] sm:text-[17px] text-[#3e1f0e] font-black leading-tight mb-1 line-clamp-1 sm:line-clamp-none">Dois Amores Meio a Meio</h3>
                <p className="text-[10.5px] sm:text-[12px] text-[#6b4226] mb-2 sm:mb-3 leading-snug line-clamp-2">Brigadeiro belga e leite em pó na caixinha térmica.</p>
                
                <div className="mt-auto pt-2 border-t border-[#fed7aa]/50 w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[12px]">
                  <span className="text-[#888] font-bold">Custo: <strong className="text-[#3e1f0e]">R$ 1,95</strong></span>
                  <span className="text-[#059669] font-black bg-[#ecfdf5] px-1.5 sm:px-2 py-0.5 rounded-md">Venda: R$ 15</span>
                </div>
              </div>

              {/* Adesivo 4: Cenoura Belga */}
              <div className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_8px_24px_rgba(100,40,15,0.10)] border border-[#fcd34d]/50 flex flex-col items-center text-center relative hover:scale-105 transition-all duration-300">
                <div className="absolute -top-2.5 sm:-top-3 right-1 sm:-right-2 bg-[#ca8a04] text-white text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10">
                  CLÁSSICO
                </div>

                <div className="w-full aspect-square flex items-center justify-center p-1 sm:p-2 mb-2 sm:mb-3">
                  <img 
                    alt="Mini Bolo Cenoura com Chocolate Belga Adesivo 3D" 
                    width="450" 
                    height="450" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto object-contain filter drop-shadow-[0_8px_14px_rgba(200,90,20,0.22)] group-hover:scale-105 transition-transform duration-300" 
                    src="./code_files/caseirinho_adesivo_cenoura.webp" 
                  />
                </div>

                <span className="text-[9.5px] sm:text-[11px] text-[#ea580c] font-black uppercase tracking-wider mb-0.5">Fórmula 04</span>
                <h3 className="text-[13px] sm:text-[17px] text-[#3e1f0e] font-black leading-tight mb-1 line-clamp-1 sm:line-clamp-none">Cenoura Vulcão Belga</h3>
                <p className="text-[10.5px] sm:text-[12px] text-[#6b4226] mb-2 sm:mb-3 leading-snug line-clamp-2">Cenoura fofinha com piscina farta de brigadeiro brilhante.</p>
                
                <div className="mt-auto pt-2 border-t border-[#fed7aa]/50 w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-[12px]">
                  <span className="text-[#888] font-bold">Custo: <strong className="text-[#3e1f0e]">R$ 1,80</strong></span>
                  <span className="text-[#059669] font-black bg-[#ecfdf5] px-1.5 sm:px-2 py-0.5 rounded-md">Venda: R$ 14</span>
                </div>
              </div>

            </div>
          </section>

          {/* 4. Simulador / Tabela da Renda Extra na Ponta do Lápis */}
          <section className="px-4 py-12 md:py-16 bg-[#fffbf5]">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#fff7ed] to-[#fef3c7] border-2 border-[#fcd34d] rounded-3xl p-5 md:p-8 shadow-xl text-center">
              
              <div className="inline-flex items-center gap-1.5 bg-[#059669] text-white px-3.5 py-1 rounded-full text-[12px] font-black uppercase mb-3 shadow-sm">
                <span>📊 SIMULADOR DE LUCRO REAL</span>
              </div>
              
              <h2 className="text-[26px] md:text-[34px] leading-tight text-[#3e1f0e] font-black mb-2">
                Quanto Você Pode Colocar no Bolso Todo Mês?
              </h2>
              <p className="text-[13px] md:text-[15px] text-[#78350f] max-w-lg mx-auto mb-6">
                Considerando um custo médio de R$ 2,00 e preço de venda sugerido de R$ 15,00 (Lucro de R$ 13,00 limpos por mini bolo):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                <div className="bg-white rounded-2xl p-4 border border-[#fed7aa] shadow-sm flex flex-col items-center">
                  <span className="text-[13px] font-bold text-[#888] uppercase">Ritmo Leve</span>
                  <div className="text-[20px] font-black text-[#ea580c] my-1">5 caseirinhos / dia</div>
                  <span className="text-[11px] text-[#666] mb-2">(Vendendo para vizinhos ou no trabalho)</span>
                  <div className="text-[28px] font-black text-[#059669] mt-auto">R$ 1.950,00</div>
                  <span className="text-[10px] text-[#059669] font-bold uppercase tracking-wider">Lucro Líquido no Mês</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border-2 border-[#ea580c] shadow-md flex flex-col items-center relative scale-105">
                  <div className="absolute -top-2.5 bg-[#ea580c] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    MAIS COMUM
                  </div>
                  <span className="text-[13px] font-bold text-[#ea580c] uppercase">Ritmo Moderado</span>
                  <div className="text-[20px] font-black text-[#ea580c] my-1">10 caseirinhos / dia</div>
                  <span className="text-[11px] text-[#666] mb-2">(WhatsApp e pronta entrega no condomínio)</span>
                  <div className="text-[32px] font-black text-[#059669] mt-auto">R$ 3.900,00</div>
                  <span className="text-[10px] text-[#059669] font-bold uppercase tracking-wider">Lucro Líquido no Mês</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#fed7aa] shadow-sm flex flex-col items-center">
                  <span className="text-[13px] font-bold text-[#888] uppercase">Ritmo Encomendas</span>
                  <div className="text-[20px] font-black text-[#ea580c] my-1">15 caseirinhos / dia</div>
                  <span className="text-[11px] text-[#666] mb-2">(Parcerias com salões, comércios e festas)</span>
                  <div className="text-[28px] font-black text-[#059669] mt-auto">R$ 5.850,00</div>
                  <span className="text-[10px] text-[#059669] font-bold uppercase tracking-wider">Lucro Líquido no Mês</span>
                </div>

              </div>

              <a 
                href="#ofertas" 
                className="inline-flex items-center justify-center gap-2 w-full max-w-md h-[54px] rounded-full bg-[#ea580c] text-white text-[16px] md:text-[18px] font-black uppercase tracking-wide shadow-lg shadow-[#ea580c]/30 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">payments</span>
                <span>QUERO ESSA RENDA EXTRA AGORA</span>
              </a>

            </div>
          </section>

          {/* 5. Depoimentos Estilo WhatsApp com Prints Reais Brasileiros */}
          <section className="px-4 py-12 md:py-20 bg-white" id="depoimentos">
            <div className="text-center max-w-sm md:max-w-2xl mx-auto mb-8 md:mb-12">
              <div className="inline-flex items-center gap-1 text-[#059669] bg-[#ecfdf5] px-3.5 py-1 rounded-full font-bold text-[12px] uppercase tracking-wider mb-2 border border-[#a7f3d0]">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Alunas que Começaram do Zero</span>
              </div>
              <h2 className="text-[28px] md:text-[36px] leading-[1.12] text-[#3e1f0e] font-black tracking-tight mb-2">
                Veja o que as Alunas Estão Falando no WhatsApp
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#666] max-w-lg mx-auto">
                Mensagens reais e fotos de produção enviadas direto para a Chef Ju após colocarem as receitas para vender:
              </p>
              <div className="inline-flex md:hidden items-center gap-1 text-[11px] font-black text-[#ea580c] bg-[#fff7ed] px-3 py-1 rounded-full border border-[#fed7aa] mt-2.5">
                <span>👉 Deslize para o lado para ver todos os depoimentos</span>
              </div>
            </div>

            {/* 3 Prints de WhatsApp Gerados */}
            <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-4 md:gap-8 pb-6 snap-x snap-mandatory max-w-5xl mx-auto">
              
              {/* Depoimento WhatsApp 1 (Tatiane) */}
              <div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-3xl shadow-xl border border-[#fed7aa] overflow-hidden flex flex-col flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[13px] font-bold">Tatiane Aluna Caseirinhos</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">12 vendidos hoje</span>
                </div>
                <div className="p-2 bg-[#efeae2]/50 flex-grow">
                  <img 
                    alt="Depoimento WhatsApp Tatiane sobre venda de caseirinhos" 
                    width="500" 
                    height="800" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto rounded-2xl object-contain shadow-inner" 
                    src="./code_files/depoimento_whats_caseirinho_1.webp" 
                  />
                </div>
                <div className="p-3 bg-[#fff7ed] text-center border-t border-[#fed7aa]/40">
                  <p className="text-[12px] text-[#ea580c] font-black">“Vendi tudo em meia hora no trabalho a R$ 15!”</p>
                </div>
              </div>

              {/* Depoimento WhatsApp 2 (Camila) */}
              <div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-3xl shadow-xl border border-[#fed7aa] overflow-hidden flex flex-col flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[13px] font-bold">Camila Aluna Bolos</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">26 encomendas</span>
                </div>
                <div className="p-2 bg-[#efeae2]/50 flex-grow">
                  <img 
                    alt="Depoimento WhatsApp Camila encomendas de mini bolos" 
                    width="500" 
                    height="800" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto rounded-2xl object-contain shadow-inner" 
                    src="./code_files/depoimento_whats_caseirinho_2.webp" 
                  />
                </div>
                <div className="p-3 bg-[#fff7ed] text-center border-t border-[#fed7aa]/40">
                  <p className="text-[12px] text-[#ea580c] font-black">“Fiz R$ 390 com nem R$ 50 de ingrediente!”</p>
                </div>
              </div>

              {/* Depoimento WhatsApp 3 (Renata) */}
              <div className="min-w-[270px] max-w-[290px] md:min-w-0 md:max-w-none md:w-full snap-center bg-white rounded-3xl shadow-xl border border-[#fed7aa] overflow-hidden flex flex-col flex-shrink-0 hover:shadow-2xl transition-shadow">
                <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[13px] font-bold">Renata Ateliê dos Bolos</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">40 fixas/semana</span>
                </div>
                <div className="p-2 bg-[#efeae2]/50 flex-grow">
                  <img 
                    alt="Depoimento WhatsApp Renata encomendas fixas de caseirinhos" 
                    width="500" 
                    height="800" 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-auto rounded-2xl object-contain shadow-inner" 
                    src="./code_files/depoimento_whats_caseirinho_3.webp" 
                  />
                </div>
                <div className="p-3 bg-[#fff7ed] text-center border-t border-[#fed7aa]/40">
                  <p className="text-[12px] text-[#ea580c] font-black">“Os clientes viciaram no Red Velvet e Dois Amores!”</p>
                </div>
              </div>

            </div>
          </section>

          {/* 6. Para quem é perfeito */}
          <section className="px-4 py-12 md:py-16 bg-[#fbf4ec]">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-[28px] md:text-[36px] leading-[1.12] text-[#3e1f0e] font-black tracking-tight mb-8 md:mb-12 text-center">
                Este Guia de Caseirinhos Lucrativos é Para Você Que:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[
                  "Precisa de uma renda extra rápida sem precisar sair de perto dos filhos ou da sua família",
                  "Quer começar a lucrar com confeitaria investindo menos de R$ 30 em ingredientes básicos",
                  "Está cansada de receitas da internet que murcham, solam ou ficam secas na embalagem",
                  "Quer aprender as coberturas vulcão perfeitas que continuam brilhantes e aveludadas por dias",
                  "Deseja um produto com margem de lucro real de mais de 600% que as pessoas compram sem reclamar do preço",
                  "Quer aprender a usar embalagens acessíveis (blister e marmitinha de hambúrguer) que valorizam o produto",
                  "Não tem experiência e nunca fez um bolo na vida, mas quer um passo a passo à prova de erros",
                  "Quer ter encomendas semanais garantidas vendendo pelo WhatsApp, vizinhança e comércios locais"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 bg-white p-4 md:p-5 rounded-2xl border border-[#fed7aa] shadow-sm hover:shadow-md transition-shadow">
                    <span className="material-symbols-outlined text-[#059669] text-[24px] shrink-0 mt-0.5 font-black">check_circle</span>
                    <span className="text-[#3e1f0e] font-semibold text-[14px] md:text-[16px] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Vitrine com +120 Sabores de Caseirinhos */}
          <section className="px-4 py-12 md:py-20 bg-white">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
              
              {/* Left Column */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="mb-3">
                  <div className="text-[54px] md:text-[76px] font-black text-[#ea580c] leading-none mb-1">+120</div>
                  <h2 className="text-[24px] md:text-[36px] font-black text-[#3e1f0e] leading-tight mb-3">
                    receitas de caseirinhos gourmet, 50 massas fofinhas e <span style={{fontFamily: "'Dancing Script', cursive"}} className="text-[#059669] text-[34px] md:text-[46px]">100 recheios sem fogo</span>!
                  </h2>
                </div>

                <p className="text-[15px] md:text-[17px] font-medium text-[#6b4226] mb-6">
                  Com o mecanismo de recheios frios sem ir ao fogão, você produz muito mais rápido, sem cansaço e sem desperdício de gás.
                </p>

                <a href="#ofertas" className="w-full max-w-[360px] h-[60px] rounded-full bg-[#ea580c] text-white flex items-center justify-center gap-2 text-[18px] font-black uppercase tracking-wide shadow-[0_8px_20px_rgba(234,88,12,0.35)] active:scale-95 transition-transform hidden md:flex">
                  QUERO TODAS AS RECEITAS
                </a>
              </div>

              {/* Right Column: Pills com Sabores */}
              <div className="flex-1 flex flex-col items-center w-full">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[360px] sm:max-w-full mb-6">
                  {[
                    { icon: "🍓", text: "Red Velvet com Frutas Vermelhas" },
                    { icon: "🍫", text: "Mini Vulcão Cenoura & Brigadeiro" },
                    { icon: "🥛", text: "Ninho Trufado com Morango" },
                    { icon: "❤️", text: "Dois Amores Meio a Meio" },
                    { icon: "🥥", text: "Prestígio Gourmet Cremoso" },
                    { icon: "🍋", text: "Mousse de Limão Siciliano" },
                    { icon: "🌰", text: "Churros com Doce de Leite Artesanal" },
                    { icon: "✨", text: "Mini Caseirinho Salgado & Café" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#fff7ed] border border-[#fed7aa] py-3 px-4 rounded-2xl text-center text-[13px] md:text-[14px] font-bold text-[#78350f] shadow-sm flex items-center justify-start gap-2.5 hover:shadow-md transition-shadow">
                      <span className="text-[18px]">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <a href="#ofertas" className="w-full max-w-sm h-[54px] rounded-full bg-[#ea580c] text-white flex items-center justify-center gap-2 text-[16px] sm:text-[17px] font-black uppercase tracking-wide shadow-lg shadow-[#ea580c]/30 active:scale-95 transition-transform md:hidden px-4 text-center">
                  QUERO TODAS AS RECEITAS
                </a>
              </div>

            </div>
          </section>

          {/* Botão de Ancoragem antes dos Bônus */}
          <div className="w-full max-w-md mx-auto py-4 px-4 text-center">
            <a href="#ofertas" className="w-full h-[56px] rounded-full bg-[#059669] text-white flex items-center justify-center gap-2 text-[16px] sm:text-[18px] font-black uppercase tracking-wide shadow-[0_6px_20px_rgba(5,150,105,0.3)] active:scale-95 transition-transform px-4">
              <span className="material-symbols-outlined text-[24px]">lock</span>
              <span>QUERO GARANTIR MEU DESCONTO</span>
            </a>
          </div>

          {/* 8. Bônus Exclusivos de Renda Extra */}
          <section className="px-4 py-12 md:py-20 bg-[#fffaf3]" id="bonus">
            <div className="max-w-5xl mx-auto text-center">
              
              <div className="inline-flex items-center gap-1.5 bg-[#ea580c] text-white text-[11px] font-black uppercase px-3.5 py-1 rounded-full shadow-sm mb-3">
                <span>🎁 PACOTE DE FERRAMENTAS DE LUCRO</span>
              </div>

              <h2 className="text-[26px] md:text-[36px] leading-[1.15] text-[#3e1f0e] font-black tracking-tight max-w-lg mx-auto text-center mb-3">
                Comprando Hoje Você Ganha Três Bônus de Presente
              </h2>

              <p className="text-[14px] md:text-[16px] text-[#78350f] max-w-md mx-auto mb-8 font-medium">
                Tudo o que você precisa para sair vendendo no mesmo dia sem ter dor de cabeça:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 max-w-md md:max-w-5xl mx-auto mb-8 items-stretch">
                
                {/* Bônus 1: Precificação */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-[#fed7aa] flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-[#ea580c] text-white text-[10px] font-black uppercase px-3 py-1 rounded-br-xl shadow-sm z-10">
                    BÔNUS 1
                  </div>
                  
                  <div className="w-full max-w-[240px] sm:max-w-[260px] h-[170px] sm:h-[180px] my-3 overflow-hidden rounded-2xl shadow-sm flex items-center justify-center bg-[#faf6f2]">
                    <img src="./code_files/bonus_caseirinhos_precificacao.webp" alt="Guia de Precificação & Custos na Ponta do Lápis" width="500" height="375" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-2xl" />
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-black text-[#3e1f0e] leading-tight mb-2">
                    Calculadora & Ficha de Precificação Descomplicada
                  </h4>
                  <p className="text-[12px] text-[#6b4226] leading-relaxed mb-4">
                    Saiba exatamente o custo de cada colher de farinha, embalagem e gás, garantindo mais de 600% de lucro líquido sem medo de errar a conta.
                  </p>

                  <div className="flex items-center justify-center gap-2 border-t border-[#fed7aa]/50 w-full pt-3 mt-auto">
                    <span className="text-[12px] text-[#999] line-through font-bold">R$ 47,00</span>
                    <span className="bg-[#ecfdf5] text-[#059669] text-[12px] font-black px-3 py-0.5 rounded-full">
                      ✓ GRÁTIS
                    </span>
                  </div>
                </div>

                {/* Bônus 2: Etiquetas & Tags Prontas */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-[#fed7aa] flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-[#ea580c] text-white text-[10px] font-black uppercase px-3 py-1 rounded-br-xl shadow-sm z-10">
                    BÔNUS 2
                  </div>

                  <div className="w-full max-w-[240px] sm:max-w-[260px] h-[170px] sm:h-[180px] my-3 overflow-hidden rounded-2xl shadow-sm flex items-center justify-center bg-[#faf6f2]">
                    <img src="./code_files/bonus_caseirinhos_etiquetas.webp" alt="Pack de Etiquetas e Tags Prontas para Imprimir" width="500" height="375" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-2xl" />
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-black text-[#3e1f0e] leading-tight mb-2">
                    Pack de Etiquetas e Tags Prontas para Imprimir
                  </h4>
                  <p className="text-[12px] text-[#6b4226] leading-relaxed mb-4">
                    Modelos redondos de adesivos "Feito com Amor", sabores e datas de validade prontinhos para imprimir na folha adesiva de qualquer impressora.
                  </p>

                  <div className="flex items-center justify-center gap-2 border-t border-[#fed7aa]/50 w-full pt-3 mt-auto">
                    <span className="text-[12px] text-[#999] line-through font-bold">R$ 37,00</span>
                    <span className="bg-[#ecfdf5] text-[#059669] text-[12px] font-black px-3 py-0.5 rounded-full">
                      ✓ GRÁTIS
                    </span>
                  </div>
                </div>

                {/* Bônus 3: Manual de Vendas no WhatsApp */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-[#fed7aa] flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-[#ea580c] text-white text-[10px] font-black uppercase px-3 py-1 rounded-br-xl shadow-sm z-10">
                    BÔNUS 3
                  </div>

                  <div className="w-full max-w-[240px] sm:max-w-[260px] h-[170px] sm:h-[180px] my-3 overflow-hidden rounded-2xl shadow-sm flex items-center justify-center bg-[#faf6f2]">
                    <img src="./code_files/bonus_caseirinhos_vendas.webp" alt="Roteiro de Vendas Rápidas no WhatsApp & Bairro" width="500" height="375" loading="lazy" decoding="async" className="w-full h-full object-cover rounded-2xl" />
                  </div>

                  <h4 className="text-[15px] sm:text-[16px] font-black text-[#3e1f0e] leading-tight mb-2">
                    Roteiro de Vendas Rápidas no WhatsApp & Bairro
                  </h4>
                  <p className="text-[12px] text-[#6b4226] leading-relaxed mb-4">
                    Textos prontos para você copiar e colar nos grupos de condomínio, status do WhatsApp e fechar encomendas comércios próximos.
                  </p>

                  <div className="flex items-center justify-center gap-2 border-t border-[#fed7aa]/50 w-full pt-3 mt-auto">
                    <span className="text-[12px] text-[#999] line-through font-bold">R$ 39,00</span>
                    <span className="bg-[#ecfdf5] text-[#059669] text-[12px] font-black px-3 py-0.5 rounded-full">
                      ✓ GRÁTIS
                    </span>
                  </div>
                </div>

              </div>

              <div className="bg-[#ecfdf5] border-2 border-[#a7f3d0] rounded-2xl p-3.5 max-w-md md:max-w-2xl mx-auto text-center shadow-sm">
                <p className="text-[13px] sm:text-[14px] font-black text-[#059669] flex items-center justify-center gap-1.5 flex-wrap uppercase tracking-tight">
                  <span>💰</span>
                  <span>TOTAL DE MAIS DE R$ 120 EM BÔNUS → 100% GRÁTIS HOJE!</span>
                </p>
              </div>

            </div>
          </section>

          {/* 9. Seção de Ofertas (Básico R$ 14 vs Completo R$ 27) */}
          <section className="px-4 py-12 md:py-20 bg-[#fbf4ec]" id="ofertas">
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
              
              <h2 className="text-[28px] md:text-[38px] leading-[1.12] text-[#3e1f0e] font-black tracking-tight mb-2 md:mb-3">
                Escolha a Opção Perfeita Para Começar a Lucrar
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#78350f] mb-8 md:mb-12 max-w-md font-medium">
                Acesso imediato e vitalício para você começar a faturar já nesta semana!
              </p>

              {/* Cards de Preço */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 text-left items-stretch max-w-md md:max-w-3xl mx-auto">
                
                {/* Card 1: Básico R$ 14 */}
                <div className="bg-white rounded-3xl p-5 shadow-lg border-2 border-[#fed7aa] flex flex-col justify-between relative">
                  <div>
                    <div className="inline-flex items-center justify-center gap-1 bg-[#ffedd5] text-[#ea580c] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 w-full text-center">
                      <span className="material-symbols-outlined text-[13px]">bolt</span>
                      <span>OFERTA BÁSICA</span>
                    </div>

                    <h3 className="text-[17px] font-black text-[#3e1f0e] text-center mb-3 leading-tight">
                      Guia Caseirinhos Essencial
                    </h3>

                    <div className="flex flex-col gap-2 mb-4 text-[12px] leading-snug text-[#5c3e2e]">
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>120 Receitas de Caseirinhos Lucrativos</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>100 Recheios Irresistíveis Sem Fogo</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>50 Massas Fofinhas e Rentáveis</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>Apostila de Precificação (Saiba Quanto Cobrar)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>Receitas Especiais para o Natal</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#fed7aa]/50 pt-4 flex flex-col items-center text-center mt-auto">
                    <span className="text-[11px] text-[#c2410c] line-through font-bold block">De R$ 67,00 por apenas</span>
                    <div className="text-[38px] font-black text-[#059669] leading-none my-1.5">R$ 14</div>
                    <a 
                      className="w-full py-4 px-3 min-h-[52px] rounded-2xl bg-[#059669] text-white text-[14px] sm:text-[15px] font-black text-center flex items-center justify-center gap-2 shadow-md shadow-[#059669]/25 active:scale-95 transition-transform uppercase tracking-wider cursor-pointer"
                      href="#checkout-basico"
                      onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/checkout-caseirinhos-basico/', 'Guia Caseirinhos Básico R$ 14', 14)}
                    >
                      <span>QUERO O BÁSICO (R$ 14)</span>
                    </a>
                  </div>
                </div>

                {/* Card 2: Completo R$ 27 (Destaque) */}
                <div className="bg-white rounded-3xl p-5 shadow-2xl border-3 border-[#ea580c] flex flex-col justify-between relative pt-6 ring-2 ring-[#ea580c]/20">
                  <div className="absolute -top-3.5 right-4 bg-[#ea580c] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                    <span>★ MAIS VENDIDO & LUCRATIVO</span>
                  </div>

                  <div>
                    <div className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-[#ea580c] to-[#d97706] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 w-full text-center">
                      <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                      <span>FORMAÇÃO COMPLETA VIP</span>
                    </div>

                    <h3 className="text-[17px] font-black text-[#3e1f0e] text-center mb-3 leading-tight">
                      Combo Caseirinhos Lucrativos VIP
                    </h3>

                    <div className="flex flex-col gap-2 mb-3 text-[12px] leading-snug text-[#5c3e2e]">
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span><strong>TUDO do Pacote Básico (+120 Receitas de Caseirinhos)</strong></span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>Guia de Montagens em Blister & Hambúrguer</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>Linha Gourmet Especial (Red Velvet, Ninho & Frutas)</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#059669] font-bold shrink-0 mt-0.5">check_circle</span>
                        <span>Acesso Vitalício + Atualizações</span>
                      </div>
                    </div>

                    {/* Destaque Bônus inclusos */}
                    <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-2.5 mb-3">
                      <span className="text-[10px] font-black text-[#ea580c] uppercase tracking-wider block text-center mb-1">
                        TODOS OS 3 BÔNUS INCLUSOS!
                      </span>
                      <div className="flex flex-col gap-1 text-[10.5px] leading-tight text-[#78350f]">
                        <div className="flex items-start gap-1">
                          <span>🎁</span>
                          <span>Calculadora & Ficha de Precificação Descomplicada</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span>🎁</span>
                          <span>Pack de Etiquetas e Tags Prontas para Imprimir</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span>🎁</span>
                          <span>Roteiro de Vendas Rápidas no WhatsApp</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#fed7aa]/50 pt-4 flex flex-col items-center text-center mt-auto">
                    <span className="text-[11px] text-[#c2410c] line-through font-bold block">De R$ 147,00 por apenas</span>
                    <div className="text-[38px] font-black text-[#ea580c] leading-none my-1.5">R$ 27</div>
                    <a 
                      className="w-full py-4 px-3 min-h-[54px] rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#d97706] text-white text-[14px] sm:text-[15px] font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-[#ea580c]/35 active:scale-95 transition-transform uppercase tracking-wider animate-pulse cursor-pointer"
                      href="#checkout-completo"
                      onClick={(e) => handleCheckoutClick(e, 'https://lastlink.com/p/checkout-caseirinhos-completo/', 'Combo Caseirinhos VIP Completo R$ 27', 27)}
                    >
                      <span>QUERO O COMPLETO VIP (R$ 27)</span>
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 10. Avaliações com Fotos Caseiras Reais das Alunas */}
          <section className="px-4 py-12 md:py-20 bg-[#fffbf5]" id="avaliacoes">
            <div className="max-w-5xl mx-auto">
              
              <div className="text-center mb-8">
                <div className="text-[52px] font-black text-[#ea580c] leading-none mb-1">4.9 / 5.0</div>
                <div className="flex justify-center text-[#eab308] text-[18px] my-1">
                  ★★★★★
                </div>
                <h3 className="text-[20px] font-black text-[#3e1f0e]">
                  Mais de 2.800 alunas já estão faturando com os mini bolos
                </h3>
                <p className="text-[13px] text-[#78350f] mt-1 max-w-sm mx-auto">
                  Veja fotos reais da produção caseira que nossas alunas compartilham na comunidade:
                </p>
              </div>

              {/* Grid com as 3 Fotos de Produção Real */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                
                {/* Review 1 */}
                <div className="bg-white rounded-3xl p-4 shadow-md border border-[#fed7aa] flex flex-col justify-between">
                  <div>
                    <div className="flex text-[#eab308] text-[13px] mb-2">★★★★★</div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#ea580c] text-white font-bold text-[12px] flex items-center justify-center shadow-sm">
                        MS
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#3e1f0e] leading-none">Marta Silveira</h4>
                        <span className="text-[10px] text-[#888]">São Paulo - SP</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#555] leading-relaxed mb-3">
                      “Gente, olha a minha bancada da pia! Fiz essa fornada de 6 caseirinhos ontem à tarde e vendi todos pros funcionários da UBS aqui perto. Custo baratíssimo e lucro de verdade!”
                    </p>
                  </div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-[#fafafa]">
                    <img 
                      src="./code_files/aluna_caseirinho_cozinha.webp" 
                      alt="Produção real de caseirinhos na cozinha" 
                      width="500" 
                      height="375" 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white rounded-3xl p-4 shadow-md border border-[#fed7aa] flex flex-col justify-between">
                  <div>
                    <div className="flex text-[#eab308] text-[13px] mb-2">★★★★★</div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#059669] text-white font-bold text-[12px] flex items-center justify-center shadow-sm">
                        JS
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#3e1f0e] leading-none">Juliana Santos</h4>
                        <span className="text-[10px] text-[#888]">Belo Horizonte - MG</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#555] leading-relaxed mb-3">
                      “Tirei foto tirando a primeira colherada pra mostrar a cobertura vulcão. O creme escorre na hora certa, é cremoso de verdade e não fica doce enjoativo. Minhas clientes amaram!”
                    </p>
                  </div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-[#fafafa]">
                    <img 
                      src="./code_files/aluna_caseirinho_mordida.webp" 
                      alt="Foto colherada caseirinho vulcão cremoso" 
                      width="500" 
                      height="375" 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* Review 3 */}
                <div className="bg-white rounded-3xl p-4 shadow-md border border-[#fed7aa] flex flex-col justify-between">
                  <div>
                    <div className="flex text-[#eab308] text-[13px] mb-2">★★★★★</div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#d97706] text-white font-bold text-[12px] flex items-center justify-center shadow-sm">
                        AP
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#3e1f0e] leading-none">Aline Pires</h4>
                        <span className="text-[10px] text-[#888]">Curitiba - PR</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#555] leading-relaxed mb-3">
                      “Coloquei as caixinhas de hambúrguer com o barbante de sisal e a tag que a Ju deu de bônus. Ficou parecendo confeitaria cara de shopping! Já tenho lista de espera!”
                    </p>
                  </div>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-[#fafafa]">
                    <img 
                      src="./code_files/aluna_caseirinho_caixa.webp" 
                      alt="Caseirinhos nas embalagens de hambúrguer com tag de presente" 
                      width="500" 
                      height="375" 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

              </div>

              {/* Garantia Incondicional de 15 Dias */}
              <div className="bg-white border-2 border-[#fed7aa] rounded-3xl p-6 md:p-10 shadow-xl max-w-md md:max-w-4xl mx-auto text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  <span>COMPRA 100% SEGURA</span>
                </div>

                <h3 className="text-[22px] font-black text-[#3e1f0e] leading-tight mb-3">
                  Garantia Incondicional de 15 Dias de Satisfação
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-5 mb-5">
                  <img src="./code_files/JkRnpY1.webp" alt="Garantia Incondicional de 15 Dias" width="180" height="180" loading="lazy" decoding="async" className="w-24 h-auto object-contain shrink-0 mx-auto" />
                  <p className="text-[13px] text-[#6b4226] leading-relaxed text-left sm:text-left font-medium">
                    Abra o guia, veja as receitas de mini bolos, use a planilha de precificação e teste na sua cozinha. Se você achar que o material não te ajudou ou não valeu a pena, basta nos enviar um e-mail dentro do prazo de <strong>15 dias</strong> e devolvemos 100% do seu dinheiro. Sem letras miúdas.
                  </p>
                </div>

                <a href="#ofertas" className="w-full py-4 px-4 rounded-full bg-[#ea580c] text-white text-[16px] font-black uppercase tracking-wider block shadow-lg shadow-[#ea580c]/30 active:scale-95 transition-transform text-center">
                  QUERO COMEÇAR COM RISCO ZERO
                </a>
              </div>

            </div>
          </section>

          {/* 11. FAQ Perguntas Frequentes */}
          <section className="px-4 py-12 md:py-20" id="faq">
            <div className="text-center max-w-sm md:max-w-2xl mx-auto mb-8 md:mb-12">
              <span className="text-[12px] text-[#ea580c] uppercase tracking-wider font-bold block mb-1">
                Tire Todas as Dúvidas
              </span>
              <h2 className="text-[28px] md:text-[36px] leading-[1.12] text-[#3e1f0e] font-black tracking-tight mb-2">
                Perguntas Frequentes sobre os Caseirinhos
              </h2>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 max-w-md md:max-w-3xl mx-auto" id="faq-accordion-caseirinhos">
              
              <div className="bg-[#fff7ed] rounded-2xl overflow-hidden shadow-sm border border-[#fed7aa]/50">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#3e1f0e] faq-toggle-caseirinhos" type="button">
                  <span>O custo de produção é realmente de apenas R$ 2,00?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-caseirinhos text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-caseirinhos text-[#6b4226] text-[13px]">
                  Sim! Como são mini bolos padronizados de tamanho individual (entre 12cm a 15cm ou embalagens bento/blister G640), uma única receita rende várias unidades. Comprando ingredientes comuns no atacado ou supermercado, o custo de massa, cobertura e embalagem fica entre R$ 1,80 e R$ 2,40 por unidade.
                </div>
              </div>

              <div className="bg-[#fff7ed] rounded-2xl overflow-hidden shadow-sm border border-[#fed7aa]/50">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#3e1f0e] faq-toggle-caseirinhos" type="button">
                  <span>Preciso de equipamentos industriais para começar?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-caseirinhos text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-caseirinhos text-[#6b4226] text-[13px]">
                  Não! Todas as receitas foram desenvolvidas para serem feitas com o fogão, forno e liquidificador ou fouet que você já tem em casa. Você pode começar hoje mesmo sem gastar um centavo em maquinário novo.
                </div>
              </div>

              <div className="bg-[#fff7ed] rounded-2xl overflow-hidden shadow-sm border border-[#fed7aa]/50">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#3e1f0e] faq-toggle-caseirinhos" type="button">
                  <span>Qual a diferença entre o pacote de R$ 14 e o de R$ 27?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-caseirinhos text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-caseirinhos text-[#6b4226] text-[13px]">
                  O Pacote Básico (R$ 14,00) contém o Guia Essencial com mais de 120 receitas de caseirinhos, massas fofinhas e coberturas vulcão. O Combo VIP (R$ 27,00) entrega a formação completa de renda extra, incluindo as montagens nas embalagens de hambúrguer e blister alto, mais todos os 3 bônus exclusivos: Calculadora de Precificação, Pack de Etiquetas Imprimíveis e o Manual de Vendas Rápidas no WhatsApp.
                </div>
              </div>

              <div className="bg-[#fff7ed] rounded-2xl overflow-hidden shadow-sm border border-[#fed7aa]/50">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#3e1f0e] faq-toggle-caseirinhos" type="button">
                  <span>Qual a validade dos caseirinhos prontos?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-caseirinhos text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-caseirinhos text-[#6b4226] text-[13px]">
                  Devidamente fechados na embalagem e refrigerados, a maioria dos sabores dura de 4 a 6 dias mantendo a massa úmida e fofinha. Sabores com frutas frescas como morango sugerimos consumo em até 48 horas. Você também aprende técnicas de congelamento de massas para agilizar a produção!
                </div>
              </div>

              <div className="bg-[#fff7ed] rounded-2xl overflow-hidden shadow-sm border border-[#fed7aa]/50">
                <button className="w-full p-4 flex items-center justify-between text-left gap-2 font-bold text-[#3e1f0e] faq-toggle-caseirinhos" type="button">
                  <span>Como recebo o acesso ao material?</span>
                  <span className="material-symbols-outlined transition-transform duration-200 faq-icon faq-icon-caseirinhos text-[#888]">expand_more</span>
                </button>
                <div className="px-4 pb-4 hidden faq-content-caseirinhos text-[#6b4226] text-[13px]">
                  O acesso é enviado imediatamente para o seu e-mail e WhatsApp assim que o pagamento for confirmado. O material é digital em formato PDF de alta resolução, pronto para abrir no celular, tablet ou imprimir.
                </div>
              </div>

            </div>
          </section>

          {/* Botão Final de Chamada para Ação */}
          <div className="w-full max-w-md mx-auto pt-4 pb-12 px-4 text-center">
            <a href="#ofertas" className="w-full h-[62px] rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#d97706] text-white flex items-center justify-center gap-2 text-[18px] font-black uppercase tracking-wide shadow-xl shadow-[#ea580c]/35 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[26px]">monetization_on</span>
              <span>QUERO MINHA RENDA EXTRA</span>
            </a>
            <span className="text-[12px] font-bold text-[#854d0e] flex items-center justify-center gap-1 mt-3">
              <span className="material-symbols-outlined text-[15px] text-[#059669]">verified_user</span>
              Compra 100% Segura • Garantia de 15 Dias • Acesso Imediato
            </span>
          </div>

        </div>
      </main>

      {/* Barra de Conversão Fixa no Rodapé para Mobile */}
      {showFab && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#fed7aa] p-2.5 px-4 shadow-[0_-6px_25px_rgba(0,0,0,0.12)] md:hidden flex items-center justify-between gap-3">
          <div className="flex flex-col text-left shrink-0">
            <span className="text-[10px] text-[#c2410c] font-black uppercase tracking-wider">Apenas Hoje</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-[#999] line-through font-bold">R$67</span>
              <span className="text-[22px] font-black text-[#059669] leading-none">R$14</span>
            </div>
          </div>
          <a 
            href="#ofertas" 
            className="flex-1 max-w-[240px] h-[48px] rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#059669] text-white flex items-center justify-center gap-1.5 text-[13.5px] font-black uppercase tracking-wider shadow-md shadow-[#ea580c]/30 active:scale-95 transition-transform text-center"
          >
            <span className="material-symbols-outlined text-[19px]">lock</span>
            <span>QUERO MEU ACESSO</span>
          </a>
        </div>
      )}

      {/* FAB Flutuante no Desktop */}
      {showFab && (
        <a href="#ofertas" className="hidden md:flex fixed bottom-6 right-6 z-50 bg-[#ea580c] text-white py-3 px-5 rounded-full shadow-2xl items-center gap-2 hover:bg-[#c2410c] hover:scale-105 transition-all font-black text-[14px] uppercase tracking-wider">
          <span className="material-symbols-outlined text-[24px]">monetization_on</span>
          <span>QUERO MEU ACESSO POR R$ 14</span>
        </a>
      )}

    </div>
  );
}

export default CaseirinhosPage;
