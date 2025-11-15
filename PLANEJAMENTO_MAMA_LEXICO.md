# 🎯 Sistema de Laudos de Mama com Léxicos BI-RADS e Calculadora Automática

## 📋 Visão Geral

Sistema simplificado que usa **léxicos BI-RADS oficiais** em dropdowns simples e calcula automaticamente a categoria BI-RADS baseado nas características selecionadas.

---

## 🔤 Léxicos BI-RADS Oficiais (ACR)

### Para NÓDULOS/MASSAS:

#### 1. **Forma**
- ⚪ Oval
- ⚪ Redonda
- ⚪ Irregular

**Pontuação:**
- Oval/Redonda: 0 pontos (favorece benignidade)
- Irregular: +2 pontos (suspeito)

---

#### 2. **Orientação**
- ⚪ Paralela à pele
- ⚪ Não-paralela (antiparalela)

**Pontuação:**
- Paralela: 0 pontos (benigno)
- Não-paralela: +2 pontos (suspeito)

---

#### 3. **Margens**
- ⚪ Circunscritas (bem definidas)
- ⚪ Indistintas
- ⚪ Angular
- ⚪ Microlobuladas
- ⚪ Espiculadas

**Pontuação:**
- Circunscritas: 0 pontos (benigno)
- Indistintas: +1 ponto (intermediário)
- Angular: +1 ponto (intermediário)
- Microlobuladas: +2 pontos (suspeito)
- Espiculadas: +3 pontos (altamente suspeito)

---

#### 4. **Padrão de Eco**
- ⚪ Anecoico
- ⚪ Hiperecoico
- ⚪ Complexo cístico-sólido
- ⚪ Hipoecoico
- ⚪ Isoecoico
- ⚪ Heterogêneo

**Pontuação:**
- Anecoico: -1 ponto (cisto simples)
- Hiperecoico: 0 pontos (pode ser gordura)
- Isoecoico: 0 pontos
- Hipoecoico: +1 ponto
- Heterogêneo: +1 ponto
- Complexo: +1 ponto

---

#### 5. **Características Acústicas Posteriores**
- ⚪ Sem alterações
- ⚪ Reforço acústico
- ⚪ Sombra acústica
- ⚪ Padrão combinado

**Pontuação:**
- Sem alterações: 0 pontos
- Reforço: -1 ponto (favorece cisto)
- Sombra: +2 pontos (suspeito - pode ser carcinoma)
- Combinado: +1 ponto

---

#### 6. **Calcificações na Lesão**
- ⚪ Ausentes
- ⚪ Macrocalcificações (grosseiras)
- ⚪ Microcalcificações (puntiformes)

**Pontuação:**
- Ausentes: 0 pontos
- Macrocalcificações: 0 pontos (benignas)
- Microcalcificações: +2 pontos (suspeitas)

---

#### 7. **Vascularização (Doppler)**
- ⚪ Ausente
- ⚪ Mínima (periférica)
- ⚪ Moderada (interna)
- ⚪ Acentuada (central penetrante)

**Pontuação:**
- Ausente: 0 pontos
- Mínima: 0 pontos
- Moderada: +1 ponto
- Acentuada: +2 pontos

---

## 🧮 Calculadora Automática de BI-RADS

### Algoritmo de Pontuação:

```javascript
function calcularBiRads(caracteristicas) {
  let pontos = 0;

  // Se for CISTO SIMPLES (anecoico + reforço + sem componente sólido)
  if (caracteristicas.padrao === 'anecoico' &&
      caracteristicas.posterior === 'reforço' &&
      caracteristicas.forma === 'oval') {
    return 'BI-RADS 2';
  }

  // Soma pontuações
  pontos += caracteristicas.formaPontos;
  pontos += caracteristicas.orientacaoPontos;
  pontos += caracteristicas.margensPontos;
  pontos += caracteristicas.ecoPontos;
  pontos += caracteristicas.posteriorPontos;
  pontos += caracteristicas.calcificacoesPontos;
  pontos += caracteristicas.vascularizacaoPontos;

  // Classificação final
  if (pontos <= 0) return 'BI-RADS 2 (Benigno)';
  if (pontos <= 2) return 'BI-RADS 3 (Provavelmente Benigno)';
  if (pontos <= 4) return 'BI-RADS 4A (Baixa Suspeita)';
  if (pontos <= 6) return 'BI-RADS 4B (Moderada Suspeita)';
  if (pontos <= 8) return 'BI-RADS 4C (Alta Suspeita)';
  return 'BI-RADS 5 (Altamente Suspeito)';
}
```

---

## 🎨 Interface Proposta

### Tela de Seleção:

