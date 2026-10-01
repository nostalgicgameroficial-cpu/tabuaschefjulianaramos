import React, { useState } from 'react';

// REAL STEP-BY-STEP ASSEMBLY IMAGES (Generated realistic food photography)
const STEP_IMAGES = [
  './code_files/step1.webp', // 1. Base com alecrim
  './code_files/step2.webp', // 2. Distribuição de queijos
  './code_files/step3.webp', // 3. Adição de frios e rosas de salame
  './code_files/step4.webp', // 4. Frutas frescas e secas
  './code_files/step5.webp', // 5. Potes de mel, geleia, castanhas e torradas
  './code_files/step6.webp'  // 6. Decoração final e apresentação
];

// Helper to generate 90 detailed Christmas & Gourmet Charcuterie Recipes
const generate90Recipes = () => {
  const categories = [
    'Especiais de Natal',
    'Guirlandas & Árvores',
    'Frios & Queijos',
    'Petiscos Quentes',
    'Finger Foods',
    'Tábuas Doces',
    'Opções Econômicas',
    'Aperitivos Rápidos'
  ];

  const baseCoverImages = [
    './code_files/unnamed.webp',
    './code_files/unnamed(1).webp',
    './code_files/unnamed(2).webp',
    './code_files/unnamed(3).webp',
    './code_files/unnamed(8).webp',
    './code_files/unnamed(9).webp',
    './code_files/unnamed(10).webp',
    './code_files/hero_imagem.webp',
    './code_files/galeria-p1.webp',
    './code_files/galeria-p2.webp',
    './code_files/galeria-p3.webp'
  ];

  const recipeTemplates = [
    { title: 'Tábua Especial de Natal', cat: 'Especiais de Natal', desc: 'Apresentação refinada com queijos nobres, frios sanfonados, frutas frescas e alecrim.' },
    { title: 'Guirlanda Natalina de Petiscos', cat: 'Guirlandas & Árvores', desc: 'Montagem circular festiva em formato de guirlanda com tomatinho e muçarela.' },
    { title: 'Árvore Festiva de Queijos & Frutas', cat: 'Guirlandas & Árvores', desc: 'Pirâmide triangular de uvas verdes, morangos e estrela comestível de provolone no topo.' },
    { title: 'Tábua Clássica de Frios & Mel', cat: 'Frios & Queijos', desc: 'Combinação equilibrada com brie derretido, presunto parma e potinho de mel silvestre.' },
    { title: 'Petiscos Quentes Folhados', cat: 'Petiscos Quentes', desc: 'Folhados dourados crocantes recheados com brie, damasco e calabresa acebolada.' },
    { title: 'Finger Foods & Bruschettas Gourmet', cat: 'Finger Foods', desc: 'Canapés crocantes com gorgonzola, figo fresco e maionese artesanal de ervas.' },
    { title: 'Tábua Doce Natalina com Vinhos', cat: 'Tábuas Doces', desc: 'Combinação irresistible de chocolates 70%, cerejas frescas, tâmaras e nozes.' },
    { title: 'Tábua Econômica de Fim de Semana', cat: 'Opções Econômicas', desc: 'Montagem vistosa gastando pouco com ingredientes fáceis do supermercado da sua rua.' },
    { title: 'Tábua Rápida para Visitas Surpresa', cat: 'Aperitivos Rápidos', desc: 'Pronta em menos de 10 minutos usando o que você já tem na geladeira.' },
    { title: 'Tábua Estrela de Natal Dourada', cat: 'Especiais de Natal', desc: 'Disposição em forma de estrela com damascos, castanhas e fatias de salame.' },
    { title: 'Guirlanda de Queijo Brie & Damasco', cat: 'Guirlandas & Árvores', desc: 'Aromática e sofisticada para impressionar seus convidados na ceia.' },
    { title: 'Tábua de Canapés de Kani & Ervas', cat: 'Finger Foods', desc: 'Porções individuais elegantes para beliscar antes do prato principal.' },
    { title: 'Tábua Camponesa de Embutidos & Pães', cat: 'Frios & Queijos', desc: 'Pães rústicos, patês artesanais, azeitonas recheadas e salaminho.' },
    { title: 'Tábua Tropical de Frutas & Gorgonzola', cat: 'Especiais de Natal', desc: 'Contraste refrescante de uvas, figos secos e queijo azul refinado.' },
    { title: 'Tábua Festiva de Mini Hambúrgueres & Aperitivos', cat: 'Petiscos Quentes', desc: 'Alegria dos adultos e crianças com aperitivos aquecidos irresistíveis.' }
  ];

  const fullList = [];
  let idCounter = 1;

  for (let i = 0; i < 90; i++) {
    const template = recipeTemplates[i % recipeTemplates.length];
    const cat = categories[i % categories.length];
    const cover = baseCoverImages[i % baseCoverImages.length];

    const recipeName = i < recipeTemplates.length 
      ? template.title 
      : `${template.title} #${Math.floor(i / recipeTemplates.length) + 1}`;

    fullList.push({
      id: `tabua-${idCounter++}`,
      title: recipeName,
      category: cat,
      subtitle: template.desc,
      servings: i % 2 === 0 ? '6 a 10 pessoas' : '4 a 8 pessoas',
      image: cover,
      dicaExtra: 'Use uma tábua de madeira ou um prato grande e bonito. Aposte em diferentes cores, texturas e formatos para deixar a tábua ainda mais atrativa!',
      ingredients: [
        { name: 'Queijos variados (Brie, Gouda, Parmesão, Provolone e Muçarela)', checked: false },
        { name: 'Embutidos selecionados (Presunto Parma, Salame Italiano, Peito de Peru)', checked: false },
        { name: 'Frutas frescas e secas (Uvas verdes/roxas, Morangos, Figos, Damascos)', checked: false },
        { name: 'Castanhas e sementes (Nozes quartz, Amêndoas torradas, Pistache)', checked: false },
        { name: 'Azeitonas verdes e pretas recheadas', checked: false },
        { name: 'Pães artesanais, baguetes e crackers crocantes', checked: false },
        { name: 'Potinhos com Geleia de pimenta / damasco e Mel silvestre', checked: false },
        { name: 'Decoração com ramos de alecrim fresco e tomatinhos cereja', checked: false }
      ],
      // REAL STEP-BY-STEP IMAGES FOR ASSEMBLY TIMELINE
      steps: [
        { 
          step: 1, 
          title: 'Passo 1: Prepare a base da tábua', 
          desc: 'Escolha uma tábua de madeira limpa e seca. Lave e seque ramos de alecrim fresco e posicione-os na borda para criar uma moldura verde natalina.', 
          img: STEP_IMAGES[0] 
        },
        { 
          step: 2, 
          title: 'Passo 2: Distribua os queijos principais', 
          desc: 'Posicione os queijos em pontos estratégicos. Alterne formatos: a peça de Brie inteira no centro, o Gouda em fatias leque e o Provolone em cubos.', 
          img: STEP_IMAGES[1] 
        },
        { 
          step: 3, 
          title: 'Passo 3: Adicione os frios e embutidos', 
          desc: 'Monte rosas de salame usando a borda de um copo e faça sanfonas dobrando o presunto parma ao meio. Encaixe-os ao lado dos queijos para criar volume.', 
          img: STEP_IMAGES[2] 
        },
        { 
          step: 4, 
          title: 'Passo 4: Inclua as frutas frescas e secas', 
          desc: 'Preencha os espaços vazios com cachinhos de uva sem semente, morangos cortados ao meio, figos frescos e damascos secos. O contraste de cores deixa a mesa viva!', 
          img: STEP_IMAGES[3] 
        },
        { 
          step: 5, 
          title: 'Passo 5: Adicione torradas, potinhos de mel e castanhas', 
          desc: 'Coloque pequenos potes com geleia e mel. Disponha as torradas artesanais em semicírculos e espalhe nozes e amêndoas nos cantinhos.', 
          img: STEP_IMAGES[4] 
        },
        { 
          step: 6, 
          title: 'Passo 6: Decore e sirva com elegância', 
          desc: 'Finalize polvilhando ervas frescas, adicione tomatinhos cereja e enfeites comestíveis. Sirva imediatamente e receba os elogios de toda a família!', 
          img: STEP_IMAGES[5] 
        }
      ]
    });
  }

  return fullList;
};

