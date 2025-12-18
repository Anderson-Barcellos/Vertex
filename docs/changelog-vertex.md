# Vertex V2 - Changelog

Histórico de funcionalidades implementadas no projeto.

---

## Dezembro 2025

### TI-RADS Calculator - ACR 2017 (11/12/2025)
- **Service:** `src/services/tiradsCalculator.ts`
- **Componente:** `src/components/shared/TiradsCalculatorPanel.tsx`
- **Padrão:** ACR TI-RADS 2017 (American College of Radiology)
- **Funcionalidades:**
  - Cálculo automático de pontuação (0-14+ pts)
  - Categorização TR1-TR5 com labels descritivos
  - Conduta baseada em tamanho (PAAF vs seguimento)
  - Limiares ACR: TR3 ≥ 2.5cm, TR4 ≥ 1.5cm, TR5 ≥ 1.0cm
  - Breakdown visual da pontuação por categoria
- **Integração:** `FindingDetailsGeneric.tsx` detecta nódulos de tireóide automaticamente
- **Campos avaliados:** composition, echogenicity, shape, margins, echogenic_foci, size

### useAutoSave em Todos os Exames (11/12/2025)
- **Hook:** `src/hooks/useAutoSave.ts`
- **Cobertura:** 100% dos exames modernos
- **Comportamento:**
  - Debounce de 1s para evitar writes excessivos
  - Expiração de 1 hora (evita dados obsoletos)
  - Toast "Rascunho recuperado automaticamente" ao restaurar

### AIModelSelector Component (11/12/2025)
- **Arquivo:** `src/components/shared/AIModelSelector.tsx`
- **Função:** Dropdown reutilizável para seleção Gemini/OpenAI
- **Status:** Criado mas não integrado (já existe seleção no SelectedFindingsPanel)

### Campos TI-RADS no FindingMeasurement (11/12/2025)
- **Arquivo:** `src/types/report.ts`
- **Novos campos:**
  - `thyroidComposition`, `thyroidEchogenicity`, `thyroidShape`, `thyroidMargins`
  - `echogenicFoci`, `vascularityPattern`, `elastography`
  - `tiradsScore`, `tiradsCategory`, `tiradsRecommendation`

### Doppler Carótidas - ESVS 2023 / IAC 2021 (09/12/2025)
- **Arquivo:** `src/data/carotidOrgans.ts`
- **Conformidade:** 90% → 96% (excelente)
- **Novas constantes:**
  - `PATIENT_SYMPTOMS` - Status sintomático (ESVS 2023)
  - `PLAQUE_GSM` - Gray Scale Median (vulnerabilidade de placa)
  - `VULNERABLE_PLAQUE_FEATURES` - JBA, IPN, DWA, ulceração
  - `HIGH_RISK_FEATURES_ASYMPTOMATIC` - Features de alto risco
  - `IAC_2021_CRITERIA` - Atualização dos critérios SRU 2003
  - `INTERVENTION_INDICATION` - Indicações ESVS 2023
- **Nova função:** `calculateStenosisGrade()` - Calcula grau NASCET e recomendação
- **Novos campos em placas:** GSM, Features de Vulnerabilidade
- **Novos campos em estenose:** Status sintomático, Indicação de intervenção

### Auditoria de Diretrizes e Slash Command (09/12/2025)
- **Relatório:** `docs/auditoria-diretrizes.md` - Conformidade por exame
- **Slash Command:** `/audit-guidelines` - Auditor de guidelines reutilizável
- **Conformidade geral:** 89%

### Conformidade CBR - Abdome Total
- **Normatização:** Seguindo diretrizes do Colégio Brasileiro de Radiologia
- **Código CBHPM:** 4.09.01.12-2 (abdome superior, rins, bexiga, aorta, VCI, adrenais)
- **Removidos:** Próstata, Útero, Ovários (escopo de US Pélvica/Próstata separados)
- **Órgãos mantidos:** Fígado, Vesícula, Pâncreas, Rins, Baço, Bexiga, Aorta

### FindingDetailsEnhanced - Suporte a extraFields
- **Arquivo:** `components/original/FindingDetailsEnhanced.tsx`
- **Antes:** Só renderizava campos de medidas (`hasMeasurement`, `hasLocation`)
- **Agora:** Suporta `extraFields` completos (select, text, textarea)
- **Auto-save:** Campos salvam automaticamente no `onBlur`

### Seções de Observações em Todos os Exames
Adicionada seção "Observações" padronizada em todos os arquivos de dados:
- `organs.ts` (abdome) → `observacoes-abdome`
- `thyroidOrgans.ts` → `observacoes-tireoide`
- `carotidOrgans.ts` → `observacoes-carotidas`
- `breastUltrasoundOrgans.ts` → `observacoes-mama`
- `arterialOrgans.ts` → `observacoes-arterial`
- `venousOrgans.ts` → `observacoes-venoso`
- `abdominalWallOrgans.ts` → `observacoes`

