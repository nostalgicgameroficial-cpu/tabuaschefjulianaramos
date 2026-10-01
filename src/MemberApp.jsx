import React, { useState } from 'react';

// Data structure for the deliverables and recipes
const RECIPES_DATA = [
  {
    id: 'f-1',
    title: 'Tábua Especial de Natal',
    category: 'Especiais de Natal',
    subtitle: 'Sabores que reúnem e celebram',
    servings: '6 a 10 pessoas',
    image: './code_files/unnamed.webp',
    dicaExtra: 'Use uma tábua de madeira ou um prato grande e bonito. Aposte em diferentes cores, texturas e formatos para deixar a tábua ainda mais atrativa!',
    ingredients: [
      { name: 'Queijos variados (brie, gouda, parmesão, muçarela)', checked: false },
      { name: 'Frios (presunto, salame, peito de peru)', checked: false },
      { name: 'Frutas frescas (uvas, morangos, figos, pêra, maçã)', checked: false },
      { name: 'Castanhas (amêndoas, nozes, castanha-do-pará)', checked: false },
      { name: 'Azeitonas verdes e pretas', checked: false },
      { name: 'Pães e torradas (baguete, italiano, crackers)', checked: false },
      { name: 'Geleias e mel (frutas vermelhas, damasco, mel silvestre)', checked: false },
      { name: 'Temperos e decoração (alecrim, tomatinho cereja, uvas extras, ervas)', checked: false }
    ],
    steps: [
      { step: 1, title: 'Prepare a base', desc: 'Escolha uma tábua bonita e limpa. Se quiser, forre com ramos de alecrim para dar um toque natalino.', img: './code_files/unnamed(1).webp' },
      { step: 2, title: 'Distribua os queijos', desc: 'Comece pelos queijos, colocando-os em diferentes formatos (cubos, fatias e triângulos).', img: './code_files/unnamed(2).webp' },
      { step: 3, title: 'Adicione os frios', desc: 'Enrole ou dobre os frios para criar volume e deixar a tábua mais harmoniosa.', img: './code_files/unnamed(3).webp' },
      { step: 4, title: 'Inclua as frutas', desc: 'Distribua as frutas frescas e secas, intercalando com os queijos e frios.', img: './code_files/unnamed(4).webp' },
      { step: 5, title: 'Complete com castanhas e acompanhamentos', desc: 'Finalize com as castanhas, azeitonas, pães e torradas. Use pequenos potes para geleias.', img: './code_files/unnamed(5).webp' },
      { step: 6, title: 'Decore e sirva', desc: 'Adicione os temperos e enfeites natalinos. Sirva com carinho e aproveite!', img: './code_files/hero_imagem.webp' }
    ]
  },
  {
    id: 'f-2',
    title: 'Guirlanda Natalina de Petiscos',
    category: 'Especiais de Natal',
    subtitle: 'A queridinha da ceia festiva',
    servings: '4 a 8 pessoas',
    image: './code_files/unnamed(1).webp',
    dicaExtra: 'Disponha os ramos de alecrim formando um círculo completo na borda do prato para simular a guirlanda.',
    ingredients: [
      { name: 'Bolinhas de muçarela de búfala', checked: false },
      { name: 'Tomates cereja bem vermelhos', checked: false },
      { name: 'Fatias finas de salame dobradas em flor', checked: false },
      { name: 'Ramos de alecrim fresco em abundância', checked: false },
      { name: 'Azeite de oliva e orégano', checked: false }
    ],
    steps: [
      { step: 1, title: 'Crie a coroa de alecrim', desc: 'Lave e seque bem o alecrim e faça um círculo ao redor da tábua redonda.', img: './code_files/unnamed(1).webp' },
      { step: 2, title: 'Alterne os espetinhos', desc: 'Coloque tomate cereja e muçarela intercalados entre as folhas.', img: './code_files/unnamed(2).webp' },
      { step: 3, title: 'Posicione as flores de salame', desc: 'Faça dobraduras com o salame simulando pétalas natalinas.', img: './code_files/unnamed(3).webp' }
    ]
  },
  {
    id: 'f-3',
    title: 'Árvore Festiva de Queijos & Frutas',
    category: 'Guirlandas & Árvores',
    subtitle: 'Disposição em formato de pinheirinho',
    servings: '6 a 10 pessoas',
    image: './code_files/unnamed(2).webp',
    dicaExtra: 'Corte um pedaço de queijo provolone ou gouda em formato de estrela para colocar no topo da árvore.',
    ingredients: [
      { name: 'Uvas verdes e roxas sem semente', checked: false },
      { name: 'Morangos frescos inteiros', checked: false },
      { name: 'Cubos de queijo gouda e provolone', checked: false },
      { name: 'Queijo brie em triângulo (base)', checked: false },
      { name: 'Folhas de hortelã e alecrim', checked: false }
    ],
    steps: [
      { step: 1, title: 'Monte a estrutura triangular', desc: 'Inicie da base larga e vá estreitando até o topo.', img: './code_files/unnamed(2).webp' },
      { step: 2, title: 'Alterne as cores', desc: 'Misture as uvas verdes, morangos e cubos de queijos em camadas paralelas.', img: './code_files/unnamed(3).webp' },
      { step: 3, title: 'Estrela no topo', desc: 'Finalize com a estrela de queijo e folhas verdes ao redor.', img: './code_files/unnamed(4).webp' }
    ]
  },
  {
    id: 'f-4',
    title: 'Tábua Clássica de Frios & Mel',
    category: 'Frios & Queijos',
    subtitle: 'Combinação refinada de sabores',
    servings: '6 a 8 pessoas',
    image: './code_files/unnamed(3).webp',
    dicaExtra: 'Sirva o queijo brie levemente aquecido com um fio de mel silvestre por cima antes da ceia.',
    ingredients: [
      { name: 'Peça de queijo brie com geleia de pimenta', checked: false },
      { name: 'Presunto tipo parma ou jamón', checked: false },
      { name: 'Nozes e amêndoas torradas', checked: false },
      { name: 'Torradinhas artesanais', checked: false }
    ],
    steps: [
      { step: 1, title: 'Posicione o Brie central', desc: 'Coloque o queijo no meio e corte uma fatia inicial.', img: './code_files/unnamed(3).webp' },
      { step: 2, title: 'Monte os leques de parma', desc: 'Disponha o presunto sanfonado nas laterais.', img: './code_files/unnamed(4).webp' }
    ]
  },
  {
    id: 'f-5',
    title: 'Petiscos Quentes Crocantes',
    category: 'Petiscos Quentes',
    subtitle: 'Folhados e espetinhos aquecidos',
    servings: '4 a 6 pessoas',
    image: './code_files/unnamed(8).webp',
    dicaExtra: 'Assa os folhados logo antes de servir para manter a crocância.',
    ingredients: [
      { name: 'Mini folhados de queijo brie com damasco', checked: false },
      { name: 'Espetinhos de calabresa acebolada', checked: false },
      { name: 'Molho mostarda e mel', checked: false }
    ],
    steps: [
      { step: 1, title: 'Asse os folhados', desc: 'Asse a 180°C por 15 minutos até dourar.', img: './code_files/unnamed(8).webp' }
    ]
  },
  {
    id: 'f-6',
    title: 'Finger Foods & Canapés Gourmet',
    category: 'Finger Foods',
    subtitle: 'Pequenas porções sofisticadas',
    servings: '4 a 6 pessoas',
    image: './code_files/unnamed(9).webp',
    dicaExtra: 'Monte os canapés 30 minutos antes para não amolecer as pães.',
    ingredients: [
      { name: 'Bruschettas com gorgonzola e figo', checked: false },
      { name: 'Canapés de kani e maionese de ervas', checked: false }
    ],
    steps: [
      { step: 1, title: 'Toste os pães', desc: 'Toste as rodelas com azeite de oliva e alho.', img: './code_files/unnamed(9).webp' }
    ]
  },
  {
    id: 'f-7',
    title: 'Tábua Doce Natalina',
    category: 'Tábuas Doces',
    subtitle: 'Sobremesa de beliscar com vinhos',
    servings: '6 a 10 pessoas',
    image: './code_files/unnamed(10).webp',
    dicaExtra: 'Combine chocolates amargos 70% com frutas vermelhas e queijo gorgonzola.',
    ingredients: [
      { name: 'Chocolates nobres trufados', checked: false },
      { name: 'Damascos secos e tâmaras', checked: false },
      { name: 'Morango e cereja fresca com cabinho', checked: false }
    ],
    steps: [
      { step: 1, title: 'Arrume os doces', desc: 'Separe pequenas tigelas com caldas e dissemine as frutas.', img: './code_files/unnamed(10).webp' }
    ]
  }
];

