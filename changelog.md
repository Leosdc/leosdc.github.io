# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

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
