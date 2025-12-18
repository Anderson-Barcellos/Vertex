# Panorama Atual - Ecodoppler de Tireóide

**Status:** v1 (Em revisão)  
**Arquivo:** `src/data/thyroidOrgans.ts`  
**Diretrizes:** ACR TI-RADS 2017  
**Atualizado:** 16/12/2025

---

## Resumo

| # | Seção | Categorias | Achados |
|---|-------|------------|---------|
| 1 | Lobo Direito da Tireóide | 3 | 4 |
| 2 | Lobo Esquerdo da Tireóide | 3 | 4 |
| 3 | Istmo Tiroidiano | 1 | 2 |
| 4 | Linfonodos Cervicais | 1 | 2 |
| 5 | Paratireoides | 1 | 3 |
| 6 | Observações | 1 | 1 |
| **TOTAL** | **10** | **16** |

---

## 1. LOBO DIREITO DA TIREÓIDE (LTD)

### 1.1 Ecotextura do Parênquima
- Ecotextura heterogênea *(padrão, vascularização)*
- Tireoidite/Tireopatia difusa *(padrão, vascularização)*

### 1.2 Nódulos
- Nódulo tiroidiano *(medida, localização, composição, ecogenicidade, forma, margens, focos ecogênicos, padrão vascular, elastografia, TI-RADS)*
- Cisto simples *(medida, localização)*

### 1.3 Dimensões / Volume
- Aumento volumétrico *(medida, comprimento, AP, transverso)*

---

## 2. LOBO ESQUERDO DA TIREÓIDE (LTE)

### 2.1 Ecotextura do Parênquima
- Ecotextura heterogênea *(padrão, vascularização)*
- Tireoidite/Tireopatia difusa *(padrão, vascularização)*

### 2.2 Nódulos
- Nódulo tiroidiano *(medida, localização, composição, ecogenicidade, forma, margens, focos ecogênicos, padrão vascular, elastografia, TI-RADS)*
- Cisto simples *(medida, localização)*

### 2.3 Dimensões / Volume
- Aumento volumétrico *(medida, comprimento, AP, transverso)*

---

## 3. ISTMO TIROIDIANO

### 3.1 Alterações do Istmo
- Espessamento do istmo *(espessura mm)*
- Nódulo no istmo *(composição, ecogenicidade, forma, margens, focos ecogênicos, TI-RADS)*

---

## 4. LINFONODOS CERVICAIS

### 4.1 Linfonodos Regionais
- Linfonodo com características suspeitas *(medida, localização, características suspeitas, nível cervical)*
- Linfonodo aumentado (benigno) *(medida, localização, nível cervical)*

---

## 5. PARATIREOIDES

### 5.1 Lesões das Paratireoides
- Adenoma de Paratireoide *(medida, localização, ecogenicidade, vascularização, polo feeding)*
- Hiperplasia de Paratireoides *(medida, número de glândulas, localização)*
- Cisto de Paratireoide *(medida, localização, conteúdo)*

---

## 6. OBSERVAÇÕES

### 6.1 Observações Gerais
- Observação Adicional *(textarea)*

---

## Constantes Implementadas (ACR TI-RADS 2017)

### Composição do Nódulo (0-2 pts)
| Valor | Pontos | Risco |
|-------|--------|-------|
| Cístico ou quase totalmente cístico | 0 | Baixo |
| Espongiforme | 0 | Baixo |
| Misto cístico-sólido | 1 | Baixo |
| Sólido com coloide | 1 | Médio |
| Sólido | 2 | Médio |

### Ecogenicidade (0-3 pts)
| Valor | Pontos | Risco |
|-------|--------|-------|
| Anecogênico | 0 | Baixo |
| Hiperecogênico/Isoecogênico | 1 | Baixo |
| Hipoecogênico | 2 | Médio |
| Muito hipoecogênico | 3 | Alto |

### Forma (0-3 pts)
| Valor | Pontos | Risco |
|-------|--------|-------|
| Mais largo que alto | 0 | Baixo |
| Mais alto que largo | 3 | Alto |

### Margens (0-3 pts)
| Valor | Pontos | Risco |
|-------|--------|-------|
| Lisas | 0 | Baixo |
| Mal definidas | 0 | Baixo |
| Lobuladas ou irregulares | 2 | Médio |
| Extensão extratiroidea | 3 | Crítico |

### Focos Ecogênicos (0-3 pts)
| Valor | Pontos | Risco |
|-------|--------|-------|
| Ausentes ou artefatos em cometa | 0 | Baixo |
| Macrocalcificações | 1 | Médio |
| Calcificações periféricas (anel) | 2 | Médio |
| Microcalcificações puntiformes | 3 | Alto |