const BONUSES_DATA = [
  {
    id: 'b-1',
    title: 'Guia Especial de Ano Novo',
    badge: 'BÔNUS 1',
    img: './code_files/bonus_ano_novo.webp',
    desc: 'Receitas exclusivas de aperitivos dourados e combinações com espumantes para o Réveillon.',
    content: [
      'Tábua Dourada de Prosperidade (com figos, amêndoas e mel de flor de laranjeira)',
      'Canapés de Salmão Defumado com Cream Cheese e Aneto',
      'Harmonização completa de Queijos Finos com Espumante Brut e Prosecco'
    ]
  },
  {
    id: 'b-2',
    title: 'Lista de Supermercado Inteligente',
    badge: 'BÔNUS 2',
    img: './code_files/unnamed(12).webp',
    desc: 'Checklist interativo completo para você levar no mercado e marcar os itens enquanto compra.',
    content: []
  },
  {
    id: 'b-3',
    title: 'Marcadores Decorativos Imprimíveis',
    badge: 'BÔNUS 3',
    img: './code_files/unnamed(13).webp',
    desc: 'Plaquinhas decorativas prontas para imprimir e identificar os queijos e castanhas na mesa.',
    content: []
  }
];

const SHOPPING_CHECKLIST_DEFAULT = [
  { category: 'Queijos', items: ['Queijo Brie', 'Queijo Gouda', 'Parmesão em pedaço', 'Muçarela de Búfala', 'Gorgonzola'] },
  { category: 'Frios & Embutidos', items: ['Presunto Parma / Jamón', 'Salame fatiado fino', 'Peito de Peru defumado', 'Calabresa'] },
  { category: 'Frutas Frescas & Secas', items: ['Uvas verdes e roxas sem semente', 'Morangos frescos', 'Figos', 'Damascos secos', 'Tâmaras', 'Pêras / Maçãs'] },
  { category: 'Castanhas & Sementes', items: ['Nozes quartz', 'Amêndoas torradas', 'Castanha-do-pará', 'Pistache'] },
  { category: 'Pães & Acompanhamentos', items: ['Baguete artesanal', 'Torradinhas / Crackers', 'Geleia de frutas vermelhas', 'Geleia de damasco', 'Mel silvestre', 'Azeitonas verdes e pretas'] },
  { category: 'Decoração & Ervas', items: ['Alecrim fresco', 'Tomatinho cereja', 'Folhas de hortelã', 'Azeite extra virgem'] }
];

