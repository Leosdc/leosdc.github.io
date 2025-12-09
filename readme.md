# 📚 Mundo da Alice

App que fiz para minha esposa organizar e gerenciar livros e séries!

## 🌟 Funcionalidades

### 👤 Sistema de Autenticação
- **Login/Cadastro**: Sistema completo de usuários com proteção por senha
- **Sessão Persistente**: Login salvo automaticamente no navegador
- **Multi-usuário**: Cada usuário tem sua própria biblioteca isolada

### 📖 Gerenciamento de Conteúdo
- **Livros e Séries**: Organize ambos os tipos de conteúdo em um único lugar
- **Informações Completas**:
  - Título (obrigatório)
  - Autor (para livros)
  - Número de páginas/episódios
  - Status (Quero ler/assistir, Lido, Assistido, Desisti)
  - Avaliação com emojis (Maravilhoso 😍 até Péssimo 😒)
  - Data de conclusão
  - País de origem (para séries)
  - Tempo médio por episódio (para séries)

### 🔍 Busca e Filtros
- **Busca Inteligente**: Pesquise por título ou autor
- **Filtros por Categoria**: Todos, Livros ou Séries
- **Múltiplas Ordenações**:
  - Título (A-Z ou Z-A)
  - Data (mais recentes ou mais antigos)
  - Categoria
  - Status
  - Avaliação

### 📊 Estatísticas e Gráficos
- **Dashboard**: Visualização rápida de totais, livros, séries e concluídos
- **Gráficos Interativos**:
  - Visualização diária, mensal ou anual
  - Filtro por tipo (todos, livros ou séries)
  - Barras coloridas com gradiente

### 💾 Sincronização em Nuvem
- **Google Sheets**: Todos os dados sincronizados automaticamente
- **Tempo Real**: Alterações refletidas instantaneamente
- **Backup Automático**: Seus dados sempre seguros na nuvem

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

#### c) Configurar a Aba "Biblioteca"
Na primeira linha, adicione os seguintes cabeçalhos:
```
Usuario | Título | Autor | Nº Páginas | Episódios | Status | Avaliação | Data | Categoria | País | Tempo médio
```

### 2. Configuração do Google Apps Script

#### a) Abrir o Editor de Scripts
1. Na planilha, vá em **Extensões > Apps Script**
2. Delete qualquer código existente
3. Cole o código abaixo:

```javascript
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const params = e.parameter;
  
  // Verificar usuário
  if (params.action === 'checkUser') {
    const usuariosSheet = ss.getSheetByName('Usuarios');
    const usuarios = usuariosSheet.getDataRange().getValues();
    
    for (let i = 1; i < usuarios.length; i++) {
      if (usuarios[i][0] === params.username && usuarios[i][1] === params.password) {
        return ContentService.createTextOutput(JSON.stringify({success: true}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Buscar dados do usuário
  const username = params.username;
  const sheet = ss.getSheetByName('Biblioteca');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const userItems = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = data[i][index];
      });
      userItems.push(item);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(userItems))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);
  
  // Registrar novo usuário
  if (data.action === 'registerUser') {
    const usuariosSheet = ss.getSheetByName('Usuarios');
    usuariosSheet.appendRow([data.username, data.password]);
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const sheet = ss.getSheetByName('Biblioteca');
  const allData = sheet.getDataRange().getValues();
  
  // Adicionar item
  if (data.action === 'add') {
    sheet.appendRow([
      data.username,
      data.title,
      data.author || '',
      data.category === 'Livro' ? data.pages : '',
      data.category === 'Série' ? data.pages : '',
      data.status,
      data.rating,
      data.date,
      data.category,
      data.country || '',
      data.avgTime || ''
    ]);
  }
  
  // Atualizar item
  if (data.action === 'update') {
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] === data.username && allData[i][1] === data.oldTitle) {
        sheet.getRange(i + 1, 2).setValue(data.title);
        sheet.getRange(i + 1, 3).setValue(data.author || '');
        sheet.getRange(i + 1, 4).setValue(data.category === 'Livro' ? data.pages : '');
        sheet.getRange(i + 1, 5).setValue(data.category === 'Série' ? data.pages : '');
        sheet.getRange(i + 1, 6).setValue(data.status);
        sheet.getRange(i + 1, 7).setValue(data.rating);
        sheet.getRange(i + 1, 8).setValue(data.date);
        sheet.getRange(i + 1, 9).setValue(data.category);
        sheet.getRange(i + 1, 10).setValue(data.country || '');
        sheet.getRange(i + 1, 11).setValue(data.avgTime || '');
        break;
      }
    }
  }
  
  // Deletar item
  if (data.action === 'delete') {
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] === data.username && allData[i][1] === data.title) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

#### b) Implantar o Script
1. Clique em **Implantar > Nova implantação**
2. Clique no ícone de engrenagem ⚙️ e selecione **Aplicativo da Web**
3. Configure:
   - **Descrição**: Mundo da Alice API
   - **Executar como**: Eu
   - **Quem pode acessar**: Qualquer pessoa
4. Clique em **Implantar**
5. **COPIE A URL** fornecida (algo como `https://script.google.com/macros/s/ABC123.../exec`)
6. Autorize o acesso quando solicitado

