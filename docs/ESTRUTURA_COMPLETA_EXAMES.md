# 📂 ESTRUTURA COMPLETA DE EXAMES - VERTEX V2
Este documento consolida a arquitetura de dados, léxicos e classificadores de todos os exames de ultrassonografia do sistema.

---

🦴 ECODOPPLER DE TIREÓIDE
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Lobo Direito da Tireóide
┃
├─── 📁 CATEGORIA: Ecotextura do Parênquima
│    ├─── 🔍 Ecotextura heterogênea
│    │    └─── Campos: Padrão de Ecotextura, Vascularização
│    │
│    └─── 🔍 Tireoidite/Tireopatia difusa
│         └─── Campos: Padrão de Ecotextura, Vascularização
│
├─── 📁 CATEGORIA: Nódulos
│    ├─── 🔍 Nódulo tiroidiano
│    │    ├─── 📏 Medidas: Sim
│    │    ├─── 📍 Localização: Sim
│    │    └─── 📋 Campos extras:
│    │         ├─ Composição (5 opções)
│    │         ├─ Ecogenicidade (4 opções)
│    │         ├─ Forma (2 opções)
│    │         ├─ Margens (4 opções)
│    │         ├─ Focos ecogênicos (4 opções)
│    │         ├─ Padrão vascular Doppler (4 opções)
│    │         ├─ Elastografia (Score 1-5)
│    │         └─ TI-RADS calculado
│    │
│    └─── 🔍 Cisto simples
│         ├─── 📏 Medidas: Sim
│         └─── 📍 Localização: Sim
│
└─── 📁 CATEGORIA: Volumetria
     └─── 🔍 Volume do Lobo Direito
          ├─── 📏 Medidas: Sim
          └─── 📋 Campos extras: Comprimento, AP, Transverso (mm)

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Lobo Esquerdo da Tireóide
┃
└─── 📁 CATEGORIA: [Idêntico ao Lobo Direito]

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Istmo Tiroidiano
┃
└─── 📁 CATEGORIA: Alterações do Istmo
     ├─── 🔍 Espessamento do istmo
     │    └─── 📋 Campos extras: Espessura (mm)
     │
     └─── 🔍 Nódulo no istmo
          └─── 📋 Campos extras: [Léxico TI-RADS]

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Linfonodos Cervicais
┃
└─── 📁 CATEGORIA: Linfonodos Regionais
     ├─── 🔍 Linfonodo com características suspeitas
     │    ├─── 📏 Medidas: Sim
     │    ├─── 📍 Localização: Sim
     │    └─── 📋 Campos extras:
     │         ├─ Características Suspeitas (multiselect)
     │         └─ Nível Cervical (I a VII)
     │
     └─── 🔍 Linfonodo aumentado (benigno)
          └─── 📋 Campos extras: Nível Cervical

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Paratireoides
┃
└─── 📁 CATEGORIA: Lesões das Paratireoides
     ├─── 🔍 Adenoma / Hiperplasia / Cisto
     │    ├─── 📏 Medidas: Sim
     │    └─── 📋 Campos extras: Localização, Ecogenicidade, Vascularização

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 6 | Categorias: 11 | Achados: 15
🎯 CLASSIFICADORES: TI-RADS (ACR 2017), Volume Tiroidiano Automático.

═══════════════════════════════════════════════════════════════════════

