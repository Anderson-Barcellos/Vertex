# 🚀 Vertex V2 - Status Atual do Projeto (Dezembro 2025)

Este documento define o **estado da arte** do projeto Vertex V2. Ele serve como a "Fonte da Verdade" para arquitetura, componentes e funcionalidades ativas, consolidando as mudanças recentes (V2 Components, Grid Layout e Compliance Médico).

---

## 1. Identidade e Stack Tecnológico

O **Vertex V2** é um sistema de laudos ultrassonográficos focado em alta fidelidade clínica e UX moderna ("Glassmorphism").

- **Core:** React 19 + TypeScript 5.9 + Vite 7
- **Estilização:** Tailwind CSS v4 + Tokens CSS Nativos (`modern-design.css`)
- **UI Lib:** Radix UI (Primitivos acessíveis) + Lucide React (Ícones)
- **AI Engine:** Dual-Provider (Gemini Pro + OpenAI GPT-4) com Streaming

---

## 2. Arquitetura "V2 Modern"

A arquitetura foi refatorada em Outubro/Novembro 2025 para resolver problemas de responsividade e layout.

### 2.1 Layout System (Grid + Portal)
Não usamos mais Flexbox para o layout macro. O sistema baseia-se em **CSS Grid**:

- **Layout Mestre:** `src/layouts/ModernExamLayout.tsx` (implementa `GridExamLayout`).
- **Comportamento Responsivo:**
  - **Desktop (≥1280px):** 3 colunas (Sidebar | Canvas A4 | Painéis).
  - **Tablet (768-1279px):** 2 colunas (Sidebar | Canvas A4 + Painéis empilhados).
  - **A4 Canvas:** Responsivo (210mm → 160mm) sem quebrar o layout.
- **Floating Panel:** Renderizado via **React Portal** (`document.body`), garantindo que fique sobreposto a tudo (z-index 50) e não seja afetado pelo overflow do grid.

### 2.2 Componentes Core
Apenas estes componentes devem ser usados para novas páginas:

1.  **`FloatingOrganPanelModern`:** O coração da interação. Painel flutuante que expande/minimiza.
2.  **`ReportCanvas` (V2):** Renderizador do laudo em Markdown, com suporte a streaming real-time.
3.  **`Sidebar` (V2):** Navegação lateral simplificada, controlada pelo Grid.
4.  **`TiradsCalculatorPanel`:** (Novo) Calculadora ACR TI-RADS 2017 integrada.

### 2.3 Gerenciamento de Estado
- **Estado Efêmero (UI):** `useState` local (ex: dropdowns abertos).
- **Estado do Exame:** "Lifted State" nas páginas (ex: `AbdomeTotalExamModern.tsx`) passando props para componentes filhos.
- **Persistência:** `useAutoSave` (Novo) salva rascunhos no `localStorage` a cada alteração (debounce 1s).

---

## 3. Funcionalidades Recentes (Destaques Dez 2025)

### ✅ Compliance Médico Rigoroso
- **Tireóide (ACR TI-RADS 2017):** Calculadora automática de pontuação e conduta (PAAF vs Seguimento).
- **Carótidas (ESVS 2023 / IAC 2021):** Critérios atualizados, cálculo automático de estenose NASCET, e novos campos para placa vulnerável (GSM, ulceração).
- **Abdome Total (CBR):** Alinhamento com códigos CBHPM e inclusão de classificações (Bosniak para cistos renais, Couinaud para fígado).

### ✅ Auto-Save (Crítico)
Implementado o hook `useAutoSave` em 100% dos exames modernos.
- **Funcionamento:** Salva `selectedFindings`, `normalOrgans` e `tempFindingDetails` automaticamente.
- **Recuperação:** Restaura o estado ao recarregar a página (validade de 1 hora).

### ✅ UX & Interação
- **Minimização Inteligente:** O painel flutuante detecta "cliques fora" mas respeita dropdowns do Radix UI e inputs focados.
- **Feedback Visual:** Indicadores de "Dados não salvos" e animações de progresso.

---

## 4. Guia para Desenvolvedores (Como criar hoje)

Para criar uma nova funcionalidade ou página de exame, siga estritamente o "Caminho Moderno":

1.  **Use o Layout Grid:**
    ```tsx
    <GridExamLayout
      sidebar={<Sidebar ... />}
      mainContent={<ReportCanvas ... />}
      panels={<><SelectedFindingsPanel ... /><TiradsCalculatorPanel ... /></>}
      floatingPanel={<FloatingOrganPanelModern ... />}
    />
    ```
2.  **Não Crie Estilos Globais:** Use os tokens de `src/styles/modern-design.css` (ex: `var(--glass-bg)`).
3.  **Validação Médica:** Defina as regras no arquivo de dados (`src/data/*.ts`) antes de codar a UI. Use `extraFields` para campos dinâmicos.
4.  **Integração IA:** Use `unifiedAIService` para garantir suporte a ambos os providers (Gemini/OpenAI).

---

## 5. Roadmap & Gaps Conhecidos

Apesar dos avanços, o relatório de arquitetura (10/Dez) aponta focos para o próximo ciclo:

1.  **Navegação por Teclado:** Ainda incipiente. Necessário suporte total (Tab, Enter, Atalhos como Ctrl+S).
2.  **Segurança de Lateralidade:** Implementar confirmação visual/auditiva para achados críticos (ex: Trombose no lado ERRADO).
3.  **Testes:** Aumentar cobertura de testes unitários para os calculadores médicos (TI-RADS, NASCET).

---

**Última Atualização:** 17 de Dezembro de 2025
**Baseado em:** Changelog Vertex, MedUX Architect Report.
