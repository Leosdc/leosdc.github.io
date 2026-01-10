const API_URL = 'https://script.google.com/macros/s/AKfycbzYO5iizLJ-i-NKetEqIHTpphjBY4zo-NV4F5DOmbJL8MGbRm2G_O95G1Wk8UUNj2sP/exec';

const bookQuotes = [
    { quote: "Só se vê bem com o coração. O essencial é invisível aos olhos.", book: "O Pequeno Príncipe" },
    { quote: "Aonde você quer ir? Depende de onde você quer chegar.", book: "Alice no País das Maravilhas" },
    { quote: "Não é o que você tem, mas como você usa o que tem que faz a diferença.", book: "O Ursinho Pooh" },
    { quote: "Você é mais corajoso do que acredita, mais forte do que parece e mais inteligente do que pensa.", book: "O Ursinho Pooh" },
    { quote: "Mesmo as menores pessoas podem mudar o curso do futuro.", book: "O Senhor dos Anéis" },
    { quote: "Existem muitos tipos de coragem. É preciso muita coragem para enfrentar nossos inimigos, mas igual coragem para enfrentar nossos amigos.", book: "Harry Potter e a Pedra Filosofal" },
    { quote: "As palavras são, na minha nada humilde opinião, nossa fonte mais inesgotável de magia.", book: "Harry Potter e as Relíquias da Morte" },
    { quote: "O mundo é, de fato, cheio de perigos, e nele há muitos lugares sombrios; mas ainda assim há muita coisa que é justa.", book: "O Senhor dos Anéis" },
    { quote: "A felicidade pode ser encontrada mesmo nas horas mais difíceis, se você se lembrar de acender a luz.", book: "Harry Potter e o Prisioneiro de Azkaban" },
    { quote: "Tudo o que temos de decidir é o que fazer com o tempo que nos é dado.", book: "O Senhor dos Anéis" }
];

const currentQuote = bookQuotes[Math.floor(Math.random() * bookQuotes.length)];
let isSplashActive = true;
let currentView = 'dashboard'; // 'dashboard' or 'stats'

let currentUser = null;
let isLoginMode = true;
let items = [];
let displayedItems = [];
let itemsPerPage = 10;
let currentPage = 1;
let showForm = false;
let filter = 'all';
let searchTerm = '';
let searchInput = '';
let editingId = null;
let showCharts = false;
let chartPeriod = 'monthly';
let chartType = 'all';
let loading = false;
let sortBy = 'date-desc';
let showSortMenu = false;
let showSortMenuMobile = false;
let loginData = {
    username: '',
    password: ''
};
let chatOpen = false;
let chatMessages = [
    { role: 'assistant', content: 'Olá! Sou a Alice. Posso te ajudar a registrar um livro, série ou filme. O que vamos registrar hoje?' }
];
let isChatLoading = false;
let showInsight = false;
let insightMessage = '';
let isGeneratingInsight = false;
let formData = {
    title: '',
    author: '',
    pages: '',
    status: 'Quero ler/assistir',
    rating: '',
    date: '',
    category: 'Livro',
    country: ''
};

const statusOptions = ['Quero ler/assistir', 'Lido', 'Assistido', 'Desisti'];
const ratingOptions = ['Maravilhoso 😍', 'Muito bom 😊', 'Bom 🙂', 'Mais ou menos 🤨', 'Ruim 🙁', 'Péssimo 😒'];
let showRecapModal = false;
let recapYear = new Date().getFullYear();

const categoryOptions = ['Livro', 'Série', 'Filme'];
const countryOptions = ['Brasil', 'Coreia do Sul', 'China', 'Japão', 'Taiwan', 'Tailândia', 'Estados Unidos', 'Outro'];

function checkSavedLogin() {
    const saved = localStorage.getItem('mundoAliceUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        loadData();
    } else {
        renderLogin();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function handleLogin() {
    if (!loginData.username || !loginData.password) {
        showNotification('Preencha usuário e senha!', 'error');
        return;
    }

    loading = true;
    renderLogin();

    try {
        const url = `${API_URL}?action=checkUser&username=${encodeURIComponent(loginData.username)}&password=${encodeURIComponent(loginData.password)}`;
        console.log('Tentando login em:', API_URL);

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();

        if (result.success) {
            currentUser = { username: loginData.username };
            localStorage.setItem('mundoAliceUser', JSON.stringify(currentUser));
            localStorage.setItem('mundoAlicePass', loginData.password);
            showNotification('✨ Login realizado com sucesso!');
            loadData();
        } else {
            showNotification('Usuário ou senha incorretos!', 'error');
            loading = false;
            renderLogin();
        }
    } catch (error) {
        console.error('Erro detalhado no login:', error);
        showNotification(`Erro ao fazer login: ${error.message || 'Tente novamente.'}`, 'error');
        loading = false;
        renderLogin();
    }
}

async function handleRegister() {
    if (!loginData.username || !loginData.password) {
        showNotification('Preencha usuário e senha!', 'error');
        return;
    }

    if (loginData.password.length < 4) {
        showNotification('A senha deve ter no mínimo 4 caracteres!', 'error');
        return;
    }

    loading = true;
    renderLogin();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'registerUser',
                username: loginData.username,
                password: loginData.password
            })
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        currentUser = { username: loginData.username };
        localStorage.setItem('mundoAliceUser', JSON.stringify(currentUser));
        localStorage.setItem('mundoAlicePass', loginData.password);
        showNotification('✨ Cadastro realizado com sucesso!');
        loadData();
    } catch (error) {
        console.error('Erro no cadastro:', error);
        showNotification('Erro ao cadastrar. Tente novamente.', 'error');
        loading = false;
        renderLogin();
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('mundoAliceUser');
    localStorage.removeItem('mundoAlicePass');
    items = [];
    loginData = { username: '', password: '' };
    chatOpen = false;
    chatMessages = [
        { role: 'assistant', content: 'Olá! Sou a Alice. Posso te ajudar a registrar um livro, série ou filme. O que vamos registrar hoje?' }
    ];
    showNotification('Você saiu da conta!');
    renderLogin();
}

async function callGroqViaGAS(messages) {
    if (!currentUser) return;

    const password = localStorage.getItem('mundoAlicePass');
    if (!password) {
        return '❌ Erro: Senha não salva. Por favor, faça **Logout** e entre novamente na sua conta para ativar o assistente.';
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'callGroq',
                username: currentUser.username,
                password: password,
                messages: messages
            })
        });

        const result = await response.json();

        if (result.error) {
            return `❌ Erro do Servidor: ${result.error}`;
        }

        return result.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao chamar Groq:', error);
        return 'Desculpe, tive um problema na conexão com o Google Script. Verifique se o link da API no `script.js` está correto e se você publicou uma **Nova Versão** da implantação.';
    }
}