### Categorias TI-RADS
| Categoria | Pontos | Risco | Conduta |
|-----------|--------|-------|---------|
| TR1 (Benigno) | 0 | Baixo | Sem seguimento |
| TR2 (Não suspeito) | ≤2 | Baixo | Sem seguimento |
| TR3 (Levemente suspeito) | 3 | Médio | PAAF ≥2.5cm / Seg ≥1.5cm |
| TR4 (Moderadamente suspeito) | 4-6 | Alto | PAAF ≥1.5cm / Seg ≥1.0cm |
| TR5 (Altamente suspeito) | ≥7 | Crítico | PAAF ≥1.0cm / Seg ≥0.5cm |

---

## Funcionalidades Existentes

### Funções de Cálculo
- `calculateTIRADS()` - Calcula pontuação e categoria TI-RADS
- `calculateThyroidVolume()` - Volume do lobo (C × AP × T × 0.52)

### Constantes Auxiliares
- `VASCULARITY_PATTERN` - Padrão vascular Doppler
- `ELASTOGRAPHY_SCORE` - Score de elastografia (1-5)
- `PARENCHYMA_ECHOTEXTURE` - Ecotextura do parênquima
- `PARENCHYMA_VASCULARITY` - Vascularização parenquimatosa
- `LYMPH_NODE_FEATURES` - Características de linfonodos
- `LYMPH_NODE_SUSPICIOUS_CRITERIA` - Critérios de suspeição
- `THYROID_LOBE_LOCATION` - Localização no lobo
- `NORMAL_THYROID_DIMENSIONS` - Dimensões normais de referência

---

## Lacunas Identificadas para v2

### Estruturais
1. **Falta seção de Dimensões Globais** - Volume total, relação D/E
2. **Falta seção de Vascularização Global** - Doppler geral da glândula
3. **Lobo Piramidal** - Não contemplado (presente em ~50% dos pacientes)
4. **Traqueia/Esôfago** - Avaliação de compressão/desvio

### Nódulos
5. **Múltiplos nódulos** - Sem campo de numeração / nódulo dominante
6. **Crescimento** - Sem comparativo com exames anteriores
7. **Localização no lobo** - Presente mas não usado em todos achados

### Doppler
8. **Índice de Resistência** - Não documentado nos nódulos
9. **Padrão vascular geral** - Inferno tiroidiano (Graves)

### Linfonodos
10. **Níveis cervicais** - Falta níveis I-VII completos com descrição anatômica
11. **Cadeias específicas** - Jugular, espinal acessório, supraclavicular

### Paratireoides
12. **Cintilografia prévia** - Campo de correlação
13. **Localização ectópica** - Expandir opções

### Tireoidites
14. **Hashimoto** - Achados específicos (micronódulos, septos fibrosos)
15. **Graves** - Bócio difuso + inferno tiroidiano
16. **Subaguda** - Área hipoecóica focal dolorosa
17. **Riedel** - Invasão de estruturas adjacentes

### Bócio
18. **Classificação de bócio** - Difuso vs nodular vs multinodular
19. **Extensão subesternal** - Bócio mergulhante

### Pós-operatório
20. **Leito cirúrgico** - Tireoidectomia parcial/total
21. **Recidiva/Persistência** - Lesão em leito operatório

---

## Sugestão de Estrutura v2

| # | Seção | Observação |
|---|-------|------------|
| 1 | Dimensões Globais | Volume total, relação D/E, bócio |
| 2 | Lobo Direito | Parênquima + Nódulos (com numeração) |
| 3 | Lobo Esquerdo | Parênquima + Nódulos (com numeração) |
| 4 | Istmo | Espessamento + Nódulos |
| 5 | Lobo Piramidal | Presente/Ausente + Nódulos |
| 6 | Vascularização Doppler | Padrão global + IR |
| 7 | Linfonodos Cervicais | Por níveis I-VII |
| 8 | Paratireoides | Adenoma/Hiperplasia/Cisto |
| 9 | Estruturas Adjacentes | Traqueia/Esôfago/Vasos |
| 10 | Pós-Operatório | Leito/Recidiva (opcional) |
| 11 | Conclusão | Síntese + TI-RADS dominante |
| 12 | Observações | Textarea |

---

## Próximos Passos

1. [ ] Anders fornece schema otimizado com prioridades clínicas
2. [ ] Implementar reescrita do `thyroidOrgans.ts`
3. [ ] Integrar calculadora TI-RADS existente (`tiradsCalculator.ts`)
4. [ ] Verificar build + atualizar este panorama

---

*Última atualização: 16 de Dezembro de 2025*
