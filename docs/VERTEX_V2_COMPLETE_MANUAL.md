# 📘 Vertex V2 - Manual Completo de Desenvolvimento e Arquitetura

**Versão do Documento:** 1.0 (Janeiro 2026)
**Versão do Sistema:** 2.1.0
**Status:** Produção (Abdome, Carótidas, Tireoide migrados)

---

## 1. Visão Geral e Identidade

O **Vertex V2** é um sistema de laudos ultrassonográficos de alta fidelidade clínica e UX moderna ('Glassmorphism'), projetado para otimizar o fluxo de trabalho do médico ultrassonografista.

### Stack Tecnológico
- **Frontend:** React 19 + TypeScript 5.9 + Vite 7.2.0
- **Estilização:** Tailwind CSS v4 + Tokens CSS Nativos (modern-design.css)
- **UI Lib:** Radix UI (Primitivos acessíveis) + Lucide React (Ícones)
- **IA:** Dual-Provider (Gemini Pro + OpenAI GPT-4) com Streaming
- **Layout:** CSS Grid + React Portals

---

## 2. Arquitetura Técnica

### 2.1 Layout System (Grid + Portal)
Diferente da versão legado (Flexbox), a V2 utiliza **CSS Grid** para robustez responsiva.

- **Arquivo Mestre:** src/layouts/ModernExamLayout.tsx
- **Breakpoints:**
  - **Desktop (≥1280px):** 3 colunas (Sidebar 256px | Main Content 1fr | Panels 320px).
  - **Tablet (768-1279px):** 2 colunas (Sidebar 240px | Main Content). Os painéis movem-se para baixo do conteúdo principal.
- **A4 Canvas:** Responsivo. Em desktop é fixo em 210mm; em tablet colapsa para 160mm.
- **Z-Index:** Camadas controladas por tokens CSS (--z-base, --z-floating, --z-dropdown).

### 2.2 Componentes Core
Apenas estes componentes devem ser usados para novas páginas 'Modernas':

1. **FloatingOrganPanelModern**: Painel flutuante renderizado via **React Portal** (document.body). Garante sobreposição correta (Z-Index 50).
2. **ReportCanvas (V2)**: Renderizador do laudo em Markdown, com suporte a streaming real-time.
3. **Sidebar (V2)**: Navegação lateral controlada pelo Grid.
4. **Calculadoras**: TiradsCalculatorPanel, PlaqueRiskCalculatorPanel.

### 2.3 Gerenciamento de Estado
- **Estado Local:** useState para UI efêmera (dropdowns, toggles).
- **Estado do Exame:** 'Lifted State' nas páginas (ex: BaseExamPage), passado via props.
- **Auto-Save:** Hook useAutoSave persiste rascunhos no localStorage a cada alteração (debounce 1s). Validade de 1 hora.

---

## 3. Arquitetura Modular de Exames

O sistema utiliza um padrão de **Template Method** para eliminar duplicação de código.

### 3.1 O Conceito BaseExamPage
Ao invés de repetir 600 linhas de código por exame, usamos o componente src/pages/modern/BaseExamPage.tsx que aceita uma configuração (ExamConfig) e renderiza a interface completa.

### 3.2 Interface ExamConfig
Definida em src/types/exam.ts:
```typescript
interface ExamConfig {
  id: string;                      // ex: 'carotid-exam'
  title: string;                   // ex: 'Ecodoppler de Carótidas'
  subtitle: string;
  examType: string;                // Para prompts da IA
  organsCatalog: Organ[];          // A estrutura de dados do exame
  autoSaveKey: string;             // Chave localStorage para auto-save
  excludeFromNormalAll?: string[]; // Órgãos excluídos do "Marcar Todos Normal"
  FindingDetailsComponent?: ComponentType; // Componente específico (opcional)
}
```

**Exames Configurados (examConfigs.ts):**
| Config | FindingDetails | Uso |
|--------|----------------|-----|
| abdomeConfig | FindingDetailsGeneric | Exames abdominais gerais |
| carotidConfig | CarotidFindingDetails | Calculadoras NASCET + Placa |
| thyroidConfig | ThyroidFindingDetails | Calculadora TI-RADS |
| breastConfig | BreastUltrasoundFindingDetails | Calculadora BI-RADS |
| arterialConfig | FindingDetailsGeneric | Membros inferiores |
| venousConfig | FindingDetailsGeneric | Membros inferiores |
| abdominalVesselsConfig | FindingDetailsGeneric | Aorta, VCI, etc |
| abdominalWallConfig | FindingDetailsGeneric | Hérnias, diástases |