async function handleChatSubmit() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || isChatLoading) return;

    input.value = '';
    chatMessages.push({ role: 'user', content: text });
    isChatLoading = true;
    render();
    scrollChat();

    // Contexto para o bot: Ele deve agir como um assistente de registro.
    const systemMessage = {
        role: 'system',
        content: `Você é a Alice do app "Mundo da Alice". Seu objetivo é ajudar o usuário a registrar Livros, Séries ou Filmes de forma EXTREMAMENTE cuidadosa.
        
        PESQUISA E PRECISÃO:
        Antes de sugerir ou confirmar dados, "pesquise" mentalmente para garantir que o autor, número de episódios ou páginas estejam corretos. Se não tiver certeza absoluta, peça para o usuário confirmar. Evite inventar dados (alucinações).
        
        CAMPOS NECESSÁRIOS: Título, Autor (se for livro), Páginas/Episódios (número), Status (Quero ler/assistir, Lido, Assistido, Desisti), Avaliação, Data (em formato DD/MM/AAAA), Categoria (Livro, Série, Filme), País (Opcional).
        
        REGRAS:
        1. Seja amigável e use emojis, mas mantenha o foco na organização.
        2. Pergunte uma coisa de cada vez. IMPORTANTE: Pergunte a data de leitura/assistência e peça para o usuário digitar no formato DD/MM/AAAA.
        3. Quando tiver TODAS as informações, termine respondendo EXATAMENTE com um JSON no formato: 
        [[REGISTER_ITEM: {"title": "...", "author": "...", "pages": "...", "status": "...", "rating": "...", "date": "...", "category": "...", "country": "..."}]]
        
        Status permitidos: "Quero ler/assistir", "Lido", "Assistido", "Desisti".
        Avaliações permitidas (USE EXATAMENTE ASSIM, COM O EMOJI): "Maravilhoso 😍", "Muito bom 😊", "Bom 🙂", "Mais ou menos 🤨", "Ruim 🙁", "Péssimo 😒".
        Categorias: "Livro", "Série", "Filme".`
    };

    const response = await callGroqViaGAS([systemMessage, ...chatMessages]);

    // Função para garantir que a avaliação tenha o emoji correto
    const sanitizeRating = (rating) => {
        const ratingMap = {
            'Maravilhoso': 'Maravilhoso 😍',
            'Muito bom': 'Muito bom 😊',
            'Bom': 'Bom 🙂',
            'Mais ou menos': 'Mais ou menos 🤨',
            'Ruim': 'Ruim 🙁',
            'Péssimo': 'Péssimo 😒'
        };
        // Se já tem emoji ou não está no mapa, retorna como está
        if (!rating) return rating;
        for (const [key, value] of Object.entries(ratingMap)) {
            if (rating.toLowerCase().includes(key.toLowerCase()) && !rating.includes(' ')) {
                // Se a IA enviou apenas a palavra (ou algo sem espaço+emoji), tenta corrigir
                return value;
            }
        }
        return rating;
    };

    // Verifica se o bot enviou o comando de registro
    if (response.includes('[[REGISTER_ITEM:')) {
        const jsonMatch = response.match(/\[\[REGISTER_ITEM: (.*?)\]\]/);
        if (jsonMatch) {
            try {
                const itemData = JSON.parse(jsonMatch[1]);

                // Sanitização da avaliação
                if (itemData.rating) {
                    itemData.rating = sanitizeRating(itemData.rating);
                }

                chatMessages.push({ role: 'assistant', content: 'Perfeito! Registrei tudo para você. ✨' });

                // Preenche o formulário e salva
                formData = { ...formData, ...itemData };
                await handleSubmit();

                isChatLoading = false;
                render();
                // Garante que o chat role para baixo após o registro forçado pelo bot
                setTimeout(scrollChat, 100);
                return;
            } catch (e) {
                console.error('Erro ao processar registro do bot:', e);
            }
        }
    }

    chatMessages.push({ role: 'assistant', content: response });
    isChatLoading = false;
    render();
    scrollChat();
}

async function handleSuggestionRequest() {
    if (isChatLoading) return;

    isChatLoading = true;
    chatMessages.push({ role: 'assistant', content: 'Deixa eu ver o que você já gostou... Analisando seu histórico para uma sugestão especial! 🧐✨' });
    render();
    scrollChat();

    // Prepara o histórico para o prompt
    const history = items.slice(0, 20).map(item => `- ${item.category}: ${item.title} (${item.rating || 'Sem avaliação'})`).join('\n');

    const suggestionPrompt = {
        role: 'system',
        content: `Você é um curador especialista em entretenimento, conhecido por sua precisão e recomendações impecáveis.
        
        PESQUISA RIGOROSA: 
        Analise o histórico do usuário com cuidado. Pense em conexões de gênero, autores, diretores e temática. SEMPRE verifique se sua sugestão existe de fato e se o autor está correto.
        
        HISTÓRICO RECENTE:
        ${history}

        REGRAS:
        1. Sugira apenas UM item.
        2. Explique detalhadamente por que você acha que ele vai gostar, conectando com o que ele já consumiu.
        3. Use emojis e um tom entusiasmado.
        4. NUNCA sugira algo que já está no histórico.
        5. Formate a resposta como: "Minha sugestão: **[NOME]**" (se for Livro, adicione " **por [AUTOR]**")\n\n**Sinopse:** [SINOPSE CURTA E PRECISA]\n\n**Por que você vai amar:** [MOTIVO BASEADO NO HISTÓRICO]"`
    };

    const response = await callGroqViaGAS([suggestionPrompt]);

    chatMessages.push({ role: 'assistant', content: response });
    isChatLoading = false;
    render();
    scrollChat();
}