export default function MemberApp({ onBackToSalesPage }) {
  const [activeTab, setActiveTab] = useState('fichas'); // 'fichas', 'bonus', 'lista', 'dicas'
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userChecklist, setUserChecklist] = useState(SHOPPING_CHECKLIST_DEFAULT);

  // Toggle checklist items
  const toggleChecklistItem = (catIndex, itemIndex) => {
    const updated = [...userChecklist];
    const cat = updated[catIndex];
    if (!cat.checkedState) cat.checkedState = {};
    cat.checkedState[itemIndex] = !cat.checkedState[itemIndex];
    setUserChecklist(updated);
  };

  const categories = ['Todas', 'Especiais de Natal', 'Guirlandas & Árvores', 'Frios & Queijos', 'Petiscos Quentes', 'Finger Foods', 'Tábuas Doces'];

  const filteredRecipes = RECIPES_DATA.filter(r => {
    const matchesCat = selectedCategory === 'Todas' || r.category === selectedCategory;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#2c221e] flex flex-col font-sans pb-24">
      {/* Top Mobile Bar */}
      <header className="bg-[#1c3a27] text-white px-4 py-3 sticky top-0 z-40 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#1a9e38] flex items-center justify-center text-white font-black text-[16px] shadow-sm">
            Ju
          </div>
          <div>
            <h1 className="text-[15px] font-black leading-tight tracking-tight">Tábuas Chef Ju</h1>
            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Área VIP de Membros</p>
          </div>
        </div>

        <button 
          onClick={onBackToSalesPage}
          className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1 transition-all"
        >
          <span className="material-symbols-outlined text-[14px]">storefront</span>
          <span>Página de Vendas</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 flex-grow">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#c02f23] to-[#e86b24] text-white rounded-3xl p-5 shadow-lg mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-2">
              🎄 BEM-VINDA(O) AO SEU GUIA!
            </span>
            <h2 className="text-[22px] md:text-[28px] font-black leading-tight mb-1">
              Monte tábuas inesquecíveis neste Natal
            </h2>
            <p className="text-[13px] text-white/90 max-w-lg leading-snug">
              Acesse aqui todas as fichas práticas passo a passo, listas de mercado e bônus exclusivos da Chef Ju.
            </p>
          </div>
        </div>

        {/* Tab Navigation (Top buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[
            { id: 'fichas', icon: 'menu_book', label: 'Fichas Práticas' },
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
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7b77]">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar tábua por nome ou ingrediente..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#e8d8cb] rounded-2xl pl-10 pr-4 py-2.5 text-[13px] text-[#333] focus:outline-none focus:border-[#1a9e38] shadow-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-[#c02f23] text-white shadow-sm' 
                        : 'bg-white text-[#666] border border-[#eee]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-3xl overflow-hidden border border-[#eedfd3] shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-[#faf4ee]">
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
                      <h3 className="text-[16px] font-black text-[#1c3a27] leading-tight mb-1 group-hover:text-[#c02f23] transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-[12px] text-[#666] leading-snug mb-3">
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
                      <span>Ver Ficha Completa</span>
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
                      else alert(`Visualizando material do ${bonus.title}`);
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

      {/* FULL RECIPE / FICHA MODAL VIEWER (Just like unnamed.webp!) */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-2 border-[#eedfd3] p-4 md:p-6">
            
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
                FICHA PRÁTICA PASSO A PASSO
              </span>
              <h2 className="text-[26px] md:text-[32px] font-black text-[#1c3a27] leading-tight">
                {selectedRecipe.title}
              </h2>
              <p className="text-[13px] text-[#e86b24] font-bold" style={{fontFamily: "'Dancing Script', cursive", fontSize: '20px'}}>
                {selectedRecipe.subtitle}
              </p>
            </div>

            {/* High-Res Sheet Image Preview */}
            <div className="w-full rounded-2xl overflow-hidden mb-6 border border-[#eee] shadow-md bg-[#faf4ee]">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-auto object-cover" />
            </div>

            {/* Dica Extra Box */}
            <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-[#166534] font-black text-[14px] mb-1">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span>DICA EXTRA DA CHEF</span>
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
                  <div key={idx} className="flex items-center gap-2 text-[13px] text-[#444] bg-white p-2 rounded-xl border border-[#eee]">
                    <span className="text-[#1a9e38] font-bold">✓</span>
                    <span>{ing.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step Assembly Timeline */}
            <div className="mb-6">
              <h3 className="text-[18px] font-black text-[#1c3a27] mb-4 text-center">
                COMO MONTAR - Passo a Passo
              </h3>
              <div className="space-y-4">
                {selectedRecipe.steps.map((st, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 bg-[#fffcf8] p-3.5 rounded-2xl border border-[#f0e4d8] shadow-sm">
                    {st.img && (
                      <div className="w-full sm:w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <img src={st.img} alt={`Passo ${st.step}`} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-[#1a9e38] text-white text-[12px] font-black flex items-center justify-center shrink-0">
                          {st.step}
                        </span>
                        <h4 className="text-[14px] font-black text-[#1c3a27]">{st.title}</h4>
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
              className="w-full bg-[#1a9e38] text-white py-3 rounded-2xl font-black text-[14px] uppercase tracking-wider shadow-md hover:bg-[#15802e] transition-colors"
            >
              Concluir / Voltar às Fichas
            </button>

          </div>
        </div>
      )}

      {/* Bottom App Bar Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eedfd3] py-2 px-6 shadow-2xl flex items-center justify-around max-w-lg mx-auto rounded-t-3xl">
        {[
          { id: 'fichas', icon: 'menu_book', label: 'Fichas' },
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
