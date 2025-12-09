# Critérios de Classificação de Estenose Carotídea

**Referências:** IAC 2021, SRU 2003, ESVS 2023, NASCET/ECST

---

## 1. Método NASCET vs ECST

### NASCET (North American Symptomatic Carotid Endarterectomy Trial)
- **Fórmula:** `% estenose = (1 - diâmetro mínimo / diâmetro distal normal) × 100`
- **Referência:** Diâmetro da ACI **distal** à estenose (onde retorna ao normal)
- **Mais usado** internacionalmente

### ECST (European Carotid Surgery Trial)
- **Fórmula:** `% estenose = (1 - diâmetro mínimo / diâmetro estimado do bulbo) × 100`
- **Referência:** Diâmetro **estimado** do bulbo carotídeo
- **Superestima** o grau de estenose comparado ao NASCET

### Conversão ECST → NASCET
```
NASCET = (ECST × 0.6) - 10
```

---

## 2. Critérios de Velocidade (IAC 2021 / SRU 2003)

A **Intersocietal Accreditation Commission (IAC)** atualizou em 2021 os critérios originais do **SRU 2003** (Society of Radiologists in Ultrasound):

| Grau NASCET | VPS (cm/s) | VDF (cm/s) | Razão VPS ACI/ACC |
|-------------|------------|------------|-------------------|
| Normal / <50% | <125 | <40 | <2.0 |
| 50-69% (Moderada) | 125-230 | 40-100 | 2.0-4.0 |
| ≥70% (Grave) | >230 | >100 | >4.0 |
| Suboclusão | Variável/Baixa | Variável | Variável |
| Oclusão | Ausente | Ausente | N/A |

### Notas Importantes:

1. **VPS é o critério primário** - usar os outros para corroborar
2. **Critérios discordantes:** usar o mais severo (princípio da precaução)
3. **Suboclusão (near-occlusion):** velocidades podem ser paradoxalmente baixas ("string sign")
4. **Pós-endarterectomia/stent:** usar >300 cm/s como corte para reestenose significativa

---

## 3. Borramento Espectral (Spectral Broadening)

O preenchimento da janela espectral indica turbulência e correlaciona-se com estenose:

| Grau | Descrição | Correlação |
|------|-----------|------------|
| Ausente | Janela espectral limpa, preservada | Normal |
| Leve | Preenchimento parcial da janela | Estenose leve |
| Moderado | Janela quase totalmente preenchida | Estenose moderada |
| Acentuado | Janela completamente obliterada | Estenose grave |

**Limitação:** Subjetivo, operador-dependente. Usar como critério adicional, não isolado.

---

## 4. Diretrizes ESVS 2023 (European Society for Vascular Surgery)

### Indicações de Intervenção (CEA/CAS)

#### Pacientes SINTOMÁTICOS (AIT/AVC ipsilateral <6 meses):

| Estenose | Classe | Recomendação |
|----------|--------|--------------|
| 50-99% | **Classe I** | CEA/CAS recomendado (idealmente <14 dias do evento) |
| <50% | Classe III | Intervenção **NÃO** recomendada |

#### Pacientes ASSINTOMÁTICOS:

| Estenose | Classe | Recomendação |
|----------|--------|--------------|
| >60% + features alto risco | **Classe I** | CEA recomendado |
| >60% sem alto risco | Classe IIa | Considerar CEA se expectativa >5 anos e risco <3% |
| <60% | Classe III | Apenas tratamento clínico (BMT) |

### Features de Alto Risco em Assintomáticos:
- Progressão de estenose >20% em 6 meses
- Estenose contralateral ocluída
- Infartos silenciosos ipsilaterais (TC/RM)
- Placa ecolucente (GSM <25)
- Hemorragia intraplaca (RM)
- Microêmbolos ao Doppler transcraniano
- Reserva cerebrovascular reduzida
- Estenose >80%

---

## 5. Classificação de Placas

### Gray-Weale (Ecogenicidade):

| Tipo | Descrição | Risco |
|------|-----------|-------|
| I | Uniformemente hipoecogênica | **Alto** |
| II | Predominantemente hipoecogênica | **Alto** |
| III | Predominantemente hiperecogênica | Moderado |
| IV | Uniformemente hiperecogênica | Baixo |

### GSM (Gray Scale Median):

| Faixa | Interpretação | Risco |
|-------|---------------|-------|
| <25 | Placa ecolucente (lipídica) | **Alto** |
| 25-50 | Predominantemente ecolucente | Alto |
| 50-75 | Predominantemente ecogênica | Moderado |
| >75 | Ecogênica/Calcificada | Baixo |

### Features de Vulnerabilidade (ESVS 2023):
- **JBA** - Juxtaluminal Black Area (área negra junto ao lúmen)
- **IPN** - Neovascularização intraplaca (CEUS)
- **DWA** - Discrete White Areas (calcificações focais)
- Hemorragia intraplaca
- Ulceração >2mm profundidade
- Trombo luminal
- Superfície irregular
- Progressão rápida (>0.5mm/ano)

---

## 6. Algoritmo de Cálculo Implementado

O sistema Vertex usa o seguinte algoritmo:

```
1. Para cada critério disponível (VPS, VDF, Ratio, Borramento):
   - Classifica individualmente em: normal, leve, moderada, grave, crítica
   
2. Determina o grau final:
   - Usa o critério MAIS SEVERO entre todos avaliados
   
3. Calcula confiança:
   - Alta: ≥3 critérios avaliados E ≥2 concordantes
   - Média: ≥2 critérios avaliados
   - Baixa: apenas 1 critério
   
4. Gera alertas para:
   - Critérios discordantes
   - Placa vulnerável identificada
   - Sintomatologia presente
```

---

## 7. Referências Bibliográficas

1. **NASCET Collaborators.** Beneficial effect of carotid endarterectomy in symptomatic patients with high-grade carotid stenosis. *N Engl J Med.* 1991;325:445-453.

2. **Grant EG, et al.** Carotid artery stenosis: gray-scale and Doppler US diagnosis—Society of Radiologists in Ultrasound Consensus Conference. *Radiology.* 2003;229:340-346. **(SRU 2003)**

3. **Intersocietal Accreditation Commission.** IAC Standards and Guidelines for Vascular Testing Accreditation. 2021. **(IAC 2021)**

4. **Naylor AR, et al.** European Society for Vascular Surgery (ESVS) 2023 Clinical Practice Guidelines on the Management of Atherosclerotic Carotid and Vertebral Artery Disease. *Eur J Vasc Endovasc Surg.* 2023;65:7-111. **(ESVS 2023)**

5. **Gray-Weale AC, et al.** Carotid artery atheroma: comparison of preoperative B-mode ultrasound appearance with carotid endarterectomy specimen pathology. *J Cardiovasc Surg.* 1988;29:676-681.

6. **de Weerd M, et al.** Prevalence of asymptomatic carotid artery stenosis in the general population: an individual participant data meta-analysis. *Stroke.* 2010;41:1294-1297.

---

*Documento gerado para referência clínica. Última atualização: Dezembro 2025.*