function scrollChat() {
    const container = document.getElementById('chat-container');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

async function generateInsight() {
    if (items.length === 0 || isGeneratingInsight) return;

    isGeneratingInsight = true;
    render();

    const randomItem = items[Math.floor(Math.random() * items.length)];
    const systemMessage = {
        role: 'system',
        content: 'Você é um assistente curioso e bem informado. O usuário tem uma biblioteca de livros, filmes e séries. Sua tarefa é fornecer uma curiosidade REAL, PRECISA e fascinante sobre o item fornecido. Pesquise mentalmente detalhes técnicos, de bastidores ou históricos. Máximo 3 frases. Responda de forma divertida e inteligente.'
    };

    const userMessage = {
        role: 'user',
        content: `O item é: "${randomItem.title}" (${randomItem.category}). Conte algo legal sobre ele.`
    };

    const insight = await callGroqViaGAS([systemMessage, userMessage]);
    insightMessage = insight;
    showInsight = true;
    isGeneratingInsight = false;
    render();

    // Esconde após 30 segundos
    setTimeout(() => {
        showInsight = false;
        render();
    }, 30000);
}

function renderChat() {
    if (!chatOpen) {
        return `
            <button
                onclick="chatOpen = true; render();"
                class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform z-50"
                title="Conversar com a Alice"
            >
                💬
            </button>
        `;
    }

    return `
        <div class="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-[60] border border-purple-100 overflow-hidden chat-message">
            <!-- Header -->
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white flex justify-between items-center">
                <div class="flex items-center gap-2">
                    <img src="alice_face_icon.png" alt="Alice" class="w-8 h-8 rounded-full object-cover" />
                    <div>
                        <h3 class="font-bold text-sm">Alice</h3>
                        <p class="text-[10px] text-purple-100">Pronto para ajudar! ✨</p>
                    </div>
                </div>
                <button onclick="chatOpen = false; render();" class="hover:bg-white/20 p-1 rounded-lg transition-colors">
                    ✕
                </button>
            </div>

            <!-- Messages -->
            <div id="chat-container" class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50/50 chat-scroll">
                ${chatMessages.map(msg => `
                    <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
                        <div class="max-w-[80%] p-3 rounded-2xl text-sm chat-message ${msg.role === 'user'
            ? 'bg-purple-600 text-white rounded-tr-none'
            : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
        }">
                            ${msg.content}
                        </div>
                    </div>
                `).join('')}
                ${isChatLoading ? `
                    <div class="flex justify-start">
                        <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
                            <span class="flex gap-1">
                                <span class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                                <span class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </span>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Input -->
            <div class="p-3 bg-white border-t border-gray-100">
                <div class="flex gap-2 mb-2">
                    <button 
                        onclick="handleSuggestionRequest();"
                        class="flex-1 py-1.5 px-3 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors flex items-center justify-center gap-1 border border-purple-100"
                        ${isChatLoading ? 'disabled' : ''}
                    >
                        <span>Sugerir algo 🪄</span>
                    </button>
                </div>
                <div class="flex gap-2">
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="Digite sua mensagem..."
                        onkeypress="if(event.key === 'Enter') handleChatSubmit();"
                        class="flex-1 px-3 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500"
                        ${isChatLoading ? 'disabled' : ''}
                    />
                    <button
                        onclick="handleChatSubmit();"
                        class="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                        ${isChatLoading ? 'disabled' : ''}
                    >
                        🚀
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderInsight() {
    if (!showInsight && !isGeneratingInsight) {
        return `
            <button
                onclick="generateInsight();"
                class="fixed bottom-6 left-6 px-4 py-2 bg-white text-purple-600 rounded-full shadow-lg border border-purple-100 flex items-center gap-2 hover:scale-105 transition-transform z-50 text-sm font-medium"
            >
                ✨ Me conte uma curiosidade
            </button>
        `;
    }

    if (isGeneratingInsight) {
        return `
            <div class="fixed bottom-6 left-6 px-4 py-2 bg-white text-purple-600 rounded-full shadow-lg border border-purple-100 flex items-center gap-2 z-50 text-sm font-medium chat-message">
                ✨ Pensando em algo legal...
            </div>
        `;
    }

    return `
        <div class="fixed bottom-6 left-6 max-w-xs bg-white p-4 rounded-2xl shadow-2xl border border-purple-100 z-50 chat-message">
            <div class="flex items-start gap-3">
                <span class="text-xl">💡</span>
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Você sabia?</h4>
                    <p class="text-sm text-gray-700 leading-relaxed">${insightMessage}</p>
                </div>
                <button onclick="showInsight = false; render();" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
        </div>
    `;
}

function performSearch() {
    searchTerm = searchInput;
    resetPagination();
    render();
}

function loadMoreItems() {
    const filtered = getFilteredItems();
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    displayedItems = filtered.slice(0, end);

    if (end < filtered.length) {
        currentPage++;
    }
}

function resetPagination() {
    currentPage = 1;
    displayedItems = [];
}

/**
 * Converte uma string de data para um objeto Date válido.
 * Aceita formatos: DD/MM/AAAA, AAAA-MM-DD (ISO/Input)
 */
function toValidDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;

    // Se for formato AAAA-MM-DD
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    // Se for formato DD/MM/AAAA
    if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [d, m, y] = dateStr.split('/').map(Number);
        return new Date(y, m - 1, d);
    }

    // Tenta parse genérico (ISO, etc)
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(dateStr) {
    const date = toValidDate(dateStr);
    if (!date) return dateStr || '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function loadData() {
    if (!currentUser) return;

    loading = true;
    render();

    const password = localStorage.getItem('mundoAlicePass');
    try {
        const url = `${API_URL}?username=${encodeURIComponent(currentUser.username)}&password=${encodeURIComponent(password)}`;
        const response = await fetch(url);
        const data = await response.json();
        items = data.map((item, index) => ({
            id: index,
            title: item['Título'] || item.Título || '',
            author: item['Autor'] || item.Autor || '',
            pages: (item['Páginas/Episódios'] || item['Nº Páginas | Episódios'] || '').toString().replace(' Páginas', '').replace(' Episódios', '').replace(' páginas', '').replace(' episódios', '').trim(),
            status: item['Status'] || item.Status || '',
            rating: item['Avaliação'] || item.Avaliação || '',
            date: item['Data'] || item.Data || '',
            category: (item['Categoria'] || item.Categoria || 'Livro').trim(),
            country: item['País'] || item.País || ''
        })).filter(item => item.title);

        resetPagination();
        loadMoreItems();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showNotification('Erro ao carregar dados do Google Sheets', 'error');
    }
    loading = false;
    render();
}

async function saveToSheet(action, data) {
    loading = true;
    render();

    const password = localStorage.getItem('mundoAlicePass');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action,
                username: currentUser.username,
                password: password,
                ...data
            })
        });

        await new Promise(resolve => setTimeout(resolve, 2000));
        await loadData();
        return true;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        showNotification('Erro ao salvar no Google Sheets', 'error');
        loading = false;
        render();
        return false;
    }
}

