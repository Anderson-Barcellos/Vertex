# Vertex V2 🏥

**Sistema de Geração de Laudos Ultrassonográficos com IA**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/Anderson-Barcellos/Vertex)
[![React](https://img.shields.io/badge/React-19.0.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.5-646CFF.svg)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/status-Em%20Produ%C3%A7%C3%A3o-success.svg)]()

> Sistema moderno e inteligente para geração automatizada de laudos ultrassonográficos, utilizando IA generativa (Gemini e OpenAI) e seguindo diretrizes médicas brasileiras (CBR, SBACV, BI-RADS).

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Exames Disponíveis](#-exames-disponíveis)
- [Stack Tecnológica](#-stack-tecnológica)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Arquitetura](#-arquitetura)
- [Desenvolvimento](#-desenvolvimento)
- [Integração com IA](#-integração-com-ia)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Documentação Adicional](#-documentação-adicional)
- [Troubleshooting](#-troubleshooting)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O **Vertex V2** é uma aplicação web moderna desenvolvida para médicos ultrassonografistas gerarem laudos padronizados e de alta qualidade com auxílio de inteligência artificial. O sistema oferece:

- **Interface Intuitiva**: Design moderno com glassmorphism e gradientes suaves
- **IA Integrada**: Geração automática de impressões diagnósticas usando Gemini e OpenAI
- **Padrões Médicos**: Seguimento rigoroso de diretrizes CBR, SBACV, SBACV e BI-RADS
- **Streaming em Tempo Real**: Visualização progressiva da geração de laudos
- **Múltiplos Exames**: Suporte a abdome, carótidas, tireóide, mama, doppler venoso e mais
- **Responsivo**: Interface adaptável para desktop, tablet e dispositivos móveis

### Principais Diferenciais

✅ **Geração Inteligente de Laudos**: IA analisa achados e gera impressões diagnósticas contextualizadas
✅ **Sistema de Achados Estruturado**: Múltiplas instâncias, medidas e localizações anatômicas
✅ **Léxicos Padronizados**: BI-RADS 5ª edição completo para mama
✅ **Métricas de IA**: Rastreamento de tokens, custos e performance
✅ **Arquitetura Modular**: Fácil adição de novos exames e funcionalidades

---

## ✨ Funcionalidades

### Geração de Laudos

- 📝 **Geração Básica**: Criação automática de laudos baseada em achados selecionados
- 🤖 **Geração com IA**: Impressões diagnósticas contextualizadas via Gemini/OpenAI
- 🔄 **Streaming Progressivo**: Visualização em tempo real da geração
- 📋 **Copy/Paste**: Botões sempre visíveis para copiar laudos
- 🎨 **Renderização Markdown**: Suporte a formatação rica de texto

### Sistema de Achados

- 🏥 **Achados Estruturados**: Categorização por órgão e sistema
- 📏 **Medidas Precisas**: Campos específicos para dimensões, velocimetria, etc.
- 📍 **Localização Anatômica**: Segmentos hepáticos, quadrantes mamários, etc.
- 🔢 **Múltiplas Instâncias**: Registro de múltiplos achados do mesmo tipo
- ⚠️ **Níveis de Severidade**: Classificação leve/moderado/acentuado
- 🎯 **Campos Customizados**: Parâmetros específicos por tipo de achado

### Exames Especializados

- 🫀 **Doppler Vascular**: Velocimetria completa com cálculo de estenose (NASCET)
- 🩺 **BI-RADS Mama**: Léxicos padronizados e cálculo automático de categoria
- 🦴 **TI-RADS Tireóide**: Classificação de nódulos tireoidianos
- 🧬 **Abdome Completo**: Fígado, baço, rins, pâncreas, vesícula
- 🩸 **Doppler Venoso**: TVP, insuficiência venosa, classificação CEAP

### IA e Automação

- 🧠 **Dois Provedores**: Gemini 2.5 Pro e OpenAI GPT-4
- 📊 **Métricas Detalhadas**: Tokens, custo estimado, tempo de execução
- 🎛️ **Auto-geração**: Modo automático com debounce inteligente
- 🚫 **Cancelamento**: Possibilidade de cancelar operações em andamento
- 💾 **Persistência**: Seleção de modelo salva na sessão

---

## 🏥 Exames Disponíveis

| Exame | Rota | Status | Características |
|-------|------|--------|-----------------|
| **Abdome Total** | `/abdome-modern` | ✅ Ativo | Fígado, baço, rins, pâncreas, vesícula, vias biliares |
| **Doppler de Carótidas** | `/carotid-modern` | ✅ Ativo | Velocimetria, placas, classificação NASCET, EMI |
| **Ecodoppler de Tireóide** | `/thyroid-modern` | ✅ Ativo | Nódulos, TI-RADS, vascularização |
| **Ultrassom de Mama** | `/breast-exam` | ✅ Ativo | BI-RADS 5ª ed., léxicos completos, linfonodos |
| **Mama Completo** | `/mammography-modern` | ✅ Ativo | Sistema completo com múltiplas lesões |
| **Doppler Venoso MMII** | `/venous-modern` | ✅ Ativo | TVP, insuficiência venosa, CEAP, refluxo |

### Planejamento Futuro

- [ ] Artérias Renais
- [ ] Obstétrico 1º Trimestre
- [ ] Obstétrico Morfológico
- [ ] Transvaginal
- [ ] Próstata via Transretal
- [ ] Musculoesquelético

---

## 🛠️ Stack Tecnológica

### Frontend Core

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 19.0.0 | Framework UI |
| **TypeScript** | 5.9.2 | Type Safety |
| **Vite** | 7.1.5 | Build Tool & Dev Server |
| **React Router** | 7.9.1 | Roteamento SPA |

### UI & Estilização

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Tailwind CSS** | 4.1.11 | Estilização utilitária |
| **Radix UI** | Latest | Componentes primitivos acessíveis |
| **Lucide React** | 0.544.0 | Ícones modernos |
| **Phosphor Icons** | 2.1.7 | Ícones alternativos |
| **Sonner** | 2.0.1 | Toast notifications |
| **CVA** | 0.7.1 | Class Variance Authority |

### IA & API

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **@google/generative-ai** | 0.24.1 | Google Gemini SDK |
| **OpenAI API** | - | Via proxy backend |

### Markdown & Renderização

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React Markdown** | 10.1.0 | Renderização de markdown |
| **Remark GFM** | 4.0.1 | GitHub Flavored Markdown |

### Dev Tools

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Vitest** | 2.1.8 | Testing framework |
| **ESLint** | 9.36.0 | Linting |
| **TypeScript ESLint** | 8.44.0 | TS Linting |

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/Anderson-Barcellos/Vertex.git
cd Vertex
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Acesse a aplicação**

```
http://localhost:8200
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# ==============================================================================
# VERTEX V2 - CONFIGURAÇÃO DE AMBIENTE
# ==============================================================================

# -----------------------------------------------------------------------------
# APIs de IA
# -----------------------------------------------------------------------------

# Google Gemini
VITE_GEMINI_API_URL=https://ultrassom.ai:8177/geminiCall
VITE_GEMINI_MODEL=gemini-2.5-pro
VITE_GEMINI_API_KEY=your_gemini_key_here

# OpenAI
VITE_OPENAI_API_URL=https://ultrassom.ai:8177/openaiCall
VITE_OPENAI_MODEL=gpt-4o
VITE_OPENAI_API_KEY=your_openai_key_here

# -----------------------------------------------------------------------------
# Custos de IA (USD por 1k tokens) - Opcional
# -----------------------------------------------------------------------------

# OpenAI
VITE_OPENAI_INPUT_COST_PER_1K=0.005
VITE_OPENAI_OUTPUT_COST_PER_1K=0.015

# Gemini
VITE_GEMINI_INPUT_COST_PER_1K=0.007
VITE_GEMINI_OUTPUT_COST_PER_1K=0.021

# -----------------------------------------------------------------------------
# Aplicação
# -----------------------------------------------------------------------------

VITE_APP_NAME=Vertex V2
NODE_ENV=development
```

### Configuração do Vite

O arquivo `vite.config.ts` já está configurado com:

- **Proxy de API**: Redirecionamento de `/api/gemini` e `/api/openai` para o backend
- **Host**: `0.0.0.0` (todas as interfaces)
- **Porta**: `8200`
- **Aliases**: `@` → `./src`

### Configuração do Tailwind

Tailwind CSS v4 está integrado via `@tailwindcss/vite`. Personalizações no `tailwind.config.js`.

---

## 🚀 Uso

### Fluxo Básico de Uso

1. **Acesse a Landing Page**: Navegue para `http://localhost:8200`
2. **Selecione o Exame**: Clique no exame desejado
3. **Escolha o Órgão**: Na sidebar, clique no órgão/sistema a avaliar
4. **Selecione Achados**: No painel flutuante, marque os achados encontrados
5. **Adicione Detalhes**: Preencha medidas, localizações e características
6. **Marque Normais**: Órgãos sem alterações podem ser marcados como normais
7. **Gere o Laudo**: Clique em "Gerar Laudo" no painel direito
8. **Use a IA**: Opcionalmente, gere impressão diagnóstica com IA
9. **Copie o Resultado**: Use os botões verdes para copiar o laudo

### Exemplo: Exame de Abdome

```
1. Acesse /abdome-modern
2. Clique em "Fígado" na sidebar
3. Selecione "Hepatomegalia" no painel flutuante
4. Escolha severidade: "Leve"
5. Adicione medida do lobo direito: 16 cm
6. Marque "Baço", "Rins", "Pâncreas" como normais
7. Clique "Gerar Laudo com IA" (Gemini)
8. Aguarde a geração progressiva
9. Copie o laudo completo
```

### Exemplo: Doppler de Carótidas

```
1. Acesse /carotid-modern
2. Selecione "Carótida Interna Direita"
3. Adicione velocimetria:
   - VPS: 180 cm/s
   - VDF: 90 cm/s
4. Selecione "Placa Aterosclerótica"
5. Defina características:
   - Ecogenicidade: Heterogênea
   - Composição: Mista
   - Superfície: Irregular
6. Sistema calcula estenose NASCET automaticamente
7. Gere impressão diagnóstica com IA
```

### Exemplo: BI-RADS Mama

```
1. Acesse /breast-exam
2. Preencha dados da mama direita:
   - Tipo: Nódulo sólido
   - Forma: Irregular
   - Margens: Espiculadas
   - Orientação: Não-paralela
   - Tamanho: 1.8 cm
3. Sistema calcula categoria BI-RADS: 4C
4. Adicione linfonodos se presentes
5. Gere laudo completo com léxicos padronizados
```

---

## 🏗️ Arquitetura

### Visão Geral

O Vertex V2 segue uma arquitetura modular baseada em componentes React, com separação clara entre:

- **Páginas de Exame**: Lógica específica de cada modalidade
- **Layout Compartilhado**: Grid responsivo e estrutura comum
- **Componentes Reutilizáveis**: UI primitivos e compostos
- **Serviços**: Lógica de negócio e integrações externas
- **Dados**: Catálogos de órgãos e achados médicos

### Layout Moderno (`ModernExamLayout`)

Todas as páginas de exame usam o layout compartilhado:

```tsx
<ModernExamLayout
  header={<HeaderContent />}           // Navegação e título
  sidebar={<Sidebar />}                // Lista de órgãos
  main={<ReportCanvas />}              // Laudo A4 centralizado
  panels={<>                           // Painéis auxiliares
    <SelectedFindingsPanel />
    <ExamStatisticsPanel />
  </>}
  floatingPanel={<FloatingOrganPanel />} // Painel de achados
/>
```

**Estrutura do Grid:**

```
┌─────────────────────────────────────────────────────┐
│                    HEADER (12 cols)                  │
├──────────┬──────────────────────────┬───────────────┤
│          │                          │               │
│ SIDEBAR  │         MAIN             │    PANELS     │
│ (3 cols) │        (6 cols)          │    (3 cols)   │
│          │                          │               │
│ Sticky   │   ReportCanvas A4        │   Sticky      │
│          │   (Scroll)               │               │
│          │                          │               │
└──────────┴──────────────────────────┴───────────────┘

         ┌────────────────┐
         │ FLOATING PANEL │ (Portal, position: fixed)
         │ (OrganSection) │
         └────────────────┘
```

### Painel Flutuante (`FloatingOrganPanelModern`)

Componente inteligente que renderiza achados de órgãos:

**Características:**
- Renderizado via React Portal
- Posicionamento `fixed` relativo à viewport
- Estados minimizado/expandido
- Proteção contra clique-fora (ignora dropdowns)
- Scrollbar customizada (roxa)
- Ancoragem dinâmica na sidebar

**API:**

```typescript
<FloatingOrganPanelModern
  organ={currentOrgan}                    // Órgão atual
  selectedFindings={findings}             // Achados selecionados
  isNormal={isNormal}                     // Estado normal
  isMinimized={minimized}                 // Estado minimizado
  onToggleMinimized={setMinimized}        // Callback toggle
  onFindingChange={handleChange}          // Callback mudança
  onNormalChange={handleNormal}           // Callback normal
  FindingDetailsComponent={CustomDetails} // Componente custom
  leftCss="calc(25% + 1.5rem)"           // Posição left
  widthExpanded="24rem"                   // Largura expandido
  maxHeight="80vh"                        // Altura máxima
/>
```

### Hooks Customizados

#### `useDropdownGuard`

Detecta dropdowns abertos no DOM:

```typescript
const { isAnyDropdownOpen, isDropdownRelated } = useDropdownGuard([ref]);
```

- Usa `MutationObserver` para performance
- Detecta portais Radix UI
- Identifica estados `[data-state="open"]`
- Verifica `[aria-expanded="true"]`

#### `useOutsidePointerDismiss`

Fecha componente ao clicar fora:

```typescript
useOutsidePointerDismiss({
  containerRef: ref,
  isDisabled: isMinimized,
  isDropdownOpen: isAnyDropdownOpen,
  onDismiss: () => onToggleMinimized(true)
});
```

- Usa `pointerdown` com `capture: true`
- Ignora cliques em dropdowns/portais
- Verifica `composedPath()` completo
- Desabilitável condicionalmente

### Camadas Z-Index

Tokens CSS para controle de empilhamento:

```css
--z-base: 1;        /* Elementos base */
--z-content: 10;    /* Conteúdo principal */
--z-floating: 100;  /* Painéis flutuantes */
--z-dropdown: 200;  /* Dropdowns e selects */
--z-modal: 300;     /* Modais e dialogs */
```

### Fluxo de Integração com IA

```
┌─────────────────────────────────────────────┐
│ Frontend: ReportCanvas.tsx                  │
│ ↓ onClick "Gerar Impressão com IA"         │
├─────────────────────────────────────────────┤
│ unifiedAIService.generateClinicalImpression │
│ ↓ Escolhe provider (Gemini/OpenAI)         │
├─────────────────────────────────────────────┤
│ geminiStreamService ou openaiStreamService  │
│ ↓ buildSpecializedPrompt()                 │
├─────────────────────────────────────────────┤
│ POST /api/gemini (ou /api/openai)          │
│ ↓ Vite Proxy                               │
├─────────────────────────────────────────────┤
│ Backend: ultrassom.ai:8177/geminiCall      │
│ ↓ Streaming Response (SSE/NDJSON)         │
├─────────────────────────────────────────────┤
│ Frontend: onChunk(accumulated)              │
│ ↓ setAiImpression(accumulated)             │
├─────────────────────────────────────────────┤
│ ReportCanvas: Renderização progressiva      │
│ ↓ Markdown + Estatísticas                  │
└─────────────────────────────────────────────┘
```

---

## 💻 Desenvolvimento

### Como Criar um Novo Exame

#### 1. Criar Dados do Exame

Crie um arquivo em `src/data/` seguindo o padrão:

```typescript
// src/data/meuExameOrgans.ts
import { Organ } from './organs';

export const meuExameOrgans: Organ[] = [
  {
    id: 'orgao-1',
    name: 'Nome do Órgão',
    categories: [
      {
        id: 'categoria-1',
        name: 'Categoria de Achados',
        findings: [
          {
            id: 'achado-1',
            name: 'Nome do Achado',
            description: 'Descrição técnica',
            requiresMeasurement: true,
            measurements: [
              { id: 'tamanho', label: 'Tamanho', unit: 'cm' }
            ],
            requiresLocation: true,
            locations: ['Localização 1', 'Localização 2']
          }
        ]
      }
    ]
  }
];
```

#### 2. Criar Componente de Detalhes (Opcional)

Se o exame requer campos específicos:

```typescript
// src/components/original/MeuExameFindingDetails.tsx
import React from 'react';
import { FindingDetailsComponentProps } from '@/types/report';

export default function MeuExameFindingDetails({
  finding,
  organId,
  severity,
  instances,
  onSeverityChange,
  onInstancesChange
}: FindingDetailsComponentProps) {
  // Implementação específica
  return (
    <div>
      {/* Campos customizados */}
    </div>
  );
}
```

#### 3. Criar Página do Exame

Use o template como base:

```typescript
// src/pages/modern/MeuExameModern.tsx
import React, { useState } from 'react';
import ModernExamLayout from '@/layouts/ModernExamLayout';
import FloatingOrganPanelModern from '@/components/shared/FloatingOrganPanelModern';
import { meuExameOrgans } from '@/data/meuExameOrgans';
import MeuExameFindingDetails from '@/components/original/MeuExameFindingDetails';

export default function MeuExameModern() {
  // Estados
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState([]);
  const [normalOrgans, setNormalOrgans] = useState([]);
  // ... outros estados

  // Handlers
  const handleOrganSelect = (organId: string) => {
    setSelectedOrgan(organId);
  };

  // Render
  return (
    <ModernExamLayout
      header={/* ... */}
      sidebar={/* ... */}
      main={/* ... */}
      panels={/* ... */}
      floatingPanel={
        currentOrgan ? (
          <FloatingOrganPanelModern
            organ={currentOrgan}
            selectedFindings={currentOrganFindings}
            isNormal={isCurrentOrganNormal}
            isMinimized={isPanelMinimized}
            onToggleMinimized={setIsPanelMinimized}
            onFindingChange={handleFindingChange}
            onNormalChange={handleNormalChange}
            FindingDetailsComponent={MeuExameFindingDetails}
          />
        ) : null
      }
    />
  );
}
```

#### 4. Adicionar Rota

Registre a rota em `src/App.tsx`:

```typescript
import MeuExameModern from './pages/modern/MeuExameModern';

// ...

<Route path="/meu-exame-modern" element={<MeuExameModern />} />
```

#### 5. Checklist de Criação

- [ ] Criar arquivo de dados (`src/data/`)
- [ ] Criar componente de detalhes se necessário
- [ ] Criar página do exame
- [ ] Adicionar rota no `App.tsx`
- [ ] Testar fluxo completo
- [ ] Verificar responsividade
- [ ] Testar geração com IA
- [ ] Validar cálculos automáticos

### Estrutura de Desenvolvimento

```bash
# Desenvolvimento
npm run dev              # Inicia dev server na porta 8200

# Build
npm run build            # Compila para produção (/dist)
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # ESLint
npm run test             # Vitest

# Verificação
npm run type-check       # TypeScript type checking
```

### Convenções de Código

#### Nomenclatura

- **Componentes**: PascalCase (`ReportCanvas.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useDropdownGuard.ts`)
- **Utilitários**: camelCase (`aiMetrics.ts`)
- **Tipos**: PascalCase (`Report`, `Finding`)
- **Constantes**: UPPER_SNAKE_CASE (`NORMAL_DIAMETERS`)

#### Organização de Imports

```typescript
// 1. React e bibliotecas externas
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Componentes
import Sidebar from '@/components/original/Sidebar';
import FloatingPanel from '@/components/shared/FloatingPanel';

// 3. Dados e tipos
import { organs } from '@/data/organs';
import type { Finding } from '@/types/report';

// 4. Serviços e utilitários
import { generateReport } from '@/services/reportGenerator';
import { estimateCost } from '@/utils/aiMetrics';

// 5. Estilos
import '@/styles/modern-design.css';
```

#### Boas Práticas

- **Componentes Funcionais**: Sempre usar function components
- **TypeScript Strict**: Sempre tipar props e estados
- **Hooks Customizados**: Extrair lógica reutilizável
- **Comentários**: Documentar lógica complexa
- **Acessibilidade**: ARIA labels e roles
- **Performance**: Memo, useCallback, useMemo quando apropriado

---

## 🤖 Integração com IA

### Provedores Disponíveis

#### Google Gemini

- **Modelo Padrão**: `gemini-2.5-pro`
- **Configurado**: Sim, via proxy backend
- **Custo Estimado**: ~$0.007 input / $0.021 output (por 1k tokens)
- **Características**: Streaming, timeout 60s, fallback local

#### OpenAI

- **Modelo Padrão**: `gpt-4o`
- **Configurado**: Sim, via proxy backend
- **Custo Estimado**: ~$0.005 input / $0.015 output (por 1k tokens)
- **Características**: Streaming, `max_completion_tokens`, múltiplos modelos

### Serviço Unificado

O `unifiedAIService` abstrai os provedores:

```typescript
// Configurar provider
unifiedAIService.setProvider('gemini'); // ou 'openai'

// Gerar impressão clínica
await unifiedAIService.generateClinicalImpression(
  {
    examType: 'Ultrassonografia de Abdome Total',
    selectedFindings: findings,
    normalOrgans: normalOrgans,
    organsCatalog: organs
  },
  {
    onChunk: (accumulated) => {
      console.log('Chunk recebido:', accumulated);
      setImpression(accumulated);
    },
    onComplete: (finalText) => {
      console.log('Completo:', finalText);
      setStatus('completed');
    },
    onError: (error) => {
      console.error('Erro:', error);
      showToast('Erro ao gerar impressão');
    }
  }
);

// Cancelar operação
unifiedAIService.cancelClinicalImpression();
```

### Construção de Prompts

O `promptBuilder` gera prompts especializados:

```typescript
const prompt = buildSpecializedPrompt({
  examType: 'Ecodoppler de Carótidas e Vertebrais',
  selectedFindings: selectedFindings,
  normalOrgans: normalOrgans,
  organsCatalog: carotidOrgans
});
```

**Estrutura do Prompt:**

```
Você é um radiologista experiente especializado em
ultrassonografia no Brasil.

Gere uma IMPRESSÃO DIAGNÓSTICA profissional e concisa
para o seguinte exame de [TIPO DE EXAME]:

ACHADOS PATOLÓGICOS:
- [Achado 1]
  [Detalhes, medidas, localizações]
- [Achado 2]
  ...

ÓRGÃOS NORMAIS (sem alterações):
- [Órgão 1]
- [Órgão 2]

INSTRUÇÕES:
1. Gere APENAS a impressão diagnóstica
2. Use terminologia médica apropriada em português brasileiro
3. Seja conciso mas completo
4. Priorize achados clinicamente relevantes
5. Siga diretrizes médicas brasileiras (CBR, SBACV, etc.)
```

### Métricas e Custos

Rastreamento automático de:

- **Tokens**: Entrada e saída (estimados)
- **Custo**: USD estimado por operação
- **Tempo**: Duração em ms
- **Chunks**: Número de fragmentos recebidos
- **Taxa**: Caracteres/segundo

**Interface de Estatísticas:**

```typescript
interface AIGenerationStats {
  provider: 'gemini' | 'openai';
  model: string;
  status: 'idle' | 'loading' | 'streaming' | 'completed' | 'error';
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  startedAt?: number;
  finishedAt?: number;
  durationMs?: number;
  chunkCount?: number;
  inputChars?: number;
  outputChars?: number;
  errorMessage?: string;
}
```

### Persistência de Seleção

O modelo selecionado é salvo em `sessionStorage`:

```typescript
// Salvar
sessionStorage.setItem('selectedAIModel', 'gemini-2.5-pro');

// Recuperar
const model = sessionStorage.getItem('selectedAIModel');
```

---

## 📁 Estrutura de Arquivos

```
vertex-v2/
├── src/
│   ├── components/          # Componentes React
│   │   ├── breast/          # Específicos de mama (BI-RADS)
│   │   │   ├── MamaPanel.tsx
│   │   │   ├── BiRadsDisplay.tsx
│   │   │   ├── LexicoDropdown.tsx
│   │   │   └── LinfonodosSection.tsx
│   │   ├── original/        # Componentes originais/legados
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ReportCanvas.tsx
│   │   │   ├── OrganSection.tsx
│   │   │   ├── SelectedFindingsPanel.tsx
│   │   │   ├── ExamStatisticsPanel.tsx
│   │   │   ├── FindingDetailsEnhanced.tsx
│   │   │   ├── CarotidFindingDetails.tsx
│   │   │   ├── ThyroidFindingDetails.tsx
│   │   │   ├── BreastUltrasoundFindingDetails.tsx
│   │   │   └── VenousFindingDetails.tsx
│   │   ├── shared/          # Componentes compartilhados
│   │   │   ├── FloatingOrganPanelModern.tsx
│   │   │   └── QuickTemplatesPanel.tsx
│   │   ├── ui/              # Componentes Radix UI + Tailwind
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (61 componentes)
│   │   ├── MarkdownRenderer.tsx
│   │   └── ResolutionGuard.tsx
│   ├── pages/               # Páginas da aplicação
│   │   ├── modern/          # Páginas modernas
│   │   │   ├── AbdomeTotalExamModern.tsx
│   │   │   ├── CarotidExamModern.tsx
│   │   │   ├── ThyroidEchodopplerModern.tsx
│   │   │   ├── BreastExamSimplified.tsx
│   │   │   ├── BreastUltrasoundExamModern.tsx
│   │   │   ├── VenousExamModern.tsx
│   │   │   └── ExamTemplateModern.example.tsx
│   │   ├── v2/
│   │   │   └── LandingPageModern.tsx
│   │   └── Home.tsx          # Legado
│   ├── layouts/             # Layouts compartilhados
│   │   └── ModernExamLayout.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useMamaState.ts
│   │   ├── useDropdownGuard.ts
│   │   └── useOutsidePointerDismiss.ts
│   ├── services/            # Lógica de negócio
│   │   ├── geminiClient.ts
│   │   ├── geminiStreamService.ts
│   │   ├── openaiStreamService.ts
│   │   ├── unifiedAIService.ts
│   │   ├── reportGenerator.ts
│   │   ├── biradsReportGenerator.ts
│   │   ├── breastReportBuilder.ts
│   │   ├── promptBuilder.ts
│   │   └── biradsCalculator.ts
│   ├── data/                # Dados médicos estruturados
│   │   ├── organs.ts        # Estrutura base
│   │   ├── carotidOrgans.ts # Doppler carótidas
│   │   ├── thyroidOrgans.ts # Tireóide
│   │   ├── breastUltrasoundOrgans.ts # Mama
│   │   ├── venousOrgans.ts  # Doppler venoso
│   │   ├── biradsLexicons.ts # Léxicos BI-RADS
│   │   └── reportTemplates.ts # Templates
│   ├── types/               # TypeScript types
│   │   ├── report.ts
│   │   └── birads.ts
│   ├── utils/               # Utilitários
│   │   └── aiMetrics.ts     # Métricas de IA
│   ├── styles/              # Estilos globais
│   │   ├── index.css
│   │   ├── theme.css
│   │   ├── layout.css
│   │   ├── modern-design.css
│   │   └── grid-layout.css
│   ├── App.tsx              # Rotas principais
│   └── main.tsx             # Entry point
├── public/                  # Assets estáticos
│   ├── logo-vertex.svg
│   └── favicon.svg
├── docs/                    # Documentação adicional
│   ├── ARCHITECTURE.md
│   ├── EXAM_MODERN_GUIDE.md
│   ├── TROUBLESHOOTING.md
│   └── ...
├── backups/                 # Backups automáticos
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .env.example
├── .gitignore
└── README.md
```

**Estatísticas:**

- **Total de Arquivos**: ~250
- **Linhas de Código**: ~8.600 (src/)
- **Componentes React**: ~80
- **Páginas**: 7 modernas + 1 legada
- **Hooks Customizados**: 3
- **Serviços**: 9
- **Tipos TypeScript**: 15+

---

## 📚 Documentação Adicional

### Guias Específicos

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Arquitetura detalhada do sistema
- **[EXAM_MODERN_GUIDE.md](docs/EXAM_MODERN_GUIDE.md)**: Guia de criação de exames modernos
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)**: Resolução de problemas comuns
- **[CLAUDE.md](CLAUDE.md)**: Instruções para Claude Code
- **[GRID_ARCHITECTURE.md](docs/GRID_ARCHITECTURE.md)**: Arquitetura do grid layout

### Componentes Específicos

- **[FloatingOrganPanel-Technical.md](docs/FloatingOrganPanel-Technical.md)**: Documentação técnica
- **[FloatingOrganPanel-Usage.md](docs/FloatingOrganPanel-Usage.md)**: Guia de uso
- **[FloatingOrganPanel-Visual-Guide.md](docs/FloatingOrganPanel-Visual-Guide.md)**: Guia visual

### BI-RADS e Léxicos

- **[PLANEJAMENTO_MAMA_LEXICO.md](PLANEJAMENTO_MAMA_LEXICO.md)**: Planejamento BI-RADS
- **[LEXICO_DROPDOWN_GUIDE.md](LEXICO_DROPDOWN_GUIDE.md)**: Guia de dropdowns de léxicos

### Templates

- **[ExamTemplateModern.example.tsx](src/pages/modern/ExamTemplateModern.example.tsx)**: Template base para novos exames

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro: "Identifier 'X' has already been declared"

**Causa**: Import duplicado do mesmo símbolo.

**Solução**:
```typescript
// ❌ Errado
import { Finding } from '@/data/organs';
import { Finding } from '@/types/report'; // Duplicado

// ✅ Correto
import { Finding } from '@/data/organs';
import type { Finding as FindingType } from '@/types/report';
```

Depois, fazer hard refresh (Ctrl/Cmd + Shift + R).

#### 2. Dropdown/Select Atrás do Painel Flutuante

**Causa**: Z-index incorreto ou falta de classe `organ-section-panel`.

**Solução**:
- Adicionar `organ-section-panel` no painel flutuante
- Verificar que portais Radix usam `--z-dropdown`
- Não usar `z-50` inline

#### 3. Scrollbar Não Aparece

**Causa**: `overflow` no elemento errado.

**Solução**:
```tsx
// ✅ Correto: overflow no mesmo elemento com max-height
<div className="max-h-[80vh] overflow-y-auto modern-scrollbar">
  {content}
</div>

// ❌ Errado: overflow no pai
<div className="overflow-y-auto modern-scrollbar">
  <div className="max-h-[80vh]">
    {content}
  </div>
</div>
```

#### 4. Vite Dev Server Não Inicia

**Causa**: Porta 8200 em uso.

**Solução**:
```bash
# Verificar processo
ss -ltnp | grep :8200

# Matar processo se necessário
kill -9 <PID>

# Reiniciar
npm run dev
```

#### 5. IA Não Responde / Timeout

**Causa**: Problemas de rede, API key inválida ou backend offline.

**Solução**:
1. Verificar `.env` com API keys corretas
2. Testar endpoint: `curl https://ultrassom.ai:8177/geminiCall`
3. Verificar logs do browser (Console)
4. Tentar provider alternativo (Gemini ↔ OpenAI)

#### 6. Build Falha com Erro de TypeScript

**Causa**: Tipos incompatíveis ou propriedades faltando.

**Solução**:
```bash
# Verificar erros
npm run type-check

# Limpar cache e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

#### 7. HMR (Hot Module Replacement) Não Funciona

**Causa**: Grafo do Vite com estado sujo.

**Solução**:
```bash
# Hard refresh no browser
Ctrl/Cmd + Shift + R

# Se persistir, reiniciar Vite
Ctrl + C
npm run dev
```

#### 8. Painel Flutuante Fecha ao Clicar em Dropdown

**Causa**: Dropdown não detectado como portal Radix.

**Solução**:
- Verificar que `useDropdownGuard` está sendo usado
- Passar `isAnyDropdownOpen` para `useOutsidePointerDismiss`
- Não desabilitar portais Radix

### Logs e Debug

#### Logs do Vite

```bash
# Dev server logs
tail -f /tmp/vertex-v2.dev.log

# Se rodando com systemd
journalctl -u vertex-v2.service -n 50 -f
```

#### Debug da IA

Habilitar logs detalhados:

```typescript
// Em geminiStreamService.ts ou openaiStreamService.ts
const DEBUG = true; // Ativar logs
```

Console mostrará:
- Requisição enviada
- Chunks recebidos
- Erros de parsing
- Tempo de resposta

#### React DevTools

Instale a extensão React DevTools:
- Chrome: [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React DevTools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Performance

#### Build Lento

```bash
# Usar cache do Vite
npm run build -- --cache

# Aumentar memória do Node
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Bundle Grande

```bash
# Analisar bundle
npm run build -- --analyze

# Visualizar no browser
npx vite-bundle-visualizer
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estas diretrizes:

### Processo de Contribuição

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. **Commit** suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
5. **Push** para a branch (`git push origin feature/MinhaFeature`)
6. **Abra** um Pull Request

### Padrões de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Adiciona nova funcionalidade
fix: Corrige bug
docs: Atualiza documentação
style: Mudanças de estilo/formatação
refactor: Refatoração de código
perf: Melhoria de performance
test: Adiciona ou corrige testes
chore: Tarefas de manutenção
```

### Code Review

Pull requests serão revisados para:

- ✅ Funcionamento correto
- ✅ Testes passando
- ✅ Código limpo e bem documentado
- ✅ Sem regressões
- ✅ Seguimento dos padrões do projeto

### Issues

Reporte bugs ou sugira features através de [GitHub Issues](https://github.com/Anderson-Barcellos/Vertex/issues).

**Template de Bug Report:**

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Como Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável.

**Ambiente**
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 2.0.0]
```

---

## 📄 Licença

Este projeto é propriedade privada de **Anderson Barcellos**.

**Todos os direitos reservados.** © 2025

O código, documentação e recursos deste repositório não podem ser reproduzidos, distribuídos ou utilizados sem permissão explícita do autor.

Para solicitações de licenciamento ou uso comercial, entre em contato.

---

## 👨‍⚕️ Autor

**Dr. Anderson Barcellos (Anders)**
Médico Neuropsiquiatra e Ultrassonografista
Santa Cruz do Sul, RS, Brasil

---

## 🙏 Agradecimentos

- **Claude (Anthropic)**: Assistente de IA para desenvolvimento
- **Google Gemini**: API de IA generativa
- **OpenAI**: Modelos GPT
- **Radix UI**: Componentes primitivos acessíveis
- **Tailwind Labs**: Framework CSS utilitário
- **Vite Team**: Build tool moderno e rápido
- **React Team**: Biblioteca UI robusta

---

## 📞 Contato

Para questões, sugestões ou suporte:

- **GitHub Issues**: [Vertex Issues](https://github.com/Anderson-Barcellos/Vertex/issues)
- **Email**: [contato em desenvolvimento]

---

## 🎯 Roadmap

### Próximas Versões

#### v2.1.0 (Q1 2025)
- [ ] Sistema de templates customizáveis
- [ ] Exportação para PDF
- [ ] Modo offline com cache
- [ ] Histórico de exames

#### v2.2.0 (Q2 2025)
- [ ] Artérias Renais
- [ ] Obstétrico 1º Trimestre
- [ ] Sistema de usuários e autenticação
- [ ] Dashboard de estatísticas

#### v3.0.0 (Q3 2025)
- [ ] Mobile App (React Native)
- [ ] Reconhecimento de voz
- [ ] Integração com PACS
- [ ] Sistema de templates compartilhados

---

## 📊 Estatísticas do Projeto

- **Versão Atual**: 2.0.0
- **Status**: Em Produção ✅
- **Última Atualização**: Novembro 2025
- **Linhas de Código**: ~8.600
- **Componentes**: 80+
- **Exames Implementados**: 6
- **Testes**: Em desenvolvimento
- **Cobertura**: TBD

---

## 🌟 Features em Destaque

### 1. Geração de Laudos com IA
Sistema inteligente que analisa achados clínicos e gera impressões diagnósticas contextualizadas, seguindo terminologia médica padronizada.

### 2. BI-RADS Completo
Implementação completa do BI-RADS 5ª edição com léxicos padronizados e cálculo automático de categorias.

### 3. Velocimetria Doppler
Sistema avançado para exames vasculares com cálculo automático de graus de estenose (NASCET) e classificação de placas.

### 4. Interface Moderna
Design premium com glassmorphism, animações suaves e painéis flutuantes inteligentes.

### 5. Streaming Progressivo
Visualização em tempo real da geração de laudos com IA, com feedback progressivo ao usuário.

---

<div align="center">

**Feito com ❤️ por Anders + Claude**

🧉 **Bah, ficou tri legal esse projeto tchê!** 🧉

</div>
