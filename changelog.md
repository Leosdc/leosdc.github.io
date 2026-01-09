# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [5.3.1] - 2026-01-09
### Corrigido
- **Gráficos de Estatísticas**: Corrigido bug crítico onde os gráficos não exibiam dados. O problema era a conversão de datas ISO (timestamp) do Google Sheets para o formato DD/MM/YYYY.
- **Menu de Ordenação**: O menu "Ordenar Lista" agora destaca visualmente a opção selecionada com fundo roxo claro e texto em negrito.
- **Botão Buscar**: Ajustado o tamanho do botão "Buscar" para ficar perfeitamente alinhado com a barra de pesquisa (altura fixa de 48px).

### Técnico
- Implementada função de conversão automática de timestamps ISO para formato DD/MM/YYYY na função `getChartData()`.
- Adicionado destaque visual condicional (`${sortBy === '...' ? 'bg-purple-100 text-purple-700 font-bold' : ''}`) no menu de ordenação.

## [5.3.0] - 2026-01-06
### Adicionado
- **Nova interface**: Criada uma nova interface gráfica para o app, com transições mais suaves.
- **Estatísticas**: As estatísticas agora possuem uma tela própria, com gráficos e estatísticas detalhadas.

### Bugs conhecidos
- **Estatísticas mensais, anuais e semanal não estão funcionando corretamente**: As estatísticas não estão funcionando corretamente, pois não estão sendo atualizadas na interface.

## [5.2.0] - 2025-12-31
### Adicionado
- **Estatísticas Detalhadas no Recap**: O resumo anual agora mostra o total de páginas lidas para livros e total de episódios para séries.
- **Design para Redes Sociais**: O modal de Recap foi redesenhado para ser mais compacto e "printável", facilitando o compartilhamento em redes sociais.
- **Separação Visual**: Nova identidade visual por categorias dentro do Recap (Azul para Livros, Rosa para Séries, Amarelo para Filmes).

## [5.1.0] - 2025-12-28
### Alterado
- **Modelo de Segurança**: Migração para um sistema de validação de credenciais diretamente no backend (App Script).
- **GitHub Pages**: A `API_URL` voltou a ser pública no `script.js` para garantir compatibilidade com o deploy estático.
- **Simplificação**: Removida a dependência do arquivo `env.js`, unificando a configuração.
- **Resiliência**: Todas as chamadas ao backend agora enviam credenciais criptografadas (via HTTPS) para validação obrigatória.

## [5.0.0] - 2025-12-27

### Adicionado
- **Partitionamento por Usuário**: Os dados de cada usuário agora são isolados em suas próprias abas (ex: `anaalice`, `juliana`), garantindo total privacidade e performance.
- **Auto-Provisionamento**: Novas abas de usuários são criadas automaticamente no primeiro registro ou cadastro.
- **Utilitário de Limpeza**: Nova função `removerColunaTempoMedio` para automatizar a manutenção da planilha.
- **Segurança de API**: A URL do App Script foi movida para variáveis de ambiente (`.env` e `env.js`) protegidas por gitignore.

### Alterado
- **Arquitetura de Dados**: Transição de uma tabela única ("Biblioteca") para abas individuais nomeadas por nome de usuário.
- **Contexto da IA**: A Alice agora utiliza o histórico exclusivo da aba do usuário logado para sugestões e insights.

### Removido
- **Coluna Tempo Médio**: Removido completamente do banco de dados e da interface para simplificar o preenchimento.

## [4.8.0] - 2025-12-26

### Alterado
- **Sugestões com Autor**: O sistema de sugestões agora inclui explicitamente o nome do autor quando recomenda um livro, melhorando a precisão e utilidade das recomendações.

## [4.7.0] - 2025-12-23

### Alterado
- **Assistente Personalizado**: O assistente agora se apresenta como "Alice" (do País das Maravilhas) em vez de "Assistente da Alice"
- **Ícone da Alice**: Criado e implementado ícone estilizado do rosto da Alice, substituindo o emoji de robô 🤖
- **Identidade do Chat**: Todas as mensagens e referências ao assistente foram atualizadas para refletir a nova identidade como "Alice"

### Corrigido
- **Carregamento do App**: Corrigido erro crítico onde o app abria o arquivo README ao invés da aplicação. O arquivo principal foi renomeado para `index.html`.
- **Ícone do Aplicativo**: O ícone de instalação (PWA) agora usa corretamente a imagem da Alice de cabelo preto, substituindo o ícone antigo de livros.

## [4.6.0] - 2025-12-23

### Adicionado
- **Ícone Personalizado**: Novo ícone SVG customizado com design de livro mágico, gradiente roxo-rosa e estrelas douradas, substituindo o emoji genérico.
- **Tipografia Premium**: Fonte Cinzel (Google Fonts) aplicada ao título "Mundo da Alice" para um visual mais elegante e literário.