const ALL_RECIPES = generate90Recipes();

const BONUSES_DATA = [
  {
    id: 'b-1',
    title: 'Guia Especial de Ano Novo (Réveillon)',
    badge: 'BÔNUS 1',
    img: './code_files/bonus_ano_novo.webp',
    desc: 'Receitas exclusivas de aperitivos dourados e combinações com espumantes para celebrar a virada com muita elegância.',
    content: [
      'Tábua Dourada da Prosperidade (com figos, amêndoas e mel de flor de laranjeira)',
      'Canapés de Salmão Defumado com Cream Cheese e Aneto',
      'Harmonização completa de Queijos Finos com Espumante Brut e Prosecco'
    ]
  },
  {
    id: 'b-2',
    title: 'Lista de Supermercado Inteligente',
    badge: 'BÔNUS 2',
    img: './code_files/unnamed(12).webp',
    desc: 'Checklist interativo completo para você levar no celular e ir marcando os ingredientes enquanto compra no mercado.',
    content: []
  },
  {
    id: 'b-3',
    title: 'Marcadores Decorativos Imprimíveis',
    badge: 'BÔNUS 3',
    img: './code_files/unnamed(13).webp',
    desc: 'Plaquinhas decorativas elegantes prontas para imprimir e identificar os queijos e castanhas na mesa da ceia.',
    content: []
  }
];

