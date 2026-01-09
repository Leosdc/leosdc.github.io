# 📚 Mundo da Alice

![Version](https://img.shields.io/badge/version-5.3.1-purple?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

App que fiz para minha esposa organizar e gerenciar livros, séries e filmes!

## 🌟 Funcionalidades

### 👤 Sistema de Autenticação
- **Login/Cadastro**: Sistema completo de usuários com proteção por senha
- **Sessão Persistente**: Login salvo automaticamente no navegador
- **Multi-usuário**: Cada usuário tem sua própria biblioteca isolada

### 📖 Gerenciamento de Conteúdo
- **Livros, Séries e Filmes**: Organize três tipos de conteúdo em um único lugar
- **Informações Completas**:
  - Título (obrigatório)
  - Autor (para livros)
  - Número de páginas/episódios (para livros e séries)
  - Status (Quero ler/assistir, Lido, Assistido, Desisti)
  - Avaliação com emojis (Maravilhoso 😍 até Péssimo 😒)
  - Data de conclusão
  - País de origem (para séries e filmes)

### 🔍 Busca e Filtros
- **Busca Inteligente**: Pesquise por título ou autor
- **Filtros por Categoria**: Todos, Livros, Séries ou Filmes
- **Múltiplas Ordenações**:
  - Título (A-Z ou Z-A)
  - Data (mais recentes ou mais antigos)
  - Categoria
  - Status
  - Avaliação

### 📊 Estatísticas e Gráficos
- **Dashboard**: Visualização rápida de totais por categoria e concluídos
- **Recap "Seu Resumo"**: Modal premium otimizado para screenshots com estatísticas detalhadas (Páginas de livros, Episódios de séries) e gráficos categorizados
- **Gráficos Interativos**:
  - Visualização diária, mensal ou anual
  - Filtro por tipo (todos, livros, séries ou filmes)
  - Barras coloridas com gradiente
  - Conversão automática de formatos de data

### 💾 Sincronização em Nuvem
- **Google Sheets**: Todos os dados sincronizados automaticamente
- **Tempo Real**: Alterações refletidas instantaneamente
- **Backup Automático**: Seus dados sempre seguros na nuvem

### 🤖 Inteligência Artificial (Groq)
- **Alice - Assistente Inteligente**: Registre livros, filmes ou séries conversando com a Alice, inspirada no País das Maravilhas
- **Sistema de Sugestões**: Botão "Sugerir algo 🪄" que analisa seu histórico para recomendar novas obras
- **IA Curiosa**: Receba fatos e curiosidades sobre os itens da sua biblioteca
- **Segurança de API**: Chave do Groq escondida com segurança no Google Apps Script

## 🚀 Como usar o Aplicativo

### Adicionar Itens
1. Clique no botão **➕ Adicionar**
2. Preencha as informações:
   - Selecione a categoria (Livro, Série ou Filme)
   - Digite o título e demais campos
3. Clique em **Adicionar**

### Filtros e Ordenação
- Use os botões no topo para alternar entre "Todos", "📖 Livros", "📺 Séries" ou "🎬 Filmes"
- Clique em "🔽 Ordenar Lista" para escolher como organizar seus itens
- A opção selecionada fica destacada em roxo

### Estatísticas
- Acesse o botão "📊 Estatísticas" no cabeçalho
- Escolha o período: Diário, Mensal ou Anual
- Filtre por categoria específica ou veja tudo junto

## 📱 Instalação como PWA

O app pode ser instalado como aplicativo no celular ou computador:
1. Abra no navegador
2. Selecione "Adicionar à tela inicial" ou "Instalar"

## 🎨 Recursos Visuais

- **Legenda Dinâmica**: Citações literárias aleatórias que mudam a cada acesso
- **Recap de Conclusão**: Resumo visual premium das suas conquistas
- **Splash Screen Animada**: Tela de abertura com fundo de livros e animações suaves
- **Otimização Mobile**: Cabeçalho e interface centralizados para melhor uso no celular
- **Design Responsivo**: Funciona perfeitamente em qualquer dispositivo
- **Tema Moderno**: Gradientes roxo e rosa
- **Modularizado**: Código dividido em HTML, CSS e JS para melhor performance e manutenção

## 🐛 Correções Recentes (v5.3.1)

- ✅ **Gráficos funcionando**: Corrigido bug onde gráficos não exibiam dados devido a formato de data ISO do Google Sheets
- ✅ **Menu de ordenação visual**: Opção selecionada agora fica destacada em roxo
- ✅ **Botão buscar alinhado**: Altura ajustada para ficar perfeitamente alinhado com a barra de pesquisa

## 🛠️ Tecnologias

| Tecnologia | Versão/Modelo | Uso |
|------------|---------------|-----|
| JavaScript | ES6+ | Lógica principal |
| HTML5 | - | Estrutura |
| CSS3 | - | Estilização |
| TailwindCSS | CDN | Framework CSS |
| Google Apps Script | - | Backend e API Proxy |
| Google Sheets | - | Banco de dados |
| Groq API | Llama 3.3 70B | Assistente IA |

## 📄 Licença

Este projeto foi criado especialmente para a minha linda esposa Ana Alice! ❤️

MIT License - veja [LICENSE](LICENSE) para mais detalhes.

---

**Versão**: 5.3.1  
**Última atualização**: 09 de Janeiro de 2026  
**Desenvolvido com**: ❤️ e muito ☕ por Leonardo da Cruz