```
┌─────────────────────────────────────────────────────────┐
│ ULTRASSOM DE MAMA - Gerador de Laudos                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📍 MAMA DIREITA                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Achado: [Normal ▼]                              │   │
│ │         Normal / Nódulo / Cisto / Outro         │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ⚠️ SE NÓDULO SELECIONADO:                              │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Tamanho: [1.2 cm] Localização: [QSE ▼]         │   │
│ │                                                 │   │
│ │ Forma:        [Oval ▼]           👉 0 pts       │   │
│ │ Orientação:   [Paralela ▼]       👉 0 pts       │   │
│ │ Margens:      [Circunscritas ▼]  👉 0 pts       │   │
│ │ Padrão eco:   [Hipoecoico ▼]     👉 +1 pt       │   │
│ │ Posterior:    [Sem alteração ▼]  👉 0 pts       │   │
│ │ Calcific.:    [Ausentes ▼]       👉 0 pts       │   │
│ │ Doppler:      [Ausente ▼]        👉 0 pts       │   │
│ │                                                 │   │
│ │ 🎯 BI-RADS CALCULADO: 3 (1 ponto)               │   │
│ │    Provavelmente Benigno                        │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 📍 MAMA ESQUERDA                                        │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Achado: [Normal ▼]                              │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 📍 LINFONODOS AXILARES                                  │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Direita: [Normal ▼]  Esquerda: [Normal ▼]       │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│         [🚀 GERAR LAUDO COMPLETO]                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Exemplo de Laudo Gerado

### Entrada:
- Mama Direita: Nódulo 1.2cm QSE
  - Forma: Oval (0)
  - Orientação: Paralela (0)
  - Margens: Circunscritas (0)
  - Eco: Hipoecoico (+1)
  - Posterior: Sem alteração (0)
  - Calcif: Ausentes (0)
  - Doppler: Ausente (0)
  - **Total: 1 ponto → BI-RADS 3**

### Saída (Laudo Automático):

```
LAUDO ULTRASSONOGRÁFICO DAS MAMAS

TÉCNICA:
Exame realizado com transdutor linear de alta frequência (7-12 MHz).

ACHADOS:

MAMA DIREITA:
Nódulo sólido no quadrante superior externo, medindo 1.2 cm no
maior eixo. Apresenta forma oval, orientação paralela à pele,
margens circunscritas e padrão hipoecoico homogêneo. Sem alterações
das características acústicas posteriores. Ausência de calcificações
intralesionais. Doppler não demonstra vascularização significativa.

Classificação: BI-RADS 3

MAMA ESQUERDA:
Tecido mamário de padrão fibroglandular habitual. Ausência de nódulos
ou formações císticas. Ductos de calibre preservado.

LINFONODOS:
Linfonodos axilares bilaterais de morfologia habitual, com hilo
gorduroso preservado.

IMPRESSÃO:
1. Mama direita: Nódulo sólido no QSE medindo 1.2 cm - BI-RADS 3
   (Provavelmente benigno). Sugere-se controle ultrassonográfico
   em 6 meses.

2. Mama esquerda: BI-RADS 1 (sem alterações).

BI-RADS FINAL: 3
```

---

## 🛠️ Implementação Técnica

### Estrutura de Dados:

```typescript
interface LesaoMamaria {
  lado: 'direita' | 'esquerda';
  tipo: 'normal' | 'nodulo' | 'cisto' | 'outro';
  tamanho?: string;
  localizacao?: string; // QSE, QSI, QIE, QII, Retroareolar

  // Léxicos BI-RADS
  forma?: 'oval' | 'redonda' | 'irregular';
  orientacao?: 'paralela' | 'nao-paralela';
  margens?: 'circunscritas' | 'indistintas' | 'angular' | 'microlobuladas' | 'espiculadas';
  padraoEco?: 'anecoico' | 'hiperecoico' | 'complexo' | 'hipoecoico' | 'isoecoico' | 'heterogeneo';
  posterior?: 'sem-alteracao' | 'reforco' | 'sombra' | 'combinado';
  calcificacoes?: 'ausentes' | 'macro' | 'micro';
  vascularizacao?: 'ausente' | 'minima' | 'moderada' | 'acentuada';

  // Calculado automaticamente
  biradsCalculado?: string;
  pontuacaoTotal?: number;
}
```

---

## ✅ Vantagens do Sistema

1. ✅ **Padronização** - Usa terminologia BI-RADS oficial
2. ✅ **Educativo** - Mostra como cada característica afeta a classificação
3. ✅ **Objetivo** - Cálculo automático reduz subjetividade
4. ✅ **Rápido** - Interface simplificada, sem campos desnecessários
5. ✅ **Transparente** - Usuário vê a pontuação de cada item
6. ✅ **Instantâneo** - Zero latência, sem IA externa

---

## 🎯 Próximos Passos

1. Criar componente de seleção de características
2. Implementar calculadora de pontuação
3. Gerar frases do laudo baseadas nas seleções
4. Adicionar validações (ex: cisto não tem margens espiculadas)
5. Interface visual moderna e intuitiva

---

**Data:** 15/11/2025
**Versão:** 1.0
**Status:** Planejamento