const SHOPPING_CHECKLIST_DEFAULT = [
  { category: 'Queijos', items: ['Queijo Brie', 'Queijo Gouda', 'Parmesão em pedaço', 'Muçarela de Búfala', 'Gorgonzola', 'Provolone'] },
  { category: 'Frios & Embutidos', items: ['Presunto Parma / Jamón', 'Salame fatiado fino', 'Peito de Peru defumado', 'Calabresa defumada'] },
  { category: 'Frutas Frescas & Secas', items: ['Uvas verdes sem semente', 'Uvas roxas sem semente', 'Morangos frescos', 'Figos frescos', 'Damascos secos', 'Tâmaras', 'Pêras e Maçãs'] },
  { category: 'Castanhas & Sementes', items: ['Nozes quartz', 'Amêndoas torradas', 'Castanha-do-pará', 'Pistache'] },
  { category: 'Pães & Acompanhamentos', items: ['Baguete artesanal', 'Torradinhas crocantes / Crackers', 'Geleia de frutas vermelhas', 'Geleia de damasco / pimenta', 'Mel silvestre', 'Azeitonas verdes e pretas recheadas'] },
  { category: 'Decoração & Ervas', items: ['Alecrim fresco em abundância', 'Tomatinhos cereja', 'Folhas de hortelã', 'Azeite extra virgem'] }
];