### SelectedFindingsPanel - Campos Dinâmicos
- **Arquivo:** `components/original/SelectedFindingsPanel.tsx`
- **Antes:** Campos hardcoded (só `size`, `location`, `vps`, etc.)
- **Agora:** Renderiza qualquer campo de `measurements` dinamicamente

### Otimização Abdome Total v2 (11/12/2025)
- +3 seções novas (Vias Biliares, Retroperitônio, Alças/Apêndice, Cavidade Peritoneal)
- Couinaud em lesões hepáticas, Bosniak em cistos renais
- VCI colapsibilidade, apendicite com staging

### Otimização Carótidas v2 (11/12/2025)
- +5 seções (Subclávia D/E, Bulbo D/E, Conclusão)
- Bulbo como "zona quente" separada
- Estenose ACI estratificada (50-69%, ≥70%, suboclusão, oclusão)
- Morfologia ACI (coiling, kinking, FMD, tardus-parvus)
- Roubo subclávia com estágios (Latente/Parcial/Completo)
- Fix: VPS <50 não mais classificado como near_occlusion

---

## Novembro 2025

### Persistência de Estado em Painéis Flutuantes
- **Problema:** Dados perdidos ao minimizar/trocar órgão
- **Solução:** Estado elevado para componentes pais
- **Arquivos:** `OrganSection.tsx`, `FloatingOrganPanelModern.tsx`, todos exames modernos

### Sistema de Prompt Backend (Gemini)
- **Local:** `geminiStreamService.ts`
- **Prompt:** Radiologista com 20 anos experiência
- **Referências:** NASCET, Gray-Weale, EMI
- **Endpoint:** `/api/gemini` (proxy local)

### Doppler Venoso (Novo Exame)
- **Rota:** `/venous-exam`
- **Features:** TVP, insuficiência, classificação CEAP

### Refatoração Doppler MMII
- **Arterial:** 12 seções → 5 seções (~260 linhas)
- **Venoso:** 19 seções → 5 seções (~280 linhas)
- **Padrão:** Bilateralidade como campo dropdown ("Lado: D/E")

### FindingDetailsGeneric
- **Arquivo:** `components/original/FindingDetailsGeneric.tsx`
- **Função:** Renderiza `extraFields` dinamicamente (select, text, textarea)

### Fix: Painel não fecha com input focado
- **Hook:** `useOutsidePointerDismiss.ts`
- **Comportamento:** Se input/textarea está focado, clique fora não minimiza

### US Parede Abdominal (Novo Exame)
- **Rota:** `/abdominal-wall-exam`
- **Foco:** Hérnias (inguinal, umbilical, incisional, epigástrica)

### Melhorias UX
- Acessibilidade Motion: `@media (prefers-reduced-motion)`
- Focus States: `:focus-visible` com outline accent
- Progress Circle: SVG animado na Sidebar
- Indicador Unsaved: Classe `.has-unsaved-data` com glow
- Dropdown Animations: `scaleY` + stagger delay
- Panel Expand: Animação elástica

### Sistema de Autenticação
- **Arquivos:** `AuthContext.tsx`, `LoginPage.tsx`, `ProtectedRoute.tsx`
- **Credenciais:** anders / vertex2025
- **Funcionalidades:** Sessão persistente via localStorage

### Melhorias em Campos Médicos

**Doppler Arterial:**
- ITB (Índice Tornozelo-Braquial) com classificação SBACV
- ITB pós-exercício com tempo de recuperação

**Abdome Total - Campos Condicionais:**
- Esteatose: distribuição + atenuação hepática
- Colelitíase: tipo + mobilidade + sombra acústica
- Hidronefrose: lado + causa provável + medida pelve
- Aneurisma: morfologia + trombo mural + extensão
- Novos achados: hepatopatia crônica, vesícula porcelana, Murphy US+, pancreatite, Bosniak

**Tireóide - TI-RADS:**
- Pontuação: Composition (0-2), Echogenicity (0-3), Shape (0-3), Margins (0-3), Foci (0-3)
- Condutas: TR1-2 (sem PAAF), TR3-5 (PAAF baseada em tamanho)

**Doppler Venoso:**
- Manobras provocativas (Valsalva, compressão, ortostatismo)
- Tempo de refluxo em todos os achados de insuficiência

**Parede Abdominal:**
- Visibilidade dinâmica (repouso, Valsalva, tosse)
- Manobra realizada em todas as hérnias

---

*Última atualização: 16 de Dezembro de 2025*
