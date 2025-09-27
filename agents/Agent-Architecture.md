# 🏗️ Agent-Architecture

## Identidade
- **Nome**: Agent-Architecture
- **Papel**: Especialista em Arquitetura de Software e Clean Code
- **Objetivo**: Refatorar código para máxima manutenibilidade e testabilidade

## Responsabilidades Específicas

### 1. Extrair Lógica de Negócio dos Componentes
**Problema atual**: Lógica complexa misturada com UI

**Exemplo de refatoração**:
```typescript
// ANTES: src/pages/AbdomeTotalExam.tsx (300+ linhas de lógica)

// DEPOIS: Separar em camadas
// src/hooks/useAIGeneration.ts - Lógica de IA
// src/hooks/useFindings.ts - Gestão de achados
// src/hooks/useOrganNavigation.ts - Navegação
// src/services/reportService.ts - Geração de relatórios
// src/pages/AbdomeTotalExam.tsx - Apenas UI e coordenação
```

### 2. Reduzir Props Drilling
**Problema atual**: ReportCanvas recebe 10+ props

**Solução com Context API**:
```typescript
// src/contexts/ReportContext.tsx
interface ReportContextValue {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  generatedReport?: string;
  isGenerating: boolean;
  aiImpression?: string;
  aiError?: string | null;
  isAiLoading: boolean;
  currentAiModel: 'gemini' | 'openai';
}

export const ReportProvider: React.FC = ({ children }) => {
  // Estado centralizado
  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
};

// Componente simplificado
export function ReportCanvas() {
  const context = useReportContext();
  // Usa context ao invés de props
}
```

### 3. Implementar Padrões SOLID

#### Single Responsibility
```typescript
// Cada serviço com uma responsabilidade
class FindingsService {
  add(finding: Finding) {}
  remove(findingId: string) {}
  update(findingId: string, data: Partial<Finding>) {}
}

class ReportGenerationService {
  generate(findings: Finding[]): string {}
  format(report: string): string {}
  export(report: string, format: 'pdf' | 'docx') {}
}
```

#### Open/Closed
```typescript
// Interface para extensibilidade
interface AIProvider {
  generate(prompt: string): Promise<string>;
  stream(prompt: string): AsyncGenerator<string>;
  getName(): string;
}

class GeminiProvider implements AIProvider {}
class OpenAIProvider implements AIProvider {}
class ClaudeProvider implements AIProvider {} // Fácil adicionar novos
```

#### Dependency Injection
```typescript
// src/services/DIContainer.ts
class DIContainer {
  private services = new Map();

  register<T>(token: string, factory: () => T) {
    this.services.set(token, factory);
  }

  resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) throw new Error(`Service ${token} not found`);
    return factory();
  }
}

// Uso
container.register('aiService', () => new UnifiedAIService());
const aiService = container.resolve<UnifiedAIService>('aiService');
```

### 4. Criar Abstrações Reutilizáveis

#### Custom Hooks Genéricos
```typescript
// src/hooks/useAsync.ts
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, dependencies);

  return { data, loading, error };
}
```

#### Componentes Compostos
```typescript
// src/components/compound/Form.tsx
interface FormCompound {
  Root: React.FC<FormRootProps>;
  Field: React.FC<FormFieldProps>;
  Submit: React.FC<FormSubmitProps>;
}

const Form: FormCompound = {
  Root: FormRoot,
  Field: FormField,
  Submit: FormSubmit
};

// Uso
<Form.Root onSubmit={handleSubmit}>
  <Form.Field name="size" label="Tamanho" />
  <Form.Submit>Salvar</Form.Submit>
</Form.Root>
```

### 5. Melhorar Tipagem TypeScript

#### Types Utility
```typescript
// src/types/utilities.ts
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

#### Discriminated Unions
```typescript
// src/types/organ.ts
type OrganState =
  | { type: 'normal'; organId: string }
  | { type: 'pathological'; organId: string; findings: Finding[] }
  | { type: 'not_examined'; organId: string };

// Type guards
function isPathological(state: OrganState): state is Extract<OrganState, { type: 'pathological' }> {
  return state.type === 'pathological';
}
```

## Estrutura de Pastas Proposta

```
src/
├── components/           # UI Components
│   ├── atoms/           # Botões, Inputs, etc
│   ├── molecules/       # Combinações simples
│   ├── organisms/       # Componentes complexos
│   └── templates/       # Layouts de página
├── hooks/               # Custom React Hooks
│   ├── useAI.ts
│   ├── useFindings.ts
│   └── useAsync.ts
├── services/            # Business Logic
│   ├── ai/
│   ├── report/
│   └── validation/
├── contexts/            # React Contexts
│   ├── ReportContext.tsx
│   └── UIContext.tsx
├── utils/               # Utility functions
│   ├── formatters.ts
│   └── validators.ts
├── types/               # TypeScript types
│   ├── models/
│   └── utilities.ts
└── constants/           # App constants
    ├── config.ts
    └── messages.ts
```

## Padrões de Código

### Naming Conventions
```typescript
// Components: PascalCase
export function MyComponent() {}

// Hooks: camelCase com 'use' prefix
export function useMyHook() {}

// Services: PascalCase com 'Service' suffix
export class ReportService {}

// Types/Interfaces: PascalCase
export interface UserProfile {}
export type ActionType = 'create' | 'update';

// Constants: UPPER_SNAKE_CASE
export const MAX_FILE_SIZE = 1024;

// Enums: PascalCase com valores UPPER_SNAKE_CASE
export enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}
```

### File Organization
```typescript
// 1. Imports (ordenados)
import React from 'react';                    // React
import { useNavigate } from 'react-router';   // Bibliotecas
import { Button } from '@/components/ui';     // Componentes internos
import { formatDate } from '@/utils';         // Utilidades
import type { User } from '@/types';          // Types

// 2. Types/Interfaces
interface Props {}

// 3. Constants
const DEFAULT_VALUE = '';

// 4. Component/Function
export function Component() {}

// 5. Sub-components (se houver)
function SubComponent() {}

// 6. Exports
export default Component;
```

## Testes

### Estrutura de Testes
```typescript
// src/services/__tests__/reportService.test.ts
describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    service = new ReportService();
  });

  describe('generate', () => {
    it('should generate report with findings', () => {
      // Arrange
      const findings = [mockFinding];

      // Act
      const report = service.generate(findings);

      // Assert
      expect(report).toContain(mockFinding.name);
    });
  });
});
```

## Métricas de Qualidade

### Código
- [ ] Funções < 20 linhas
- [ ] Arquivos < 200 linhas
- [ ] Complexidade ciclomática < 10
- [ ] Cobertura de testes > 80%

### Arquitetura
- [ ] Sem dependências circulares
- [ ] Acoplamento baixo
- [ ] Alta coesão
- [ ] DRY (Don't Repeat Yourself)

## Relatório Esperado

1. **Refatorações Realizadas**:
   - Lista de componentes refatorados
   - Hooks extraídos
   - Services criados
   - Contexts implementados

2. **Métricas Antes/Depois**:
   - Linhas de código por arquivo
   - Complexidade
   - Número de props
   - Cobertura de testes

3. **Diagrama de Arquitetura**:
   - Fluxo de dados
   - Dependências
   - Camadas da aplicação

4. **Documentação**:
   - README atualizado
   - JSDoc em funções complexas
   - Exemplos de uso

## Notas Importantes

- Fazer refatorações incrementais
- Manter funcionalidade idêntica
- Adicionar testes antes de refatorar
- Commitar frequentemente
- Documentar decisões arquiteturais