🦴 ECODOPPLER DE CARÓTIDAS E VERTEBRAIS
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Artéria Carótida Comum (D/E)
┃
├─── 📁 CATEGORIA: Placas Ateroscleróticas
│    ├─── 🔍 Placa aterosclerótica
│    │    ├─── 📍 Localização: Sim
│    │    └─── 📋 Campos extras: Características (7 opções), Superfície, GSM
│    │
│    └─── 🔍 Espessamento Médio-Intimal (EMI)
│         └─── 📏 Medidas: Sim (mm)
│
├─── 📁 CATEGORIA: Estenoses
│    └─── 🔍 Estenose
│         ├─── 📏 Medidas: Sim (VPS, VDF, Ratio)
│         └─── 📋 Campos extras: Grau (NASCET), Borramento, Padrão de Fluxo
│
└─── 📁 CATEGORIA: Oclusão
     └─── 🔍 Oclusão (Fluxo ausente)

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Artéria Carótida Interna (D/E)
┃
└─── 📁 CATEGORIA: Estenoses e Placas
     └─── 🔍 Estenose
          ├─── 📏 Medidas: Sim (VPS, VDF, Ratio)
          └─── 📋 Campos extras: Grau (IAC 2021), Razão ACI/ACC

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Artéria Vertebral (D/E)
┃
├─── 📁 CATEGORIA: Alterações de Fluxo
│    ├─── 🔍 Estenose / Oclusão
│    └─── 🔍 Fluxo reverso (roubo da subclávia)
│         └─── 📋 Campos extras: Padrão de Fluxo, Grau de Roubo
│
└─── 📁 CATEGORIA: Variações Anatômicas
     └─── 🔍 Hipoplasia / Aplasia

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 8 | Categorias: 12 | Achados: 18
🎯 CLASSIFICADORES: Critérios IAC 2021, Risco de Placa (ESVS 2023), Roubo da Subclávia.

═══════════════════════════════════════════════════════════════════════

🎀 ULTRASSONOGRAFIA DE MAMAS
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Mama (Direita / Esquerda)
┃
├─── 📁 CATEGORIA: Nódulos
│    └─── 🔍 Nódulo
│         ├─── 📏 Medidas: Sim | 📍 Localização: Sim | 🔢 Quantidade: Sim
│         └─── 📋 Campos extras:
│              ├─ Forma, Orientação, Margens, Ecogenicidade
│              ├─ Características Posteriores, Calcificações
│              ├─ Doppler: Fluxo e Padrão Vascular
│              ├─ Elastografia SWE (Emean, Emax, Qualitativo)
│              └─ BI-RADS calculado
│
├─── 📁 CATEGORIA: Cistos
│    └─── 🔍 Cisto (Simples, Complicado, Complexo)
│
├─── 📁 CATEGORIA: Alterações Cutâneas / Ductais
│    └─── 🔍 Espessamento, Retração, Ectasia, Massa Intraductal
│
└─── 📁 CATEGORIA: Distorção Arquitetural
     └─── 🔍 Distorção (Focal, Cicatricial)

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Linfonodos Axilares (D/E)
┃
└─── 📁 CATEGORIA: Linfonodos Axilares
     └─── 🔍 Linfonodo (Normal, Espessamento Cortical, Perda do Hilo)

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 4 | Categorias: 12 | Achados: 10
🎯 CLASSIFICADORES: BI-RADS (5ª Ed.), Downgrade por Elastografia, VPP Estimado.

═══════════════════════════════════════════════════════════════════════

🍏 ULTRASSONOGRAFIA ABDOMINAL TOTAL
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Fígado
┃
├─── 📁 CATEGORIA: Dimensões e Contornos (Hepatomegalia, Cirrose)
├─── 📁 CATEGORIA: Ecotextura (Esteatose Grau I-III, Hepatopatia Crônica)
└─── 📁 CATEGORIA: Lesões Focais (Cisto, Hemangioma, Nódulo Sólido)

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Vesícula Biliar
┃
├─── 📁 CATEGORIA: Cálculos (Colelitíase, Lama Biliar)
├─── 📁 CATEGORIA: Parede (Colecistite, Pólipos, Espessamento)
└─── 📁 CATEGORIA: Cirurgia (Colecistectomia)

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Rins (D/E)
┃
├─── 📁 CATEGORIA: Calculose (Nefrolitíase, Hidronefrose)
└─── 📁 CATEGORIA: Lesões (Cistos Bosniak I-IV, Massa Renal)

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Pâncreas / Baço / Bexiga / Aorta
┃
└─── 📁 CATEGORIA: Pancreatite, Esplenomegalia, Cistite, Aneurisma de Aorta

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 9 | Categorias: 18 | Achados: 32
🎯 CLASSIFICADORES: Grau de Esteatose, Bosniak, Hidronefrose, Risco de Aneurisma.