export default function MemberApp({ onBackToSalesPage }) {
  const [activeTab, setActiveTab] = useState('fichas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userChecklist, setUserChecklist] = useState(SHOPPING_CHECKLIST_DEFAULT);

  const toggleChecklistItem = (catIndex, itemIndex) => {
    const updated = [...userChecklist];
    const cat = updated[catIndex];
    if (!cat.checkedState) cat.checkedState = {};
    cat.checkedState[itemIndex] = !cat.checkedState[itemIndex];
    setUserChecklist(updated);
  };

  const categories = [
    'Todas',
    'Especiais de Natal',
    'Guirlandas & Árvores',
    'Frios & Queijos',
    'Petiscos Quentes',
    'Finger Foods',
    'Tábuas Doces',
    'Opções Econômicas',
    'Aperitivos Rápidos'
  ];

  const filteredRecipes = ALL_RECIPES.filter(r => {
    const matchesCat = selectedCategory === 'Todas' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#2c221e] flex flex-col font-sans pb-24">
      {/* Top Mobile Bar */}
      <header className="bg-[#1c3a27] text-white px-4 py-3 sticky top-0 z-40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#1a9e38] flex items-center justify-center text-white font-black text-[16px] shadow-sm">
            Ju
          </div>
          <div>
            <h1 className="text-[15px] font-black leading-tight tracking-tight">Tábuas Chef Ju</h1>
            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Guia Vitalício • +90 Fichas Práticas</p>
          </div>
        </div>

        <button 
          onClick={onBackToSalesPage}
          className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1 transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">storefront</span>
          <span>Sair</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 flex-grow">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#c02f23] to-[#e86b24] text-white rounded-3xl p-5 shadow-lg mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-2">
              ✨ ÁREA VIP DE ENTREGÁVEIS
            </span>
            <h2 className="text-[22px] md:text-[28px] font-black leading-tight mb-1">
              Todas as 90+ Fichas Passo a Passo
            </h2>
            <p className="text-[13px] text-white/90 max-w-lg leading-snug">
              Clique em qualquer tábua para ver o passo a passo com imagens reais de montagem, lista de ingredientes e dicas da Chef Ju!
            </p>
          </div>
        </div>

        {/* Tab Navigation (Top buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[
            { id: 'fichas', icon: 'menu_book', label: `Fichas Práticas (${ALL_RECIPES.length})` },
            { id: 'bonus', icon: 'card_giftcard', label: 'Bônus Exclusivos' },
            { id: 'lista', icon: 'shopping_cart', label: 'Lista de Compras' },
            { id: 'dicas', icon: 'lightbulb', label: 'Dicas da Chef' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[13px] font-extrabold whitespace-nowrap transition-all shadow-sm ${
                activeTab === tab.id 
                  ? 'bg-[#1a9e38] text-white shadow-md scale-105' 
                  : 'bg-white text-[#5a4843] border border-[#e8d8cb] hover:bg-[#faf4ee]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: FICHAS PRÁTICAS & RECEITAS */}
        {activeTab === 'fichas' && (
          <div>
            {/* Search & Category Filter */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7b77]">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar entre as 90 tábuas por nome ou ingrediente..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#e8d8cb] rounded-2xl pl-10 pr-4 py-3 text-[13.5px] text-[#333] focus:outline-none focus:border-[#1a9e38] shadow-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-[11.5px] font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#c02f23] text-white shadow-md' 
                        : 'bg-white text-[#666] border border-[#eee] hover:border-[#ccc]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[12px] font-bold text-[#8c7b77]">
                Exibindo <strong className="text-[#c02f23]">{filteredRecipes.length}</strong> tábuas de receitas
              </span>
            </div>

            {/* Recipe Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5 mb-8">
              {filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-3xl overflow-hidden border border-[#eedfd3] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#faf4ee]">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 left-3 bg-[#1c3a27]/90 text-white text-[9.5px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                        {recipe.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-[15.5px] font-black text-[#1c3a27] leading-tight mb-1 group-hover:text-[#c02f23] transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-[12px] text-[#666] leading-snug mb-3 line-clamp-2">
                        {recipe.subtitle}
                      </p>
                      
                      <div className="flex items-center gap-2 text-[11px] text-[#888] font-bold border-t border-[#f5eae0] pt-2.5">
                        <span className="material-symbols-outlined text-[14px] text-[#1a9e38]">group</span>
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button className="w-full bg-[#1a9e38] text-white py-2.5 rounded-xl font-extrabold text-[12px] flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-[#15802e] transition-colors uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      <span>Ver Passo a Passo Real</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BÔNUS EXCLUSIVOS */}
        {activeTab === 'bonus' && (
          <div className="flex flex-col gap-6 mb-8">
            {BONUSES_DATA.map(bonus => (
              <div key={bonus.id} className="bg-white rounded-3xl p-5 border border-[#eedfd3] shadow-md flex flex-col md:flex-row gap-5 items-center">
                <div className="w-full md:w-48 h-40 shrink-0 rounded-2xl overflow-hidden bg-[#faf4ee] shadow-sm">
                  <img src={bonus.img} alt={bonus.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow text-center md:text-left">
                  <span className="bg-[#d83a18] text-white text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-2">
                    {bonus.badge}
                  </span>
                  <h3 className="text-[18px] font-black text-[#1c3a27] leading-tight mb-1">
                    {bonus.title}
                  </h3>
                  <p className="text-[13px] text-[#5a4843] mb-3">
                    {bonus.desc}
                  </p>

                  {bonus.content.length > 0 && (
                    <ul className="text-[12px] text-[#444] space-y-1 mb-4 text-left bg-[#fcf8f4] p-3 rounded-xl border border-[#f0e4d8]">
                      {bonus.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#1a9e38] font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button 
                    onClick={() => {
                      if (bonus.id === 'b-2') setActiveTab('lista');
                      else alert(`Abrindo material exclusivo: ${bonus.title}`);
                    }}
                    className="bg-[#1a9e38] text-white px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider shadow-md hover:bg-[#15802e] transition-colors"
                  >
                    Acessar Bônus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LISTA DE COMPRAS INTERATIVA */}
        {activeTab === 'lista' && (
          <div className="bg-white rounded-3xl p-5 border border-[#eedfd3] shadow-md mb-8">
            <div className="flex items-center justify-between mb-4 border-b border-[#f0e4d8] pb-3">
              <div>
                <h3 className="text-[18px] font-black text-[#1c3a27]">Lista de Supermercado Inteligente</h3>
                <p className="text-[12px] text-[#666]">Marque os ingredientes no celular enquanto faz suas compras no mercado:</p>
              </div>
              <button 
                onClick={() => setUserChecklist(SHOPPING_CHECKLIST_DEFAULT)}
                className="text-[11px] text-[#c02f23] font-bold underline shrink-0"
              >
                Resetar Checklist
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userChecklist.map((cat, catIdx) => (
                <div key={catIdx} className="bg-[#faf6f2] p-4 rounded-2xl border border-[#eedfd3]">
                  <h4 className="text-[14px] font-black text-[#c02f23] mb-2.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    <span>{cat.category}</span>
                  </h4>

                  <div className="space-y-2">
                    {cat.items.map((item, itemIdx) => {
                      const isChecked = cat.checkedState && cat.checkedState[itemIdx];
                      return (
                        <label 
                          key={itemIdx}
                          onClick={() => toggleChecklistItem(catIdx, itemIdx)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl text-[12.5px] cursor-pointer transition-colors ${
                            isChecked ? 'bg-emerald-50 text-[#888] line-through' : 'bg-white text-[#333] shadow-sm'
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={!!isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#1a9e38] rounded cursor-pointer"
                          />
                          <span className="font-semibold">{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DICAS DA CHEF */}
        {activeTab === 'dicas' && (
          <div className="bg-white rounded-3xl p-6 border border-[#eedfd3] shadow-md mb-8">
            <h3 className="text-[20px] font-black text-[#1c3a27] mb-4">Segredos de Montagem da Chef Ju</h3>
            
            <div className="space-y-4">
              {[
                { title: 'Regra dos 3 Queijos', desc: 'Sempre combine 1 queijo macio (brie/gorgonzola), 1 queijo firme (gouda/provolone) e 1 queijo curado (parmesão).' },
                { title: 'Harmonização de Cores', desc: 'Intercale frutas vermelhas (morangos) com frutas verdes (uvas) e tons dourados (castanhas e torradas) para a tábua "saltar aos olhos".' },
                { title: 'Volume e Camadas', desc: 'Dobre os frios (como o salame em formato de flor ou o presunto sanfonado) em vez de deixá-los retos. Isso dá aspecto de fartura bufê!' },
                { title: 'Temperatura Ideal', desc: 'Retire os queijos da geladeira 20 a 30 minutos antes de servir para ressaltar os aromas e sabores.' }
              ].map((dica, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#faf6f2] p-4 rounded-2xl border border-[#eedfd3]">
                  <span className="w-7 h-7 rounded-full bg-[#1a9e38] text-white font-black text-[13px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-[14px] font-black text-[#1c3a27] mb-1">{dica.title}</h4>
                    <p className="text-[12.5px] text-[#555] leading-relaxed">{dica.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FULL RECIPE / FICHA MODAL VIEWER WITH REAL STEP-BY-STEP STAGING IMAGES */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border-2 border-[#eedfd3] p-4 md:p-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-4 right-4 bg-[#f0e4d8] text-[#333] hover:bg-[#c02f23] hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Visual Sheet Top Header */}
            <div className="text-center mb-6">
              <span className="bg-[#c02f23] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block mb-2 shadow-sm">
                FICHA PRÁTICA COMPLETA PASSO A PASSO
              </span>
              <h2 className="text-[24px] md:text-[30px] font-black text-[#1c3a27] leading-tight">
                {selectedRecipe.title}
              </h2>
              <p className="text-[13px] text-[#e86b24] font-bold" style={{fontFamily: "'Dancing Script', cursive", fontSize: '20px'}}>
                {selectedRecipe.subtitle}
              </p>
            </div>

            {/* High-Res Main Board Image */}
            <div className="w-full rounded-2xl overflow-hidden mb-6 border border-[#eee] shadow-md bg-[#faf4ee]">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-auto object-cover" />
            </div>

            {/* Dica Extra Box */}
            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-[#166534] font-black text-[14px] mb-1">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span>DICA EXTRA DA CHEF JU</span>
              </div>
              <p className="text-[12.5px] text-[#15803d] leading-relaxed font-medium">
                {selectedRecipe.dicaExtra}
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="mb-6 bg-[#faf6f2] p-4 rounded-2xl border border-[#eedfd3]">
              <h3 className="text-[16px] font-black text-[#c02f23] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>Ingredientes Necessários ({selectedRecipe.servings})</span>
              </h3>
              <div className="space-y-2">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[12.5px] text-[#444] bg-white p-2.5 rounded-xl border border-[#eee]">
                    <span className="text-[#1a9e38] font-bold">✓</span>
                    <span>{ing.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP-BY-STEP ASSEMBLY TIMELINE WITH REAL STEP IMAGES */}
            <div className="mb-6">
              <div className="text-center mb-4">
                <h3 className="text-[18px] font-black text-[#1c3a27]">
                  COMO MONTAR - Passo a Passo com Imagens Reais
                </h3>
                <p className="text-[12px] text-[#666]">Siga cada etapa na ordem para garantir o resultado perfeito:</p>
              </div>

              <div className="space-y-4">
                {selectedRecipe.steps.map((st, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 bg-[#fffcf8] p-4 rounded-2xl border-2 border-[#f0e4d8] shadow-sm">
                    {st.img && (
                      <div className="w-full sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-[#eee] shadow-sm">
                        <img src={st.img} alt={`Passo ${st.step}`} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-7 h-7 rounded-full bg-[#1a9e38] text-white text-[13px] font-black flex items-center justify-center shrink-0 shadow-sm">
                          {st.step}
                        </span>
                        <h4 className="text-[14.5px] font-black text-[#1c3a27]">{st.title}</h4>
                      </div>
                      <p className="text-[12.5px] text-[#555] leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Action Button */}
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="w-full bg-[#1a9e38] text-white py-3.5 rounded-2xl font-black text-[14px] uppercase tracking-wider shadow-md hover:bg-[#15802e] transition-colors"
            >
              Concluir / Voltar às Fichas
            </button>

          </div>
        </div>
      )}

      {/* Bottom App Bar Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eedfd3] py-2 px-6 shadow-2xl flex items-center justify-around max-w-lg mx-auto rounded-t-3xl">
        {[
          { id: 'fichas', icon: 'menu_book', label: 'Fichas (90)' },
          { id: 'bonus', icon: 'card_giftcard', label: 'Bônus' },
          { id: 'lista', icon: 'shopping_cart', label: 'Mercado' },
          { id: 'dicas', icon: 'lightbulb', label: 'Dicas' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === tab.id ? 'text-[#1a9e38] font-black' : 'text-[#8c7b77] hover:text-[#5a4843]'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
