import React from 'react';

function HubPage({ onNavigate }) {
  return (
    <div className="bg-gradient-to-b from-[#fbf5ed] via-[#fffbf5] to-[#f7eee2] text-[#2c1d11] min-h-screen font-sans flex flex-col items-center">
      
      {/* 1. Header Profile Style Linktree */}
      <header className="w-full max-w-xl mx-auto pt-8 pb-4 px-4 flex flex-col items-center text-center">
        
        {/* Avatar com borda dourada e anel festivo */}
        <div className="relative mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#d97706] via-[#ea580c] to-[#059669] shadow-xl">
            <img 
              src="./code_files/chef_ju_profile.webp" 
              alt="Chef Juliana Ramos" 
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-[#059669] text-white p-1 rounded-full shadow-md border-2 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[15px]">verified</span>
          </div>
        </div>

        {/* Nome & Bio */}
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <h1 className="text-[22px] sm:text-[25px] font-black text-[#3e1f0e] tracking-tight">
            Chef Juliana Ramos
          </h1>
          <span className="material-symbols-outlined text-[#0284c7] text-[18px]">verified</span>
        </div>

        <p className="text-[12px] sm:text-[13px] font-bold text-[#ea580c] mb-2 tracking-wide">
          @receitasdachefju • Mais de 15.000 alunas
        </p>

        <p className="text-[13.5px] sm:text-[14.5px] text-[#6b4226] max-w-md mx-auto leading-relaxed font-medium mb-4">
          Receitas testadas, econômicas e com alta margem de lucro para você transformar sua cozinha em uma renda extra ou brilhar nas festas de fim de ano!
        </p>

        {/* Barra de Selos de Confiança */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-[11px] sm:text-[12px] font-bold text-[#78350f] bg-white/80 backdrop-blur-sm border border-[#fed7aa] py-2 px-3.5 rounded-full shadow-sm">
          <span className="flex items-center gap-1">
            <span className="text-[#eab308]">★</span> 4.9 de Avaliação
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#059669]">verified_user</span> Acesso Vitalício
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#ea580c]">bolt</span> Imediato
          </span>
        </div>

      </header>

      {/* 2. Container de Ofertas e Produtos */}
      <main className="w-full max-w-xl mx-auto px-4 pb-16 flex flex-col gap-4">
        
        {/* Chamada para Ação */}
        <div className="text-center my-2">
          <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest text-[#9a4b27] bg-[#ffedd5] px-3 py-1 rounded-full border border-[#fed7aa]">
            👇 ESCOLHA QUAL RECEITA VOCÊ QUER APRENDER:
          </span>
        </div>

        {/* ======================================================== */}
        {/* CARD 1: DESTAQUE PRINCIPAL - CASEIRINHOS LUCRATIVOS */}
        {/* ======================================================== */}
        <div className="relative group bg-white rounded-3xl p-4 sm:p-5 shadow-[0_10px_30px_rgba(234,88,12,0.18)] border-3 border-[#ea580c] transition-all hover:scale-[1.01] hover:shadow-[0_14px_36px_rgba(234,88,12,0.25)] ring-4 ring-[#ea580c]/15">
          
          {/* Tag de Destaque #1 */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#d97706] text-white text-[10.5px] sm:text-[11.5px] font-black uppercase px-4 py-1 rounded-full shadow-lg z-20 flex items-center gap-1.5 whitespace-nowrap animate-pulse">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            <span>O MAIS VENDIDO • RENDA EXTRA NO NATAL</span>
          </div>

          {/* Imagem do Produto */}
          <div className="w-full aspect-[16/11] rounded-2xl overflow-hidden mb-3.5 mt-2 bg-[#fef7ee] border border-[#fed7aa]/50 shadow-inner">
            <img 
              src="./code_files/hero_caseirinhos.webp" 
              alt="Formação +120 Caseirinhos Lucrativos Chef Ju" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Título & Descrição */}
          <div className="flex flex-col text-left">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-[19px] sm:text-[22px] font-black text-[#3e1f0e] leading-snug">
                +120 Receitas de Caseirinhos Lucrativos
              </h2>
            </div>
            
            <p className="text-[12.5px] sm:text-[13.5px] text-[#6b4226] leading-relaxed mb-3">
              O método com <strong>recheios aveludados sem ir ao fogão</strong> e massas fofinhas. Custo de apenas R$ 2,00 por mini bolo e venda a R$ 15,00 para lucrar mais de 600%!
            </p>

            {/* Benefícios Rápidos */}
            <div className="grid grid-cols-2 gap-1.5 mb-4 text-[11px] sm:text-[12px] font-bold text-[#3e1f0e]">
              <div className="flex items-center gap-1.5 bg-[#fff7ed] p-2 rounded-xl border border-[#fed7aa]/60">
                <span className="text-[#059669] font-black">✓</span>
                <span>120 Caseirinhos & Mini Bolos</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fff7ed] p-2 rounded-xl border border-[#fed7aa]/60">
                <span className="text-[#059669] font-black">✓</span>
                <span>100 Recheios Sem Fogo</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fff7ed] p-2 rounded-xl border border-[#fed7aa]/60">
                <span className="text-[#059669] font-black">✓</span>
                <span>Calculadora de Preço</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#fef2f2] p-2 rounded-xl border border-[#fecaca] text-[#b91c1c]">
                <span>🎄</span>
                <span>Bônus Especial de Natal</span>
              </div>
            </div>

            {/* Preço & Botão */}
            <div className="pt-3 border-t border-[#fed7aa]/60 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#c2410c] line-through font-bold leading-none">De R$ 67,00</span>
                <span className="text-[26px] sm:text-[30px] font-black text-[#059669] leading-tight">R$ 14</span>
              </div>
              <button 
                onClick={() => onNavigate('/caseirinhos')}
                className="flex-1 max-w-[240px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#059669] text-white text-[13.5px] sm:text-[15px] font-black uppercase tracking-wider shadow-lg shadow-[#ea580c]/30 active:scale-95 transition-transform flex items-center justify-center gap-1.5 text-center cursor-pointer"
              >
                <span>QUERO ESTE GUIA</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: SOBREMESAS CREMOSAS DE NATAL SEM FOGÃO */}
        {/* ======================================================== */}
        <div className="group bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-[#bbf7d0] transition-all hover:scale-[1.01] hover:shadow-xl">
          
          <div className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#059669] text-[10px] sm:text-[11px] font-black uppercase px-3 py-0.5 rounded-full mb-2.5 border border-[#a7f3d0]">
            <span>🎄</span>
            <span>ESPECIAL DE NATAL SEM FOGÃO</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center mb-3">
            <div className="w-full sm:w-44 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-[#faf6f2] border border-[#eee]">
              <img 
                src="./code_files/hero_sobremesas.webp" 
                alt="Guia de Sobremesas Sem Fogo Chef Ju" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-[17px] sm:text-[19px] font-black text-[#3e1f0e] leading-snug mb-1">
                +90 Sobremesas de Natal Sem Ir ao Fogão
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#6b4226] leading-relaxed">
                Pavês aveludados, taças da felicidade e travessas que ganham consistência na geladeira sem cansar mexendo panela no calor.
              </p>
            </div>
          </div>

          {/* Preço & Botão */}
          <div className="pt-3 border-t border-[#eee] flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10.5px] text-[#888] line-through font-bold leading-none">De R$ 47,00</span>
              <span className="text-[24px] sm:text-[27px] font-black text-[#059669] leading-tight">R$ 10</span>
            </div>
            <button 
              onClick={() => onNavigate('/sobremesas90')}
              className="flex-1 max-w-[220px] py-3 px-4 rounded-2xl bg-[#059669] text-white text-[13px] sm:text-[14px] font-black uppercase tracking-wider shadow-md shadow-[#059669]/25 active:scale-95 transition-transform flex items-center justify-center gap-1 text-center cursor-pointer"
            >
              <span>VER SOBREMESAS</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* CARD 3: TÁBUAS NATALINAS DE FRIOS */}
        {/* ======================================================== */}
        <div className="group bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-[#fed7aa] transition-all hover:scale-[1.01] hover:shadow-xl">
          
          <div className="inline-flex items-center gap-1 bg-[#fff7ed] text-[#ea580c] text-[10px] sm:text-[11px] font-black uppercase px-3 py-0.5 rounded-full mb-2.5 border border-[#fed7aa]">
            <span>🧀</span>
            <span>SUCESSO DE ELOGIOS NA CEIA</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center mb-3">
            <div className="w-full sm:w-44 aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-[#faf6f2] border border-[#eee]">
              <img 
                src="./code_files/mokup 90 natal.webp" 
                alt="Guia Mais de 90 Tábuas Natalinas" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-[17px] sm:text-[19px] font-black text-[#3e1f0e] leading-snug mb-1">
                Guia Com Mais de 90 Tábuas Natalinas
              </h3>
              <p className="text-[12px] sm:text-[13px] text-[#6b4226] leading-relaxed">
                Montagens elegantes com queijos, embutidos e frutas. Passo a passo descomplicado para encantar a família ou faturar encomendas na ceia.
              </p>
            </div>
          </div>

          {/* Preço & Botão */}
          <div className="pt-3 border-t border-[#eee] flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10.5px] text-[#888] line-through font-bold leading-none">De R$ 47,00</span>
              <span className="text-[24px] sm:text-[27px] font-black text-[#ea580c] leading-tight">R$ 10</span>
            </div>
            <button 
              onClick={() => onNavigate('/tabuas90')}
              className="flex-1 max-w-[220px] py-3 px-4 rounded-2xl bg-[#ea580c] text-white text-[13px] sm:text-[14px] font-black uppercase tracking-wider shadow-md shadow-[#ea580c]/25 active:scale-95 transition-transform flex items-center justify-center gap-1 text-center cursor-pointer"
            >
              <span>VER GUIA TÁBUAS</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* CARD 4: PORTAL DA ALUNA (ÁREA DE MEMBROS) */}
        {/* ======================================================== */}
        <div className="bg-[#2c1d11] text-white rounded-3xl p-4 sm:p-5 shadow-lg flex items-center justify-between gap-3.5 border border-[#553620]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[26px]">school</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-black text-[#fcd34d] tracking-wider block">Área Exclusiva</span>
              <h4 className="text-[15px] sm:text-[16px] font-black leading-tight">Já é Aluna da Chef Ju?</h4>
              <p className="text-[11.5px] text-[#d4bca9]">Acesse seus livros, fichas e bônus na plataforma.</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('/app')}
            className="py-2.5 px-4 rounded-xl bg-white text-[#2c1d11] text-[12px] font-black uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition-transform shrink-0 cursor-pointer shadow"
          >
            ENTRAR
          </button>
        </div>

        {/* ======================================================== */}
        {/* CARD 5: SUPORTE & DÚVIDAS NO WHATSAPP */}
        {/* ======================================================== */}
        <a 
          href="https://wa.me/5511999999999?text=Oi%20Chef%20Ju,%20tenho%20uma%20d%C3%BAvida%20sobre%20as%20receitas" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-2xl bg-[#25d366] text-white text-[13.5px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">chat</span>
          <span>Falar com o Suporte no WhatsApp</span>
        </a>

        {/* Garantia & Segurança */}
        <div className="text-center pt-2">
          <p className="text-[11.5px] text-[#854d0e] font-semibold flex items-center justify-center gap-1.5 flex-wrap">
            <span className="material-symbols-outlined text-[15px] text-[#059669]">verified_user</span>
            <span>Garantia Incondicional de 15 Dias em Todas as Formações</span>
          </p>
        </div>

      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-[#ecd9cd] py-6 px-4 bg-white/70 text-center text-[#888] text-[11px]">
        <p className="font-bold text-[#6b4226] mb-1">Chef Juliana Ramos Oficial © 2026</p>
        <p>CNPJ seguro • Pagamentos processados com criptografia via Lastlink</p>
      </footer>

    </div>
  );
}

export default HubPage;
