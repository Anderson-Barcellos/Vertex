# Doppler de Carótidas — Levantamento e proposta de reorganização (jeito gaúcho)

## 1) Escopo do levantamento
Este documento descreve como as seções do exame de carótidas estão organizadas hoje e propõe uma reorganização mais clara e prática para quem preenche o laudo no dia a dia.

**Fontes analisadas**
- `src/data/carotidOrgans.ts` (definição das seções e achados)
- `src/data/examConfigs.ts` (configuração do exame)
- `src/components/original/CarotidFindingDetails.tsx` (detalhes de campos e lógica de apoio)

---

## 2) Organização atual (como está hoje)
### 2.1 Sidebar / Grupos principais
- Carótida Comum
- Bulbo Carotídeo
- Carótida Interna
- Carótida Externa
- Vertebral
- Observações

### 2.2 Seções por vaso (direita/esquerda repetidas)
**Carótida Comum (D/E)**
- Placas Ateroscleróticas (Placa, EMI)
- Estenose (Estenose, Oclusão)

**Bulbo (D/E)**
- Placas Ateroscleróticas (Placa)
- Estenose

**Carótida Interna (D/E)**
- Placas Ateroscleróticas (Placa, Placa ulcerada)
- Estenose (NASCET/IAC/ESVS)
- Outras Alterações (Dissecção, Elongação/Tortuosidade)

**Carótida Externa (D/E)**
- Placas Ateroscleróticas
- Estenose (Estenose, Oclusão)

**Vertebral (D/E)**
- Alterações de Fluxo (Estenose, Fluxo reverso/roubo, Oclusão)
- Variações Anatômicas (Hipoplasia, Aplasia)

**Observações**
- Observações gerais (texto livre)

---

## 3) O que fica meio atravancado (pontos de atrito)
- **Repetição de estrutura**: mesmas seções (Placas/Estenose) aparecem 8+ vezes com nomes muito parecidos.
- **Navegação não clínica**: o usuário pensa “lado direito” e “lado esquerdo”, mas a sidebar força “segmento por segmento”.
- **Mudança de contexto**: o preenchimento pula entre CCA → Bulbo → ICA → ECA em lados diferentes, o que aumenta erro por distração.
- **Vertebral mistura fluxo + anatomia**: útil, mas poderia ficar mais claro dentro de um eixo “fluxo/variações”.
- **Observações ficam isoladas**: ok, mas ficam longe do fluxo lógico quando há achados complexos.

---

## 4) Proposta de reorganização (mais fácil de preencher)

### Opção A — Por lateralidade (mais clínica e natural)
**Direita**
- Carótida Comum
- Bulbo
- Carótida Interna
- Carótida Externa
- Vertebral

**Esquerda**
- Carótida Comum
- Bulbo
- Carótida Interna
- Carótida Externa
- Vertebral

**Observações gerais**

**Por que funciona:** quem faz exame já pensa “vamos fechar o lado direito e depois o esquerdo”.

---

### Opção B — Por tipo de achado (mais rápida em casos complexos)
- **Placas e EMI** (CCA/Bulbo/ICA/ECA)
- **Estenoses/Oclusões** (com NASCET/IAC só na ICA)
- **Fluxo e Vertebrais** (padrões, roubo, variações)
- **Outras alterações** (dissecções/tortuosidades)
- **Observações gerais**

**Por que funciona:** reduz repetição e dá foco no tipo de achado que o médico quer documentar.

---

### Opção C — Híbrida (a que eu recomendaria, tche)
**Sidebar por lateralidade** + **Tabs internas por tipo de achado**
- Sidebar: “Direita / Esquerda / Observações”
- Dentro de cada lado:
  - Placas/EMI
  - Estenose
  - Outras alterações
  - Vertebral (fluxo/variações)

**Por que funciona:** mantém o raciocínio clínico (lado) e reduz repetição (achado).

---

## 5) Nomenclaturas sugeridas (para reduzir ruído)
- “Placas Ateroscleróticas” → “Placas/EMI”
- “Estenose” → “Estenose/Oclusão”
- “Outras Alterações” → “Outras”
- “Vertebral” → “Fluxo vertebral / Variações” (como subtabs)

---

## 6) Fluxo de preenchimento sugerido
1. Seleciona lado (Direita/Esquerda)
2. Marca placas/EMI (se houver)
3. Marca estenose/oclusão (se houver)
4. Marca fluxo vertebral (se houver)
5. Repete no lado oposto
6. Observações gerais

---

## 7) Checklist rápido (sem mexer em código, só direção)
- Consolidar navegação por lateralidade
- Reduzir repetição de blocos “Placas/Estenose”
- Manter critérios NASCET/IAC/ESVS apenas na ICA
- Destacar Vertebral como “Fluxo + Variações”
- Manter Observações gerais fora da lateralidade

---

```code  


*Insight

--------------------------------------------

Quando a navegação segue o raciocínio clínico (“fecho um lado e vou pro outro”), a chance de esquecer achado cai bastante. E juntar tudo por tipo de achado dentro de cada lado ajuda a preencher rápido sem se perder nos segmentos.

--------------------------------------------

```
