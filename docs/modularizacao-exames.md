# Auditoria de Modularização das Modalidades de Exame — Vertex V2

**Data:** 2026-01-13  
**Escopo:** Estrutura de dados dos exames em `src/data/*Organs.ts` e uso de `src/data/shared/*`.  
**Objetivo:** Identificar o que já está modularizado, o que falta migrar para os módulos compartilhados e quais itens específicos cada modalidade mantém por necessidade clínica.

---

## 1) Resumo rápido
- Modalidade quase totalmente modularizada: **Abdome Total**.
- Modalidades parcialmente modularizadas: **Arterial MI**, **Venoso MI**.
- Modalidades ainda não modularizadas: **Carótidas**, **Tireoide**, **Mama**, **Vasos Abdominais**, **Parede Abdominal**.
- O factory de observações (`createObservacoesOrgan`) só é usado pelo exame **Arterial**; todas as demais modalidades mantêm blocos próprios de Observações.

---

## 2) Matriz por modalidade

| Modalidade | Arquivo | Status de modularização | Uso atual de `shared` | Elementos específicos (devem ficar locais) | O que ainda está duplicado / pode migrar |
| --- | --- | --- | --- | --- | --- |
| Abdome Total | `src/data/organs.ts` | Quase modularizada | Várias constantes de `commonFields` (lateralidade, Bosniak, esteatose, ascite, aneurisma, nefropatia etc.) | Catálogo completo de órgãos abdominais | Observações não usam `createObservacoesOrgan`; alguns campos genéricos repetidos poderiam vir de helpers |
| Carótidas | `src/data/carotidOrgans.ts` | Não modularizada | Nenhum import de `shared` | Critérios NASCET/IAC, análise de estenose, placas vulneráveis, localizações vertebrais | Lateralidade, grau de estenose, padrões de fluxo, trombo/recanalização e Observações estão reescritos e existem em `shared` |
| Tireoide | `src/data/thyroidOrgans.ts` | Não modularizada | Nenhum import de `shared` | TI-RADS, elastografia, volumetria, paratireoides | Vascularização, ecotextura, regiões do lobo e Observações existem em `shared` |
| Mama | `src/data/breastUltrasoundOrgans.ts` | Não modularizada | Nenhum import de `shared` | Léxico BI-RADS, SWE, sugestões diagnósticas | Localização (quadrante/relógio/axila) e Observações já têm equivalentes em `shared` |
| Arterial MI | `src/data/arterialOrgans.ts` | Parcial | Importa lateralidade, grau de estenose, padrões de onda, oclusão, colaterais, tipo de placa, factory de Observações | Segmentação aorto-ilíaco/femoral/poplíteo/tibial; detalhes de ITB/IDB/WIfI | ITB, WIfI e claudicação estão duplicados; já existem em `commonFields` |
| Venoso MI | `src/data/venousOrgans.ts` | Parcial | Só importa `LATERALITY_NO_BILATERAL` | Estrutura CEAP/VCSS, safenas, cisto de Baker | CEAP, refluxo, compressibilidade, trombo, manobras, Observações estão duplicados e existem em `shared` |
| Vasos Abdominais | `src/data/abdominalVesselsOrgans.ts` | Não modularizada | Nenhum import de `shared` | Critérios de estenose aorta/renais/mesentéricas, aneurisma/dissecção | Padrão de fluxo e trombo mural já existem em `commonFields`; Observações são manuais |
| Parede Abdominal | `src/data/abdominalWallOrgans.ts` | Não modularizada | Nenhum import de `shared` | Modelagem das diversas hérnias | Listas de conteúdo, visibilidade, manobras e redutibilidade de hérnias estão em `commonFields`; Observações manuais |

---

## 3) Itens compartilháveis já disponíveis em `src/data/shared`
- **Constantes gerais:** `LATERALITY`, `PRESENCE`, `SEVERITY_GRADES`, `FLOW_PATTERN`, `STENOSIS_GRADE`, `THROMBUS_*`, `REFLUX_*`, `CEAP_*`, `HERNIA_*`, `BREAST_*`, `THYROID_*`, `WIFI_*`, `ITB_CLASSIFICATION` etc.
- **Helpers de campos:** `createLateralityField`, `createPresenceField`, `createSeverityField`, `createLocationField`.
- **Observações reutilizável:** `createObservacoesOrgan` / `observacoesOrgan` (já pronto para qualquer modalidade).

---

## 4) Recomendações para modularizar com baixo impacto
1) **Observações unificadas** — trocar blocos manuais por `createObservacoesOrgan('<sufixo>')` em todas as modalidades.
2) **Venoso/Arterial** — importar de `shared` os arrays `CEAP_*`, `REFLUX_*`, `THROMBUS_*`, `PROVOCATIVE_MANEUVERS`, `COMPRESSIBILITY`, `DEEP_VEINS`, `WIFI_*`, `ITB_CLASSIFICATION`, removendo duplicatas locais.
3) **Parede Abdominal** — usar `HERNIA_CONTENTS`, `HERNIA_REDUCIBILITY`, `HERNIA_VISIBILITY`, `DYNAMIC_MANEUVERS` já definidos em `commonFields`.
4) **Mama** — substituir listas de localização por `BREAST_LOCATION_QUADRANT`, `BREAST_LOCATION_CLOCK`, `AXILLARY_LEVEL` do `shared`.
5) **Tireoide** — alinhar vascularização/ecotextura/regiões com `THYROID_*` exportados de `commonFields`.
6) **Carótidas** — padronizar grau de estenose e fluxo com `STENOSIS_GRADE` e `FLOW_PATTERN`; manter locais apenas critérios NASCET/IAC e vulnerabilidade que são específicos.

---

## 5) Próximos passos sugeridos (ordem de menor risco)
1. Refatorar Observações em todas as modalidades para o factory compartilhado.  
2. Deduplicar Venoso/Arterial trazendo CEAP/WIfI/ITB e campos de refluxo do `shared`.  
3. Migrar listas de hérnias de Parede Abdominal para `shared`.  
4. Substituir localizações de Mama e Tireoide pelos arrays comuns.  
5. Ajustar Carótidas para usar os campos genéricos de estenose/fluxo antes de mexer em critérios específicos.  

---

*Insight
--------------------------------------------
Centralizar léxicos e listas clínicas em `src/data/shared` não só reduz código, mas impede divergências de terminologia entre exames (ex.: CEAP ou WIfI com valores diferentes). Começar pela troca das Observações e das listas de classificação venosa/arterial dá o maior ganho com o menor risco.
--------------------------------------------