async function handleSubmit() {
    if (!formData.title) {
        showNotification('O título é obrigatório!', 'error');
        return;
    }

    let finalDate = formData.date;
    if (formData.date && formData.date.includes('-')) {
        const parts = formData.date.split('-');
        finalDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const itemData = {
        title: formData.title,
        author: formData.author,
        pages: formData.pages,
        status: formData.status,
        rating: formData.rating,
        date: formData.date ? formatDate(formData.date) : '',
        category: formData.category,
        country: formData.country
    };

    if (editingId !== null) {
        const oldItem = items[editingId];
        await saveToSheet('update', {
            oldTitle: oldItem.title,
            ...itemData
        });
        showNotification('✨ Item atualizado com sucesso!');
    } else {
        await saveToSheet('add', itemData);
        showNotification('✨ Item adicionado com sucesso!');
    }

    resetForm();
    render();
}

async function handleDelete(index) {
    if (confirm('Deseja realmente excluir este item?')) {
        const item = items[index];
        await saveToSheet('delete', { title: item.title });
        showNotification('🗑️ Item excluído com sucesso!');
    }
}

function handleEdit(index) {
    const item = items[index];
    editingId = index;

    let formattedDate = '';
    if (item.date) {
        const dateObj = toValidDate(item.date);
        if (dateObj) {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            formattedDate = `${y}-${m}-${d}`;
        }
    }

    formData = {
        title: item.title,
        author: item.author || '',
        pages: item.pages.toString(),
        status: item.status,
        rating: item.rating,
        date: formattedDate,
        category: item.category,
        country: item.country || ''
    };
    showForm = true;
    render();
}

function resetForm() {
    formData = {
        title: '',
        author: '',
        pages: '',
        status: 'Quero ler/assistir',
        rating: '',
        date: '',
        category: 'Livro',
        country: ''
    };
    showForm = false;
    editingId = null;
}

function getFilteredItems() {
    console.log('Filtrando por:', filter, 'Termo:', searchTerm);
    let filtered = items.filter(item => {
        const cat = item.category;
        const matchesFilter = filter === 'all' ||
            (filter === 'books' && cat === 'Livro') ||
            (filter === 'series' && (cat === 'Série' || cat === 'Serie')) ||
            (filter === 'movies' && (cat === 'Filme' || cat === 'Filmes'));
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            case 'date-asc':
                return compareDates(a.date, b.date);
            case 'date-desc':
                return compareDates(b.date, a.date);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'status':
                const statusOrder = ['Quero ler/assistir', 'Lido', 'Assistido', 'Desisti'];
                return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            case 'rating':
                const ratingOrder = ['Maravilhoso 😍', 'Muito bom 😊', 'Bom 🙂', 'Mais ou menos 🤨', 'Ruim 🙁', 'Péssimo 😒'];
                const aRating = a.rating ? ratingOrder.indexOf(a.rating) : 999;
                const bRating = b.rating ? ratingOrder.indexOf(b.rating) : 999;
                return aRating - bRating;
            default:
                return 0;
        }
    });

    return filtered;
}

function compareDates(dateA, dateB) {
    const dA = toValidDate(dateA);
    const dB = toValidDate(dateB);

    if (!dA && !dB) return 0;
    if (!dA) return 1;
    if (!dB) return -1;

    return dA.getTime() - dB.getTime();
}

function getStats() {
    return {
        total: items.length,
        books: items.filter(i => i.category === 'Livro').length,
        series: items.filter(i => i.category === 'Série').length,
        movies: items.filter(i => i.category === 'Filme').length,
        completed: items.filter(i => i.status === 'Lido' || i.status === 'Assistido').length
    };
}

function getChartData() {
    const filteredItems = items.filter(item => {
        if (chartType === 'books') return item.category === 'Livro';
        if (chartType === 'series') return item.category === 'Série';
        if (chartType === 'movies') return item.category === 'Filme';
        return true;
    }).filter(item => item.status === 'Lido' || item.status === 'Assistido');

    const dataMap = {};

    filteredItems.forEach(item => {
        if (!item.date) return;

        const parts = item.date.split('/');
        if (parts.length !== 3) return;

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        let key;
        if (chartPeriod === 'daily') {
            key = `${day}/${month}/${year}`;
        } else if (chartPeriod === 'monthly') {
            key = `${month}/${year}`;
        } else {
            key = year;
        }

        dataMap[key] = (dataMap[key] || 0) + 1;
    });

    const sortedKeys = Object.keys(dataMap).sort((a, b) => {
        const parseDate = (str) => {
            const parts = str.split('/');
            if (chartPeriod === 'daily') {
                return new Date(parts[2], parts[1] - 1, parts[0]);
            } else if (chartPeriod === 'monthly') {
                return new Date(parts[1], parts[0] - 1);
            } else {
                return new Date(parts[0]);
            }
        };
        return parseDate(a) - parseDate(b);
    });

    return sortedKeys.map(key => ({
        label: key,
        value: dataMap[key]
    }));
}