### 3.3 Como Criar um Novo Exame
1. **Defina os Dados:** Crie src/data/novoExameOrgans.ts.
2. **Crie a Configuração:** Crie src/pages/modern/exams/NovoExam.tsx.
   ```typescript
   export default function NovoExam() {
     return <BaseExamPage config={novoConfig} />;
   }
   ```
3. **Registre a Rota:** Adicione em src/App.tsx.

---

## 4. Estrutura de Dados e Regras Médicas

O sistema cobre diversas modalidades com estruturas de dados específicas.

### 4.1 Tireoide (ACR TI-RADS 2017)
- **Classificador:** Automático. Calcula pontos baseados em Composição, Ecogenicidade, Forma, Margens e Focos Ecogênicos.
- **Conduta:** Sugere PAAF ou Seguimento baseado no tamanho e pontuação.

### 4.2 Carótidas (NASCET/ESVS 2023)
- **Estenose:** Cálculo automático baseado em VPS, VDF e Ratio (IAC 2021).
- **Placa:** Classificação de risco (Gray-Weale, GSM, Ulceração).
- **Múltiplas Lesões:** Suporte nativo para múltiplas placas/estenoses no mesmo vaso.

### 4.3 Mama (BI-RADS 5ª Ed)
- **Léxico:** Descritores padronizados.
- **Cálculo:** Sugestão de categoria BI-RADS baseada nos descritores.

### 4.4 Abdome Total
- **Abrangência:** Fígado, Vesícula, Pâncreas, Baço, Rins, Aorta, Bexiga.
- **Classificações:** Bosniak (Rins), Esteatose (Fígado).

---

## 5. Estrutura de Pastas e Convenções

```
src/
├── components/
│   ├── original/              # Componentes legados ou específicos (FindingDetails)
│   └── shared/                # Componentes reutilizáveis (Calculadoras, Painéis)
├── data/
│   ├── examConfigs.ts         # Configurações centralizadas dos 8 exames
│   └── shared/
│       ├── commonFields.ts    # Constantes reutilizáveis (LATERALITY, STENOSIS_GRADE, etc)
│       └── commonOrgans.ts    # Factory functions (createObservacoesOrgan)
├── hooks/                     # Hooks customizados (useAutoSave, useBreakpoint)
├── layouts/                   # ModernExamLayout
├── pages/
│   └── modern/                # Páginas V2
│       ├── BaseExamPage.tsx   # O Template Mestre
│       └── exams/             # Implementações específicas
└── styles/                    # CSS Modules e Tokens
```

### Boas Práticas
- **Nunca use z-index arbitrário.** Use as variáveis CSS (--z-dropdown, etc.).
- **Prefira editar examConfigs** a criar novas páginas do zero.
- **Componentes de Detalhes:** Se o exame precisa de campos muito específicos (ex: calculadora complexa), crie um FindingDetails customizado e passe na config.
- **Use shared/commonFields.ts:** Importe constantes como `LATERALITY`, `STENOSIS_GRADE`, `WAVEFORM_PATTERNS` ao invés de duplicar arrays.
- **Use shared/commonOrgans.ts:** Use `createObservacoesOrgan('sufixo')` para criar órgãos de Observações padronizados com `hideNormalOption: true`.

---

## 6. Infraestrutura e Troubleshooting

### Comandos
- **Dev:** npm run dev (Porta 8200)
- **Build:** npm run build
- **Lint:** npm run lint

### Systemd (Servidor Linux)
Existe uma pendência na configuração do serviço systemd (vertex-v2.service). O serviço falha por não encontrar o node no PATH.
**Solução recomendada:** Usar caminho absoluto no arquivo de serviço ou um script wrapper.

### Troubleshooting Comum
- **Dropdown atrás do painel:** Verifique se o painel está usando a classe organ-section-panel.
- **Scrollbar sumida:** Adicione modern-scrollbar ao elemento com overflow-y-auto.
- **Erro de Import:** 'Identifier X has already been declared' -> Remova imports duplicados.

---

## 7. Roadmap e Status (Jan 2026)

### Concluído ✅
- [x] Migração para React 19 / Vite 7.
- [x] Arquitetura Modular (BaseExamPage).
- [x] Calculadoras TI-RADS, NASCET, BI-RADS.
- [x] Auto-Save robusto.
- [x] Layout Grid Responsivo.

### Pendente 🚧
- [ ] Calculadoras CEAP/VCSS (Venoso).
- [ ] Calculadoras WIfI (Arterial).
- [ ] Navegação completa por teclado.
- [ ] Confirmação de segurança para lateralidade.

---

---

## 8. Autenticação

- **Usuário:** anders
- **Senha:** vertex2025

---

*Documento consolidado em 08/01/2026.*
