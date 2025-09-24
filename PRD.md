# Planning Guide

Sistema profissional de geração de laudos ultrassonográficos focado em Ultrassom de Abdome Total para profissionais de saúde brasileiros.

**Experience Qualities**: 
1. Professional - Interface médica confiável que inspira credibilidade e precisão
2. Efficient - Fluxo rápido e intuitivo que permite geração de laudos em minutos
3. Accurate - Terminologia médica precisa e estrutura padronizada de relatórios

**Complexity Level**: Light Application (multiple features with basic state)
- Sistema modular com navegação por órgãos, seleção de achados patológicos, e geração de relatórios estruturados com integração de IA para personalização.

## Essential Features

### Navegação por Órgãos (Sidebar)
- **Functionality**: Menu lateral com seções dedicadas para cada órgão abdominal
- **Purpose**: Organização lógica que espelha o processo de exame médico
- **Trigger**: Clique em qualquer órgão no menu lateral
- **Progression**: Menu inicial → Seleção do órgão → Lista de achados → Configuração de detalhes → Adição ao relatório
- **Success criteria**: Navegação fluida entre órgãos, estado persistente das seleções

### Seleção de Achados Patológicos
- **Functionality**: Checkboxes categorizados por achados comuns para cada órgão
- **Purpose**: Padronização e agilidade na documentação de alterações
- **Trigger**: Seleção de checkboxes dentro de cada seção de órgão
- **Progression**: Visualização da categoria → Seleção do achado → Especificação de grau/tipo → Confirmação
- **Success criteria**: Seleções múltiplas, categorização clara, terminologia médica precisa

### Geração de Relatório Estruturado
- **Functionality**: Compilação automática das seleções em formato de laudo médico
- **Purpose**: Produção de documentos profissionais padronizados
- **Trigger**: Botão "Gerar Relatório" ou visualização em tempo real
- **Progression**: Seleções completas → Processamento por IA → Formatação médica → Exibição final
- **Success criteria**: Formato A4, linguagem médica adequada, estrutura profissional

### Integração com IA para Personalização
- **Functionality**: Uso do Gemini AI para enriquecer descrições dos achados
- **Purpose**: Adicionar detalhes clínicos contextuais e melhorar qualidade do laudo
- **Trigger**: Após seleção de achados, antes da geração final
- **Progression**: Achados básicos → Prompt para IA → Enriquecimento textual → Integração no relatório
- **Success criteria**: Descrições clinicamente relevantes, manutenção da terminologia médica

## Edge Case Handling
- **Órgão não visualizado**: Checkbox para "não adequadamente visualizado" com opções de justificativa
- **Achados normais**: Opção padrão "dentro da normalidade" para cada órgão
- **Múltiplas alterações**: Suporte a seleções múltiplas com priorização automática
- **Relatório incompleto**: Validação e alertas para seções não preenchidas
- **Falha na IA**: Fallback para descrições pré-definidas se a integração falhar

## Design Direction
Interface médica moderna e confiável que transmite profissionalismo e precisão, com design limpo e minimalista que prioriza funcionalidade sobre elementos decorativos, seguindo padrões visuais de softwares médicos estabelecidos.

## Color Selection
Complementary (opposite colors) - Esquema baseado em azul médico profissional contrastado com elementos de destaque em laranja suave para criar hierarquia visual clara e manter a seriedade clínica.

- **Primary Color**: Azul médico (oklch(0.45 0.15 240)) - Transmite confiabilidade, profissionalismo e tradição médica
- **Secondary Colors**: Cinza neutro (oklch(0.95 0.01 240)) para backgrounds e elementos de suporte, mantendo foco no conteúdo
- **Accent Color**: Laranja médico (oklch(0.65 0.12 45)) para CTAs importantes e elementos que requerem atenção imediata
- **Foreground/Background Pairings**: 
  - Background principal (oklch(0.98 0.005 240)): Texto principal (oklch(0.15 0.02 240)) - Ratio 15.2:1 ✓
  - Primary (oklch(0.45 0.15 240)): Texto branco (oklch(0.99 0 0)) - Ratio 8.1:1 ✓
  - Accent (oklch(0.65 0.12 45)): Texto branco (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Cards (oklch(0.99 0.002 240)): Texto (oklch(0.2 0.02 240)) - Ratio 12.8:1 ✓

## Font Selection
Tipografia médica deve transmitir clareza, legibilidade e autoridade profissional, utilizando Inter para interface por sua excelente legibilidade em telas e Crimson Text para títulos que adiciona elegância sem comprometer a seriedade.

- **Typographic Hierarchy**: 
  - H1 (Título do Sistema): Inter Bold/32px/tight letter spacing
  - H2 (Órgãos): Inter SemiBold/24px/normal spacing  
  - H3 (Categorias): Inter Medium/18px/normal spacing
  - Body (Achados): Inter Regular/16px/relaxed line height
  - Small (Metadados): Inter Regular/14px/normal spacing

## Animations
Animações sutis e funcionais que auxiliam na orientação do usuário sem distrair do workflow médico, priorizando transições suaves que comunicam mudanças de estado e melhoram a percepção de responsividade.

- **Purposeful Meaning**: Movimentos que comunicam profissionalismo médico e guiam a atenção para elementos críticos do workflow
- **Hierarchy of Movement**: Sidebar transitions (300ms), checkbox feedback (150ms), report generation (500ms with progress)

## Component Selection
- **Components**: Sidebar para navegação, Card para seções de órgãos, Checkbox para achados, Textarea para relatório, Button para ações principais, Toast para feedback
- **Customizations**: ReportCanvas component para visualização em formato A4, OrganSection component para estrutura modular
- **States**: Buttons com estados loading durante geração de IA, checkboxes com estados indeterminate para categorias parciais
- **Icon Selection**: Phosphor icons médicos - Stethoscope, FileText, CheckCircle, Warning, Download
- **Spacing**: Sistema baseado em 8px (Tailwind scale), com containers amplos e respiração adequada para ambiente médico
- **Mobile**: Sidebar colapsível em mobile, cards stackeadas verticalmente, relatório com scroll horizontal se necessário