function renderChart() {
    const data = getChartData();
    if (data.length === 0) {
        return '<div class="text-center text-gray-500 py-12 text-sm">Nenhum dado disponível para o período selecionado</div>';
    }

    const maxValue = Math.max(...data.map(d => d.value));

    return `
        <div class="space-y-3">
            ${data.map(item => {
        const percentage = (item.value / maxValue) * 100;
        return `
                    <div class="flex items-center gap-2">
                        <div class="w-20 md:w-32 text-xs md:text-sm text-gray-600 text-right flex-shrink-0">${item.label}</div>
                        <div class="flex-1 flex items-center gap-2">
                            <div class="flex-1 bg-gray-100 rounded-full h-7 md:h-8 relative overflow-hidden">
                                <div 
                                    class="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2 md:px-3"
                                    style="width: ${percentage}%"
                                >
                                    <span class="text-white font-bold text-xs md:text-sm">${item.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function renderLogin() {
    document.getElementById('app').innerHTML = `
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div class="text-center mb-8">
                    <div class="mb-4">
                        <img src="icon.png" alt="Mundo da Alice" class="w-32 h-32 mx-auto">
                    </div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2 app-title">Mundo da Alice</h1>
                    <p class="text-gray-600 italic">"${currentQuote.quote}"</p>
                    <p class="text-xs text-gray-400 mt-1">— ${currentQuote.book}</p>
                </div>

                <div class="mb-6">
                    <div class="flex gap-2 bg-gray-100 rounded-lg p-1 mb-6">
                        <button
                            onclick="isLoginMode = true; renderLogin();"
                            class="flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${isLoginMode ? 'bg-white shadow-sm' : ''}"
                        >
                            Entrar
                        </button>
                        <button
                            onclick="isLoginMode = false; renderLogin();"
                            class="flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${!isLoginMode ? 'bg-white shadow-sm' : ''}"
                        >
                            Cadastrar
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                            <input
                                type="text"
                                value="${loginData.username}"
                                oninput="loginData.username = this.value;"
                                placeholder="Digite seu usuário"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                ${loading ? 'disabled' : ''}
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input
                                type="password"
                                value="${loginData.password}"
                                oninput="loginData.password = this.value;"
                                onkeypress="if(event.key === 'Enter') ${isLoginMode ? 'handleLogin()' : 'handleRegister()'};"
                                placeholder="Digite sua senha"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                ${loading ? 'disabled' : ''}
                            />
                        </div>

                        <button
                            onclick="${isLoginMode ? 'handleLogin()' : 'handleRegister()'};"
                            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                            ${loading ? 'disabled' : ''}
                        >
                            ${loading ? 'Aguarde...' : (isLoginMode ? '🔐 Entrar' : '✨ Criar Conta')}
                        </button>
                    </div>
                </div>

                ${!isLoginMode ? `
                <div class="text-center text-sm text-gray-500 mt-4">
                    <p>💡 Escolha um usuário e senha fáceis de lembrar!</p>
                    <p class="mt-1">Mínimo 4 caracteres na senha.</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}


function switchView(view) {
    currentView = view;
    render();
}

function renderStatsView() {
    const stats = getStats();
    return `
        <div class="max-w-6xl mx-auto px-4 mt-6 pb-8">
            <h2 class="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                📊 Estatísticas Detalhadas
            </h2>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white rounded-2xl p-6 shadow-md border-b-4 border-purple-500">
                    <div class="text-3xl font-bold text-purple-600">${stats.total}</div>
                    <div class="text-sm text-gray-600 font-medium tracking-tight">Total de Itens</div>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-md border-b-4 border-blue-500">
                    <div class="text-3xl font-bold text-blue-600">${stats.books}</div>
                    <div class="text-sm text-gray-600 font-medium tracking-tight">Livros</div>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-md border-b-4 border-pink-500">
                    <div class="text-3xl font-bold text-pink-600">${stats.series}</div>
                    <div class="text-sm text-gray-600 font-medium tracking-tight">Séries</div>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-md border-b-4 border-yellow-500">
                    <div class="text-3xl font-bold text-yellow-600">${stats.movies}</div>
                    <div class="text-sm text-gray-600 font-medium tracking-tight">Filmes</div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-6">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Gráfico de Atividade</h3>
                        <p class="text-gray-500 text-sm">Visualize sua jornada no tempo</p>
                    </div>
                    
                    <div class="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1">
                        <button onclick="chartPeriod = 'daily'; render();" class="px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartPeriod === 'daily' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}">Diário</button>
                        <button onclick="chartPeriod = 'monthly'; render();" class="px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartPeriod === 'monthly' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}">Mensal</button>
                        <button onclick="chartPeriod = 'yearly'; render();" class="px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartPeriod === 'yearly' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}">Anual</button>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-xl">
                    <button onclick="chartType = 'all'; render();" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${chartType === 'all' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}">Todos</button>
                    <button onclick="chartType = 'books'; render();" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${chartType === 'books' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}">📖 Livros</button>
                    <button onclick="chartType = 'series'; render();" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${chartType === 'series' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}">📺 Séries</button>
                    <button onclick="chartType = 'movies'; render();" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${chartType === 'movies' ? 'bg-yellow-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'}">🎬 Filmes</button>
                </div>

                <div class="min-h-[350px]">
                    ${renderChart()}
                </div>
            </div>

            <!-- Botão Voltar mobile -->
            <div class="mt-6 md:hidden">
                <button 
                    onclick="switchView('dashboard')"
                    class="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold shadow-md border border-gray-100 flex items-center justify-center gap-2"
                >
                    🏠 Voltar para o Início
                </button>
            </div>
        </div>
    `;
}

function render() {
    if (!currentUser) {
        renderLogin();
        return;
    }

    if (displayedItems.length === 0) {
        loadMoreItems();
    }
    const stats = getStats();
    const filteredItems = getFilteredItems();
    const hasMore = displayedItems.length < filteredItems.length;

    document.getElementById('app').innerHTML = `
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg shadow-purple-200/50">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                <div class="flex-1">
                    <h1 class="text-3xl md:text-4xl font-bold mb-1 app-title cursor-pointer" onclick="switchView('dashboard')">Mundo da Alice</h1>
                    <p class="text-purple-100 text-sm italic opacity-90">"${currentQuote.quote}"</p>
                    <p class="text-[10px] text-purple-200 uppercase tracking-widest font-bold mt-1">— ${currentQuote.book}</p>
                    ${loading ? '<p class="text-purple-200 mt-2 flex items-center justify-center md:justify-start gap-2"><span class="loading"></span> Carregando...</p>' : ''}
                </div>
                <div class="flex flex-col items-center md:items-end gap-3">
                    <div class="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        <span class="text-xs">👤 ${currentUser.username}</span>
                    </div>
                    <div class="flex flex-wrap justify-center md:justify-end gap-2">
                        <button
                            onclick="switchView('dashboard')"
                            class="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${currentView === 'dashboard' ? 'bg-white/40 ring-2 ring-white/50' : ''}"
                            title="Início"
                        >
                            🏠 <span class="hidden lg:inline">Início</span>
                        </button>
                        <button
                            onclick="switchView('stats')"
                            class="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${currentView === 'stats' ? 'bg-white/40 ring-2 ring-white/50' : ''}"
                            title="Estatísticas"
                        >
                            📊 <span class="hidden lg:inline">Estatísticas</span>
                        </button>
                        <button
                            onclick="handleRecap();"
                            class="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            title="Recap"
                        >
                            ✨ <span class="hidden lg:inline">Recap</span>
                        </button>
                        <button
                            onclick="handleLogout();"
                            class="bg-white/10 hover:bg-red-500/40 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </div>

        ${currentView === 'stats' ? renderStatsView() : `
        <!-- Stats Summary -->
        <div class="max-w-6xl mx-auto px-4 mt-6">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"> 
                <div class="bg-white rounded-[2rem] p-5 shadow-xl shadow-purple-500/5 border border-purple-50">
                    <div class="text-2xl font-black text-purple-600">${stats.total}</div>
                    <div class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Total</div>
                </div>
                <div class="bg-white rounded-[2rem] p-5 shadow-xl shadow-blue-500/5 border border-blue-50">
                    <div class="text-2xl font-black text-blue-600">${stats.books}</div>
                    <div class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Livros</div>
                </div>
                <div class="bg-white rounded-[2rem] p-5 shadow-xl shadow-pink-500/5 border border-pink-50">
                    <div class="text-2xl font-black text-pink-600">${stats.series}</div>
                    <div class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Séries</div>
                 </div>
                 <div class="bg-white rounded-[2rem] p-5 shadow-xl shadow-yellow-500/5 border border-yellow-50">
                    <div class="text-2xl font-black text-yellow-600">${stats.movies}</div>
                    <div class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Filmes</div> 
                </div>
                <div class="bg-white rounded-[2rem] p-5 shadow-xl shadow-green-500/5 border border-green-50">
                    <div class="text-2xl font-black text-green-600">${stats.completed}</div>
                    <div class="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Concluídos</div>
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-4 pb-8">
            <!-- Controls -->
            <div class="bg-white rounded-2xl shadow-xl shadow-purple-100/50 p-5 mb-6 border border-purple-50">
                <div class="space-y-4">
                    <div class="flex gap-2">
                        <div class="relative flex-1">
                            <input
                                type="text"
                                id="searchInput"
                                placeholder="Buscar nos registros..."
                                value="${searchInput}"
                                onkeypress="if(event.key === 'Enter') performSearch();"
                                class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm transition-all"
                            />
                            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>
                        <button
                            onclick="performSearch();"
                            class="px-6 py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95 flex items-center justify-center min-w-[60px]"
                        >
                            <span class="hidden sm:inline">Buscar</span>
                            <span class="sm:hidden text-lg">🔍</span>
                        </button>
                        ${searchTerm ? `
                        <button
                            onclick="searchTerm = ''; searchInput = ''; render();"
                            class="px-4 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                        ` : ''}
                    </div>
                    
                    <div class="flex gap-2 flex-wrap sm:flex-nowrap sm:overflow-x-auto pb-2 no-scrollbar">
                        <button
                            onclick="filter = 'all'; resetPagination(); render();"
                            class="px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm flex items-center gap-2 ${filter === 'all' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                        >
                            Todos
                        </button>
                        <button
                            onclick="filter = 'books'; resetPagination(); render();"
                            class="px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm flex items-center gap-2 ${filter === 'books' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                        >
                            📖 <span class="hidden sm:inline">Livros</span>
                        </button>
                        <button
                            onclick="filter = 'series'; resetPagination(); render();"
                            class="px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm flex items-center gap-2 ${filter === 'series' ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                        >
                            📺 <span class="hidden sm:inline">Séries</span>
                        </button>
                         <button
                            onclick="filter = 'movies'; resetPagination(); render();"
                            class="px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm flex items-center gap-2 ${filter === 'movies' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-100 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
                        >
                            🎬 <span class="hidden sm:inline">Filmes</span>
                        </button> 
                    </div>



                    <div class="grid grid-cols-4 gap-2">
                        <button
                            onclick="showForm = !showForm; render();"
                            class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-3 rounded-2xl font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                            ${loading ? 'disabled' : ''}
                        >
                            <span>➕</span>
                            <span class="hidden sm:inline">Adicionar</span>
                        </button>
                        <button
                            onclick="loadData();"
                            class="bg-green-600 text-white px-3 py-3 rounded-2xl font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                            ${loading ? 'disabled' : ''}
                        >
                            <span>🔄</span>
                            <span class="hidden sm:inline">Atualizar</span>
                        </button>
                        <div class="relative col-span-2">
                            <button
                                onclick="showSortMenu = !showSortMenu; render();"
                                class="w-full bg-gray-100 text-gray-700 px-3 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <span>🔽</span>
                                <span class="hidden sm:inline">Ordenar Lista</span>
                            </button>
                            ${showSortMenu ? `
                            <div class="absolute right-0 mt-2 w-48 bg-white border border-purple-50 rounded-2xl shadow-2xl p-2 z-[100] animate-fade-in max-h-64 overflow-y-auto shadow-purple-200/50">
                                <button onclick="sortBy='title-asc'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors">Título A–Z</button>
                                <button onclick="sortBy='title-desc'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors">Título Z–A</button>
                                <button onclick="sortBy='date-desc'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors font-bold text-purple-600">Mais recentes</button>
                                <button onclick="sortBy='date-asc'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors">Mais antigos</button>
                                <button onclick="sortBy='category'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors">Categoria</button>
                                <button onclick="sortBy='status'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors">Status</button>
                                <button onclick="sortBy='rating'; showSortMenu=false; resetPagination(); render();" class="block w-full text-left px-4 py-2 hover:bg-purple-50 rounded-xl text-sm transition-colors">Avaliação</button>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form -->
            ${showForm ? `
            <div id="formPanel" class="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-purple-100 animate-fade-in">
                <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    ${editingId !== null ? '✨ Editar Registro' : '➕ Novo Registro'}
                </h2>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Categoria</label>
                            <select
                                onchange="formData.category = this.value; render();"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            >
                                ${categoryOptions.map(opt => `<option value="${opt}" ${formData.category === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Status</label>
                            <select
                                onchange="formData.status = this.value;"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            >
                                ${statusOptions.map(opt => `<option value="${opt}" ${formData.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>

                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Título do Item</label>
                            <input
                                type="text"
                                value="${formData.title}"
                                oninput="formData.title = this.value;"
                                placeholder="Ex: O Pequeno Príncipe"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            />
                        </div>

                        ${formData.category === 'Livro' ? `
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Autor(a)</label>
                            <input
                                type="text"
                                value="${formData.author}"
                                oninput="formData.author = this.value;"
                                placeholder="Ex: Antoine de Saint-Exupéry"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            />
                        </div>
                        ` : ''}

                        ${formData.category !== 'Filme' ? `
                            <div>
                                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
                                    ${formData.category === 'Livro' ? 'Total de Páginas' : 'Total de Episódios'}
                                </label>
                                <input
                                    type="number"
                                    value="${formData.pages}"
                                    oninput="formData.pages = this.value;"
                                    class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                    ${loading ? 'disabled' : ''}
                                />
                            </div>
                        ` : ''} 

                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Sua Avaliação</label>
                            <select
                                onchange="formData.rating = this.value;"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            >
                                <option value="">Como foi a experiência?</option>
                                ${ratingOptions.map(opt => `<option value="${opt}" ${formData.rating === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">Data</label>
                            <input
                                type="date"
                                value="${formData.date}"
                                onchange="formData.date = this.value;"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            />
                        </div>

                        ${formData.category === 'Série' || formData.category === 'Filme' ? `
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">País de Origem</label>
                            <select
                                onchange="formData.country = this.value;"
                                class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                                ${loading ? 'disabled' : ''}
                            >
                                <option value="">Opcional</option>
                                ${countryOptions.map(opt => `<option value="${opt}" ${formData.country === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''} 
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-6">
                        <button
                            onclick="handleSubmit();"
                            class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50 text-base shadow-purple-200"
                            ${loading ? 'disabled' : ''}
                        >
                            ${loading ? 'Salvando...' : (editingId !== null ? 'Salvar Alterações' : 'Confirmar e Salvar')}
                        </button>
                        <button
                            onclick="resetForm(); render();"
                            class="sm:w-auto px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                            ${loading ? 'disabled' : ''}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Items List -->
            <div class="space-y-4">
                ${loading && items.length === 0 ? `
                <div class="bg-white rounded-3xl shadow-md p-16 text-center border border-gray-50">
                    <div class="loading w-12 h-12 mb-6 border-purple-500 border-t-transparent"></div>
                    <p class="text-gray-400 font-medium">Conectando ao seu Mundo...</p>
                </div>
                ` : displayedItems.length === 0 ? `
                <div class="bg-white rounded-3xl shadow-md p-16 text-center border border-gray-50">
                    <div class="text-6xl mb-6">${searchTerm ? '🔍' : '✨'}</div>
                    <p class="text-gray-500 text-xl font-bold">
                        ${searchTerm ? 'Nenhum resultado para sua busca' : 'Sua estante está vazia'}
                    </p>
                    <p class="text-gray-400 mt-2">Que tal adicionar algo novo hoje?</p>
                </div>
                ` : displayedItems.map((item) => `
                <div class="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all p-5 md:p-6 border border-gray-100 group">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex items-start gap-4 flex-1">
                            <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-purple-50 transition-colors" title="${item.category}">
                                ${item.category === 'Livro' ? '📖' :
            (item.category === 'Série' || item.category === 'Serie') ? '📺' :
                (item.category === 'Filme' || item.category === 'Filmes') ? '🎬' : '❓'}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-purple-400">${item.category}</span>
                                    ${item.country ? `<span class="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">${item.country}</span>` : ''}
                                </div>
                                <h3 class="text-xl font-black text-gray-800 break-words leading-tight">${item.title}</h3>
                                ${item.author ? `<p class="text-gray-500 mt-1 font-medium text-sm flex items-center gap-1">✍️ ${item.author}</p>` : ''}
                                
                                <div class="flex flex-wrap gap-2 mt-4">
                                    <span class="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full ${item.status === 'Lido' || item.status === 'Assistido' ? 'bg-green-500' : 'bg-yellow-500'}"></span>
                                        ${item.status}
                                    </span>
                                    ${item.rating ? `
                                    <span class="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-bold border border-yellow-100">
                                        ${item.rating}
                                    </span>
                                    ` : ''}
                                    ${item.pages ? `
                                    <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100">
                                        📄 ${item.pages} ${item.category === 'Livro' ? 'págs' : 'eps'}
                                    </span>
                                    ` : ''}
                                    ${item.date ? `<span class="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold border border-purple-100">📅 ${formatDate(item.date)}</span>` : ''}
                                </div>
                            </div>
                        </div>

                        <div class="flex sm:flex-col gap-2 justify-end sm:justify-start">
                            <button
                                onclick='handleEdit(${item.id})'
                                class="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                title="Editar"
                                ${loading ? 'disabled' : ''}
                            >
                                ✏️
                            </button>
                            <button
                                onclick="handleDelete(${item.id})"
                                class="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Excluir"
                                ${loading ? 'disabled' : ''}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
                `).join('')}
                
                ${hasMore && displayedItems.length > 0 ? `
                <div class="flex justify-center py-10">
                    <button
                        onclick="currentPage++; loadMoreItems(); render();"
                        class="bg-white text-purple-600 border-2 border-purple-600 px-10 py-4 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        Carregar mais +${filteredItems.length - displayedItems.length}
                    </button>
                </div>
                ` : ''}
                
                ${displayedItems.length > 0 && !hasMore ? `
                <div class="text-center py-10 text-gray-400 font-bold text-sm tracking-widest uppercase">
                    ✨ Fim da Estante ✨
                </div>
                ` : ''}
            </div>
        </div>
        `}

        ${renderChat()}
        ${renderInsight()}
        ${renderRecapModal()}

        ${isSplashActive ? `
        <div id="splashScreen" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-60 splash-bg"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
            <div class="relative text-center px-4 animate-fade-in">
                <img src="icon.png" alt="Mundo da Alice" class="w-32 h-32 mx-auto mb-6 drop-shadow-2xl animate-bounce">
                <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tighter drop-shadow-2xl">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Mundo da Alice
                    </span>
                </h1>
                <div class="mt-8 flex justify-center">
                    <div class="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
                <p class="text-white/60 mt-4 text-sm uppercase tracking-widest font-medium">Carregando Magia...</p>
            </div>
        </div>
        ` : ''
        }
`;

    const input = document.getElementById('searchInput');
    if (input && document.activeElement === input) {
        const cursorPos = input.selectionStart;
        input.value = searchInput;
        input.setSelectionRange(cursorPos, cursorPos);
    } else if (input) {
        input.addEventListener('input', function (e) {
            searchInput = e.target.value;
        });
    }

    // Scroll para o formulário se estiver aberto
    if (showForm) {
        setTimeout(() => {
            const formPanel = document.getElementById('formPanel');
            if (formPanel) {
                formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}


function handleRecap() {
    showRecapModal = true;
    recapYear = new Date().getFullYear();
    render();
}

function getRecapData() {
    const yearItems = items.filter(i => {
        if (!i.date) return false;
        const d = toValidDate(i.date);
        return d && d.getFullYear() === parseInt(recapYear);
    });

    const completedItems = yearItems.filter(i => i.status === 'Lido' || i.status === 'Assistido');

    // Most used rating
    const ratings = completedItems.map(i => i.rating).filter(r => r);
    const ratingCounts = {};
    ratings.forEach(r => ratingCounts[r] = (ratingCounts[r] || 0) + 1);
    const mostUsedRating = Object.entries(ratingCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhuma ainda';

    // Favorite Category
    const categoryCounts = {};
    completedItems.forEach(i => categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1);
    const favoriteCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhuma ainda';

    // Stats for the year
    const books = yearItems.filter(i => i.category === 'Livro');
    const series = yearItems.filter(i => i.category === 'Série' || i.category === 'Serie');
    const movies = yearItems.filter(i => i.category === 'Filme');

    const completedBooks = books.filter(i => i.status === 'Lido');
    const completedSeries = series.filter(i => i.status === 'Assistido');

    const totalPages = completedBooks.reduce((sum, i) => sum + (parseInt(i.pages) || 0), 0);
    const totalEpisodes = completedSeries.reduce((sum, i) => sum + (parseInt(i.pages) || 0), 0);

    const yearStats = {
        total: yearItems.length,
        booksCount: books.length,
        seriesCount: series.length,
        moviesCount: movies.length,
        completedBooksCount: completedBooks.length,
        completedSeriesCount: completedSeries.length,
        completedMoviesCount: movies.filter(i => i.status === 'Assistido').length,
        completedItemsCount: completedItems.length,
        totalPages,
        totalEpisodes
    };

    return {
        ...yearStats,
        mostUsedRating,
        favoriteCategory
    };
}

function renderRecapModal() {
    if (!showRecapModal) return '';

    const data = getRecapData();
    const currentYear = new Date().getFullYear();
    const availableYears = [...new Set(items.filter(i => i.date).map(i => {
        const d = toValidDate(i.date);
        return d ? d.getFullYear() : null;
    }).filter(y => y))].sort((a, b) => b - a);
    if (!availableYears.includes(currentYear)) availableYears.unshift(currentYear);

    return `
    <div class="fixed inset-0 z-[10000] flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden relative max-h-[95vh] flex flex-col">
            <div class="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white relative">
                <button
                    onclick="showRecapModal = false; render();"
                    class="absolute top-4 right-4 text-white/80 hover:text-white text-xl"
                >✕</button>
                <div class="text-center">
                    <div class="text-4xl mb-2">✨</div>
                    <h2 class="text-2xl font-bold">Resumo ${recapYear}</h2>

                    <div class="mt-2 inline-flex items-center gap-2 bg-white/20 p-1 rounded-lg backdrop-blur-md">
                        <select
                            onchange="recapYear = parseInt(this.value); render();"
                            class="bg-transparent text-white text-sm font-bold outline-none cursor-pointer px-2"
                        >
                            ${availableYears.map(y => `<option value="${y}" ${y == recapYear ? 'selected' : ''} class="text-gray-800">${y}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <div class="p-5 overflow-y-auto space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-purple-50 p-3 rounded-2xl text-center border border-purple-100">
                        <div class="text-2xl mb-1">📚</div>
                        <div class="text-xl font-bold text-purple-700">${data.total}</div>
                        <div class="text-[10px] text-purple-600 uppercase font-bold tracking-wider">Registros</div>
                    </div>
                    <div class="bg-pink-50 p-3 rounded-2xl text-center border border-pink-100">
                        <div class="text-2xl mb-1">✅</div>
                        <div class="text-xl font-bold text-pink-700">${data.completedItemsCount}</div>
                        <div class="text-[10px] text-pink-600 uppercase font-bold tracking-wider">Concluídos</div>
                    </div>
                </div>

                <!-- Highlights Section -->
                <div class="space-y-3">
                    ${data.completedBooksCount > 0 ? `
                        <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div class="text-2xl">📖</div>
                            <div>
                                <div class="text-xs text-blue-600 font-bold uppercase tracking-tight">Livros</div>
                                <div class="text-sm font-medium text-gray-800">
                                    <span class="font-bold text-blue-700">${data.completedBooksCount}</span> livros... 
                                    <span class="font-bold text-blue-700">${data.totalPages}</span> páginas total
                                </div>
                            </div>
                        </div>
                        ` : ''}

                    ${data.completedSeriesCount > 0 ? `
                        <div class="flex items-center gap-3 p-3 bg-pink-50 rounded-xl border border-pink-100">
                            <div class="text-2xl">📺</div>
                            <div>
                                <div class="text-xs text-pink-600 font-bold uppercase tracking-tight">Séries</div>
                                <div class="text-sm font-medium text-gray-800">
                                    <span class="font-bold text-pink-700">${data.completedSeriesCount}</span> séries... 
                                    <span class="font-bold text-pink-700">${data.totalEpisodes}</span> episódios
                                </div>
                            </div>
                        </div>
                        ` : ''}

                    ${data.completedMoviesCount > 0 ? `
                        <div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                            <div class="text-2xl">🎬</div>
                            <div>
                                <div class="text-xs text-yellow-600 font-bold uppercase tracking-tight">Filmes</div>
                                <div class="text-sm font-medium text-gray-800">
                                    <span class="font-bold text-yellow-700">${data.completedMoviesCount}</span> filmes assistidos
                                </div>
                            </div>
                        </div>
                        ` : ''}
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div class="text-xs text-gray-500 uppercase font-bold mb-1">Status Favorito</div>
                        <div class="text-sm font-bold text-gray-800 truncate">${data.mostUsedRating}</div>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div class="text-xs text-gray-500 uppercase font-bold mb-1">Mais visto/lido</div>
                        <div class="text-sm font-bold text-gray-800 truncate">${data.favoriteCategory}</div>
                    </div>
                </div>

                ${data.total > 0 ? `
                    <div class="pt-2">
                        <div class="flex justify-around items-end h-24 px-2 text-center">
                            <div class="flex flex-col items-center gap-1 w-full">
                                <div class="w-full max-w-[30px] bg-blue-500 rounded-t-lg transition-all duration-1000 shadow-md" style="height: ${(data.booksCount / data.total) * 100}%"></div>
                                <div class="text-[9px] font-bold text-gray-400">${data.booksCount}</div>
                                <div class="text-[10px] font-bold text-gray-700">Livros</div>
                            </div>
                            <div class="flex flex-col items-center gap-1 w-full">
                                <div class="w-full max-w-[30px] bg-pink-500 rounded-t-lg transition-all duration-1000 shadow-md" style="height: ${(data.seriesCount / data.total) * 100}%"></div>
                                <div class="text-[9px] font-bold text-gray-400">${data.seriesCount}</div>
                                <div class="text-[10px] font-bold text-gray-700">Séries</div>
                            </div>
                            <div class="flex flex-col items-center gap-1 w-full">
                                <div class="w-full max-w-[30px] bg-yellow-500 rounded-t-lg transition-all duration-1000 shadow-md" style="height: ${(data.moviesCount / data.total) * 100}%"></div>
                                <div class="text-[9px] font-bold text-gray-400">${data.moviesCount}</div>
                                <div class="text-[10px] font-bold text-gray-700">Filmes</div>
                            </div>
                        </div>
                    </div>
                    ` : `
                    <div class="text-center py-4 text-gray-400">
                        <p class="text-sm">Nenhum registro em ${recapYear}</p>
                    </div>
                    `}
            </div>

            <div class="p-4 bg-gray-50 border-t flex justify-center">
                <button
                    onclick="showRecapModal = false; render();"
                    class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-2.5 rounded-full font-bold shadow-lg text-sm"
                >
                    Fechar
                </button>
            </div>
        </div>
        </div>
    `;
}

// Splash Screen Logic
function initSplashScreen() {
    if (!isSplashActive) return;

    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => {
                isSplashActive = false;
                render();
            }, 800);
        } else {
            // Se o elemento não for encontrado (ex: render demorou), tenta novamente em breve
            setTimeout(initSplashScreen, 500);
        }
    }, 2500);
}

initSplashScreen();

checkSavedLogin();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {

        const swCode = `
const CACHE_NAME = 'biblioteca-v3';

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['./', './biblioteca.html', './style.css', './script.js']);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
`;

        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        navigator.serviceWorker.register(swUrl)
            .then(registration => {
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New update available
                                console.log('Nova versão disponível!');
                            }
                        }
                    };
                };
            })
            .catch(err => console.error('Erro ao registrar SW:', err));
    });
}