### 3. Configuração do Arquivo HTML

1. Abra o arquivo `biblioteca.html`
2. Localize esta linha (próximo ao início do código JavaScript):
```javascript
const API_URL = 'https://script.google.com/macros/s/xxx/exec';
```
3. **SUBSTITUA** pela URL que você copiou do Apps Script
4. Salve o arquivo

### 4. Usar o Aplicativo

#### Primeira Vez
1. Abra o arquivo `biblioteca.html` em qualquer navegador moderno
2. Clique em **Cadastrar**
3. Escolha um usuário e senha (mínimo 4 caracteres)
4. Clique em **Criar Conta**

#### Login
1. Digite seu usuário e senha
2. Clique em **Entrar**
3. Seus dados serão carregados automaticamente

#### Adicionar Itens
1. Clique no botão **➕ Adicionar**
2. Preencha as informações:
   - Selecione a categoria (Livro ou Série)
   - Digite o título (obrigatório)
   - Preencha os demais campos conforme necessário
3. Clique em **Adicionar**

#### Gerenciar Itens
- **Editar**: Clique no botão azul "Editar" em qualquer item
- **Excluir**: Clique no botão vermelho "Excluir" (confirmação necessária)
- **Atualizar**: Use o botão "🔄 Atualizar" para sincronizar com o Google Sheets

#### Buscar e Filtrar
- **Busca**: Digite no campo de busca e pressione Enter ou clique em "Buscar"
- **Filtros**: Use os botões "Todos", "📖 Livros" ou "📺 Séries"
- **Ordenar**: Clique em "🔽 Ordenar" e escolha o critério

#### Ver Estatísticas
1. Clique no botão **📊 Gráficos**
2. Escolha o período (Diário, Mensal, Anual)
3. Filtre por tipo se desejar (Todos, Livros, Séries)

## 📱 Instalação como PWA

O app pode ser instalado como aplicativo no celular ou computador:

### No Celular (Android/iOS)
1. Abra o arquivo no navegador
2. Toque no menu do navegador (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### No Computador (Chrome/Edge)
1. Abra o arquivo no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou vá em Menu > Instalar Mundo da Alice

## 🎨 Recursos Visuais

- **Design Responsivo**: Funciona perfeitamente em celular, tablet e desktop
- **Tema Moderno**: Gradientes roxo e rosa com interface limpa
- **Animações Suaves**: Transições e efeitos visuais agradáveis
- **Notificações**: Feedback visual para todas as ações
- **Loading States**: Indicadores de carregamento durante operações

## 🔒 Segurança

- Senhas armazenadas no Google Sheets (em produção, use hash)
- Cada usuário vê apenas seus próprios dados
- Autenticação necessária para todas as operações
- Sessão local salva com segurança no navegador

## 🛠️ Requisitos Técnicos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para sincronização)
- Conta Google (para o Google Sheets)

## 📝 Formatos de Dados

### Data
- Formato: DD/MM/AAAA
- Exemplo: 09/12/2025

### Tempo Médio (séries)
- Formato: HH:MM:SS
- Exemplo: 01:00:00 (1 hora)
- Exemplo: 00:45:00 (45 minutos)

### Status Disponíveis
- Quero ler/assistir
- Lido
- Assistido
- Desisti

### Avaliações Disponíveis
- Maravilhoso 😍
- Muito bom 😊
- Bom 🙂
- Mais ou menos 🤨
- Ruim 🙁
- Péssimo 😒

## 💡 Dicas de Uso

1. **Backup**: O Google Sheets serve como backup automático
2. **Organização**: Use as avaliações para lembrar do que mais gostou
3. **Estatísticas**: Acompanhe seu progresso pelos gráficos
4. **Busca**: Use a busca para encontrar rapidamente qualquer item
5. **Múltiplos Dispositivos**: Acesse de qualquer lugar com seus dados sincronizados

## 🐛 Solução de Problemas

### Não consigo fazer login
- Verifique se o usuário e senha estão corretos
- Confirme que a aba "Usuarios" existe no Google Sheets
- Verifique se a URL do Apps Script está correta

### Dados não aparecem
- Clique no botão "🔄 Atualizar"
- Verifique sua conexão com internet
- Confirme que a aba "Biblioteca" existe no Google Sheets

### Erro ao adicionar/editar
- Verifique se o título está preenchido
- Aguarde alguns segundos e tente novamente
- Clique em "Atualizar" para sincronizar

### Menu de ordenação aparece no lugar errado
- Isso foi corrigido! O menu agora aparece próximo ao botão
- Atualize o arquivo HTML com a versão mais recente

## 🎯 Funcionalidades Futuras (Sugestões)

- [ ] Exportar dados em CSV/PDF
- [ ] Compartilhar listas com outros usuários
- [ ] Categorias personalizadas
- [ ] Notas e comentários nos itens
- [ ] Sistema de tags
- [ ] Metas de leitura
- [ ] Integração com APIs de livros/séries

## 📄 Licença

Este projeto foi criado especialmente para a princesa Ana Alice! ❤️

---

**Versão**: 2.0  
**Última atualização**: Dezembro 2025  
**Desenvolvido com**: HTML, JavaScript, TailwindCSS, Google Apps Script
