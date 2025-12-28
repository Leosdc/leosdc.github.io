# 📚 Mundo da Alice

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
- **Recap "Seu Resumo"**: Modal premium com estatísticas detalhadas (Total, Concluídos, Favoritos) e gráficos de distribuição
- **Gráficos Interativos**:
  - Visualização diária, mensal ou anual
  - Filtro por tipo (todos, livros, séries ou filmes)
  - Barras coloridas com gradiente

### 💾 Sincronização em Nuvem
- **Google Sheets**: Todos os dados sincronizados automaticamente
- **Tempo Real**: Alterações refletidas instantaneamente
- **Backup Automático**: Seus dados sempre seguros na nuvem

### 🤖 Inteligência Artificial (Groq)
- **Alice - Assistente Inteligente**: Registre livros, filmes ou séries conversando com a Alice, inspirada no País das Maravilhas
- **Sistema de Sugestões**: Botão "Sugerir algo 🪄" que analisa seu histórico para recomendar novas obras
- **IA Curiosa**: Receba fatos e curiosidades sobre os itens da sua biblioteca
- **Segurança de API**: Chave do Groq escondida com segurança no Google Apps Script

## 🚀 Como Usar

### 1. Preparação do Google Sheets

#### a) Criar a Planilha
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Renomeie a primeira aba para **"Usuarios"**
4. Crie uma segunda aba chamada **"Biblioteca"**

#### b) Configurar a Aba "Usuarios"
Na primeira linha, adicione os seguintes cabeçalhos:
```
Usuario | Senha
```

#### c) Configurar Abas de Usuário
As abas dos usuários são criadas automaticamente. Elas seguem este padrão de cabeçalho:
```
Usuário | Título | Autor | Páginas/Episódios | Status | Avaliação | Data | Categoria | País
```
*(Nota: O campo "Tempo médio" foi removido na versão 5.0)*

### 2. Configuração do Google Apps Script

#### a) Abrir o Editor de Scripts
1. Na planilha, vá em **Extensões > Apps Script**
2. Delete qualquer código existente
3. Cole o código atualizado do servidor (backend).

*(Consulte o código atualizado do `server.js` ou arquivo correspondente se houver, ou mantenha o script anterior mas saiba que o campo Tempo Médio não será mais enviado)*

#### b) Implantar o Script
1. Clique em **Implantar > Nova implantação**
2. Selecione **Aplicativo da Web**
3. Configure como "Executar como: Eu" e "Acesso: Qualquer pessoa"
4. Copie a URL gerada

#### c) Configurar API Key do Groq
1. No Apps Script, vá em **Configurações do Projeto (engrenagem)**
2. Procure por **Propriedades do script**
3. Adicione uma propriedade com nome `GROQ_API_KEY` e cole sua chave do Groq
4. Execute a função `doPost` uma vez para autorizar chamadas externas (`UrlFetchApp`)

### 3. Configuração do Arquivo HTML

A partir da versão 3.0, o projeto é modular.
1. Abra o arquivo `env.js` (ou crie um se não existir)
2. Defina a `API_URL` com a URL do seu Apps Script
3. Certifique-se de que o `env.js` está listado no `.gitignore`

### 4. Usar o Aplicativo

#### Adicionar Itens
1. Clique no botão **➕ Adicionar**
2. Preencha as informações:
   - Selecione a categoria (Livro, Série ou Filme)
   - Digite o título e demais campos
3. Clique em **Adicionar**

#### Filtros
- Use os botões no topo para alternar entre "Todos", "📖 Livros", "📺 Séries" ou "🎬 Filmes".

## 📱 Instalação como PWA

O app pode ser instalado como aplicativo no celular ou computador.
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

## 📄 Licença

Este projeto foi criado especialmente para a minha linda esposa Ana Alice! ❤️

---

**Versão**: 5.0.0  
**Última atualização**: 28 de Dezembro de 2025  
**Desenvolvido com**: HTML, CSS, JavaScript, TailwindCSS, Google Apps Script, Groq API