═══════════════════════════════════════════════════════════════════════

🌊 DOPPLER DE VASOS ABDOMINAIS
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Aorta Abdominal
┃
└─── 📁 CATEGORIA: Aneurismas e Ectasias
     └─── 🔍 Aneurisma de Aorta
          ├─── 📏 Medidas: Diâmetro Máximo (cm)
          └─── 📋 Campos extras: Classificação (Pequeno a Gigante), Trombo, Extensão

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Artérias Renais (D/E)
┃
└─── 📁 CATEGORIA: Estenose Renal
     └─── 🔍 Estenose de Artéria Renal
          ├─── 📏 Medidas: PSV, RAR (Razão Renal/Aorta)
          └─── 📋 Campos extras: Grau (<60%, 60-99%, Crítica), Displasia Fibromuscular

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Artéria Mesentérica Superior / Tronco Celíaco
┃
└─── 📁 CATEGORIA: Estenose Mesentérica
     └─── 🔍 Estenose
          ├─── 📏 Medidas: PSV, EDV
          └─── 📋 Campos extras: Padrão de Fluxo (Jejum/Pós-prandial)

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 6 | Categorias: 10 | Achados: 12
🎯 CLASSIFICADORES: RAR (Renal-Aortic Ratio), Critérios de Estenose Mesentérica.

═══════════════════════════════════════════════════════════════════════

🧱 ULTRASSONOGRAFIA DE PAREDE ABDOMINAL
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Regiões Inguinais / Umbilical / Epigástrica
┃
├─── 📁 CATEGORIA: Hérnias (Indireta, Direta, Femoral, Umbilical)
│    ├─── 📏 Medidas: Óstio, Saco herniário
│    └─── 📋 Campos extras: Visibilidade, Manobra, Conteúdo, Redutibilidade
│
└─── 📁 CATEGORIA: Defeitos e Massas
     └─── 🔍 Diástase dos Retos, Lipoma, Coleção/Seroma

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 6 | Categorias: 8 | Achados: 12
🎯 CLASSIFICADORES: Dinâmica de Manobras (Valsalva/Tosse), Redutibilidade.

═══════════════════════════════════════════════════════════════════════

🏃 DOPPLER ARTERIAL DE MMII
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Índices de Pressão (ITB / IDB)
┃
└─── 📁 CATEGORIA: Hemodinâmica e Clínica
     └─── 🔍 ITB, IDB, Claudicação, Classificação WIfI

─────────────────────────────────────────────────────────────────────

📋 ÓRGÃO: Segmentos Arteriais (Ilíaco, Femoral, Poplíteo, Tibiais)
┃
├─── 📁 CATEGORIA: Estenoses (Grau Leve/Mod/Grave, VR, Onda)
├─── 📁 CATEGORIA: Oclusões (Aguda/Crônica, Colaterais)
└─── 📁 CATEGORIA: Aneurismas (Poplíteo, Ilíaco)

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 6 | Categorias: 10 | Achados: 14
🎯 CLASSIFICADORES: ITB, WIfI, Fontaine, Velocity Ratio (VR).

═══════════════════════════════════════════════════════════════════════

🦵 DOPPLER VENOSO DE MMII
═══════════════════════════════════════════════════════════════════════

📋 ÓRGÃO: Sistema Profundo / Safênico / Perfurantes
┃
├─── 📁 CATEGORIA: Trombose (TVP Aguda/Crônica, Tromboflebite)
├─── 📁 CATEGORIA: Insuficiência (Refluxo JSF/JSP, Tronco Safena, Perfurantes)
└─── 📁 CATEGORIA: Clínica e Score (VCSS, CEAP Completo)

─────────────────────────────────────────────────────────────────────

📊 RESUMO ESTATÍSTICO:
• Total de Órgãos: 8 | Categorias: 14 | Achados: 18
🎯 CLASSIFICADORES: Critérios de Refluxo (>0.5s/1.0s), Score VCSS, CEAP.

═══════════════════════════════════════════════════════════════════════
