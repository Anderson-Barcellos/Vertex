# 🤖 Guia de Agentes - Sistema Vertex US

## 📚 O que são Agentes?

Agentes são assistentes especializados que focam em tarefas específicas. Cada agente tem:

- **Papel definido**: Uma área específica de responsabilidade
- **Conhecimento especializado**: Expertise em sua área
- **Autonomia limitada**: Trabalha apenas em seu escopo

## 🎯 Como usar Agentes

### Para você (usuário):

1. **Aprovar lançamento**: Eu sugiro qual agente usar, você aprova
2. **Revisar resultados**: O agente retorna um relatório do que fez
3. **Validar mudanças**: Você testa e confirma se está tudo OK
4. **Solicitar ajustes**: Pode pedir correções ou melhorias

### Comandos úteis:

- "Lance o Agent-Layout" - Inicia um agente específico
- "Lance todos os agentes em paralelo" - Múltiplos agentes simultâneos
- "Mostre o que o agente fez" - Ver relatório detalhado
- "Desfaça as mudanças do agente" - Reverter se necessário

## 👥 Nossos Agentes Especializados

###  1. 🎨 **Agent-Layout**

**Responsabilidade**: Interface e Posicionamento

**Tarefas**:

- Corrigir posicionamento de elementos (mt-32, painéis flutuantes)
- Ajustar layout responsivo e breakpoints
- Resolver conflitos de z-index
- Garantir alinhamento correto dos componentes
- Otimizar espaçamento e margens

**Arquivos que modifica**:

- `src/pages/AbdomeTotalExam.tsx`
- `src/pages/BreastExam.tsx`
- `src/components/*.tsx`
- `src/styles/animations.css`

**Critérios de sucesso**:

- [ ] Painéis alinhados sem margin-top fixo
- [ ] Layout funcional em todas resoluções
- [ ] Sem sobreposição de elementos
- [ ] Folha A4 centralizada corretamente

---

### 2. 🧠 **Agent-AI-Integration**

**Responsabilidade**: Integração com IAs (Gemini/OpenAI)

**Tarefas**:

- Unificar sistema de streaming
- Corrigir duplicação de chamadas de IA
- Implementar indicadores de carregamento
- Gerenciar AbortControllers corretamente
- Padronizar respostas entre modelos

**Arquivos que modifica**:

- `src/services/geminiStreamService.ts`
- `src/services/openaiStreamService.ts`
- `src/pages/AbdomeTotalExam.tsx`
- `src/components/ReportCanvas.tsx`

**Critérios de sucesso**:

- [ ] Sem duplicação de conteúdo IA
- [ ] Indicadores visuais durante processamento
- [ ] Fallback consistente entre modelos
- [ ] Cleanup adequado de recursos

---

### 3. ✨ **Agent-UX-Polish**

**Responsabilidade**: Experiência do Usuário

**Tarefas**:

- Melhorar sistema de detecção de dropdowns
- Aprimorar animações e transições
- Ajustar tipografia para legibilidade
- Implementar feedback visual consistente
- Otimizar fluxo de interação

**Arquivos que modifica**:

- `src/components/FindingDetailsEnhanced.tsx`
- `src/styles/animations.css`
- `src/components/SelectedFindingsPanel.tsx`
- Componentes de UI em geral

**Critérios de sucesso**:

- [ ] Dropdowns não fecham painel lateral
- [ ] Animações suaves e consistentes
- [ ] Fonte legível em todos tamanhos
- [ ] Feedback visual claro para ações

---

### 4. 🏗️ **Agent-Architecture**

**Responsabilidade**: Arquitetura e Código Limpo

**Tarefas**:

- Extrair lógica de negócio para hooks/services
- Reduzir props excessivas
- Criar abstrações reutilizáveis
- Implementar padrões SOLID
- Melhorar tipagem TypeScript

**Arquivos que modifica**:

- Todos os componentes principais
- Criação de novos hooks em `src/hooks/`
- Criação de novos services em `src/services/`

**Critérios de sucesso**:

- [ ] Componentes com responsabilidade única
- [ ] Lógica de IA extraída dos componentes
- [ ] Props reduzidas e bem tipadas
- [ ] Código mais testável e manutenível

## 📋 Problemas Identificados (Status)

### 🔴 Críticos

- [x] 1. Impressão IA fora da folha A4 ✅ RESOLVIDO
- [ ] 2. Posicionamento problemático dos painéis (mt-32)
- [ ] 3. Duplicação de conteúdo IA

### 🟠 Graves

- [ ] 4. Conflito na detecção de dropdowns
- [ ] 5. Layout responsivo quebrado
- [ ] 6. Gestão inadequada de streaming

### 🟡 Médios

- [ ] 7. Inconsistência visual entre IAs
- [ ] 8. Altura dinâmica dos painéis
- [ ] 9. Scroll desnecessário no A4
- [ ] 10. Erro parsing JSON OpenAI
- [ ] 11. Vazamento de memória
- [ ] 12. Fallback inconsistente

### 🟢 Baixos

- [ ] 13. Animações inconsistentes
- [ ] 14. Z-index conflicts
- [ ] 15. Tipografia inadequada
- [ ] 16. Props excessivas
- [ ] 17. Lógica no componente UI

## 🚀 Workflow Sugerido

### Fase 1: Correções Críticas

1. **Agent-Layout**: Corrigir problema #2 (painéis mt-32)
2. **Agent-AI-Integration**: Resolver problema #3 (duplicação IA)

### Fase 2: Melhorias Graves

3. **Agent-UX-Polish**: Unificar detecção dropdowns (#4)
4. **Agent-Layout**: Corrigir responsividade (#5)
5. **Agent-AI-Integration**: Melhorar streaming (#6)

### Fase 3: Polish Final

6. **Todos os agentes**: Resolver problemas médios e baixos

## 📝 Como Acompanhar

Cada agente irá:

1. Analisar seu escopo
2. Propor mudanças
3. Implementar correções
4. Gerar relatório final
5. Aguardar sua validação

Você pode:

- Pedir status a qualquer momento
- Solicitar rollback se necessário
- Pedir explicações detalhadas
- Sugerir ajustes

## 🎮 Comandos de Exemplo

```bash
# Lançar agente específico
"Lance o Agent-Layout para corrigir o problema dos painéis"

# Múltiplos agentes
"Lance Agent-Layout e Agent-UX em paralelo"

# Verificar progresso
"Qual o status dos agentes?"

# Revisar mudanças
"Mostre o que foi alterado pelo Agent-Layout"

# Aprovar/Rejeitar
"Aprovo as mudanças" ou "Reverta as mudanças"
```

## 📊 Métricas de Sucesso

Ao final, devemos ter:

- ✅ Todos os 17 problemas resolvidos
- ✅ Código mais limpo e manutenível
- ✅ UX consistente e polida
- ✅ Performance otimizada
- ✅ Documentação atualizada

---

**Última atualização**: 25 de Setembro de 2025
**Problemas resolvidos**: 1/17
**Próximo agente sugerido**: Agent-Layout (problema #2)