### Alterado
- **Identidade Visual**: Todos os ícones (favicon, PWA, Apple Touch) agora usam o design customizado.
- **Tela de Login**: Ícone SVG animado substituiu o emoji na tela de entrada.

## [4.5.0] - 2025-12-23

### Adicionado
- **Recap Anual**: O modal de Recap agora permite filtrar as estatísticas por ano. Foi adicionado um seletor de anos dinâmico que detecta todos os anos presentes na sua biblioteca.
- **Gráficos e Estatísticas Melhores**: O Recap agora exibe o número exato de itens acima das barras de categoria e as barras possuem um design mais robusto com sombras e cores vibrantes.

- **Interface**: O botão de fechar do Recap foi renomeado de "Continuar Lendo" para apenas "Continuar", tornando a navegação mais direta.

### Corrigido
- **Cálculos do Recap**: Corrigida falha no processamento de estatísticas anuais. O sistema agora interpreta corretamente datas no formato `DD/MM/AAAA`, garantindo que o resumo anual exiba os números reais da planilha.

## [4.4.0] - 2025-12-23

## [4.3.0] - 2025-12-23

## [4.2.0] - 2025-12-22

### Adicionado
- **Funcionalidade de Sugestões**: Novo botão "Sugerir algo 🪄" no assistente de chat. A IA agora analisa seu histórico de leitura/visualização e sugere novos títulos com sinopse e motivo da recomendação.

### Corrigido
- **Padronização de Avaliações**: Implementada sanitização automática para avaliações via IA. Mesmo que o assistente esqueça o emoji, o sistema agora garante o formato correto (ex: "Bom" vira "Bom 🙂").
- **Instruções da IA**: Reforço no sistema para que a IA sempre siga estritamente o formato de avaliação com emoji.

## [4.1.0] - 2025-12-22

### Adicionado
- **Prompt IA Aprimorado**: O assistente agora solicita explicitamente a data de leitura/assistência no formato `DD/MM/AAAA`.
- **Labels de Avaliação**: Emojis de avaliação atualizados para corresponder à interface do usuário (`Mais ou menos 🤨` e `Péssimo 😒`).

### Alterado
- **Curiosidades**: O tempo de exibição do balão de curiosidades foi aumentado de 10 para 30 segundos.

### Corrigido
- **Edição de Itens**: Corrigido bug onde os campos de **Data** e **Avaliação** apareciam vazios ao tentar editar um item. A lógica de conversão de data agora é mais robusta.
- **Data Padrão**: O formulário agora respeita quando uma data é deixada vazia, em vez de preencher automaticamente com a data de hoje.

## [4.0.0] - Dezembro 2025

### Adicionado
- **Assistente de Chat (IA)**: Integração com a API do Groq (`llama-3.3-70b-versatile`) para registro de itens através de conversação.
- **Bolha de Curiosidades**: Sistema que gera fatos interessantes sobre os itens da sua biblioteca usando IA.
- **Segurança Backend**: Proxy seguro via Google Apps Script para proteger a API Key do Groq.
- **Interface**: Novos botões flutuantes e animações para o chat e bolha de insights.

### Corrigido
- **Quebra de Texto**: Ajustado o CSS para evitar que mensagens longas saiam do balão de chat.
- **Autenticação**: Agora o sistema exige usuário e senha salvos localmente para permitir chamadas à IA.

## [3.1.0] - 2025-12-20

### Corrigido
- **Ordenação por Data**: Corrigido o erro que impedia a ordenação correta por "Mais recente" ou "Mais antigo". Agora o sistema processa corretamente datas no formato `DD/MM/AAAA`.
- **Robustez de Datas**: Novo sistema de tratamento de datas que aceita múltiplos formatos (`DD/MM/AAAA`, `AAAA-MM-DD`, ISO).

## [3.0.0] - Dezembro 2025

### Adicionado
- **Categoria Filmes**: Agora é possível adicionar, filtrar e ver estatísticas de Filmes 🎬.
- **Modularização**: O projeto foi dividido em arquivos separados (`biblioteca.html`, `style.css`, `script.js`) para facilitar a manutenção.
- **Filtros**: Novo filtro específico para "Filmes".
- **Design**: Novo ícone para identificar filmes na lista.

### Removido
- **Tempo Médio**: O campo "Tempo Médio" foi removido do formulário e da visualização dos itens.
- **Código Inline**: CSS e JavaScript foram removidos do arquivo HTML principal.


### Corrigido
- **Ordenação por Data**: Corrigido o erro que impedia a ordenação correta por "Mais recente" ou "Mais antigo". Agora o sistema processa corretamente datas no formato `DD/MM/AAAA`.
- **Processamento de Datas**: Implementada função robusta para garantir que formatos variados de data (planilha, input e sistema) sejam interpretados de forma consistente.
