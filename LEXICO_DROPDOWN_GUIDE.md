# Guia Rápido: LexicoDropdown

Componente de dropdown reutilizável para léxicos BI-RADS - criado em 15/11/2025.

## Localização

```
/home/user/Vertex/src/components/breast/LexicoDropdown.tsx
```

## Arquivos Criados

1. **LexicoDropdown.tsx** - Componente principal (207 linhas)
2. **lexicoOpcoes.ts** - Opções pré-configuradas (372 linhas)
3. **LexicoDropdown.example.tsx** - Exemplo completo (257 linhas)
4. **README.md** - Documentação detalhada (9KB)
5. **index.ts** - Arquivo de exports atualizado

## Importação

### Básico
```typescript
import { LexicoDropdown, OPCOES_FORMA } from '@/components/breast';
```

### Completo com Tipos
```typescript
import {
  LexicoDropdown,
  OpcaoLexicoComPontuacao,
  OPCOES_FORMA,
  OPCOES_MARGENS,
  OPCOES_ORIENTACAO,
  OPCOES_FEATURES_ACUSTICAS,
  OPCOES_VASCULARIZACAO,
  OPCOES_ELASTOGRAFIA,
  OPCOES_PROFUNDIDADE,
  OPCOES_POSICAO_RELOGIO,
  OPCOES_QUADRANTE,
  OPCOES_BIRADS_CATEGORIA
} from '@/components/breast';
```

## Uso Básico

```tsx
import { useState } from 'react';
import { LexicoDropdown, OPCOES_FORMA } from '@/components/breast';

export function MinhaFormulario() {
  const [forma, setForma] = useState('');

  return (
    <LexicoDropdown
      label="Forma"
      value={forma}
      onChange={setForma}
      options={OPCOES_FORMA}
      showPoints
    />
  );
}
```

## Propriedades

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | string | - | Rótulo do campo (obrigatório) |
| `value` | string | - | Valor selecionado (obrigatório) |
| `onChange` | function | - | Callback ao mudar (obrigatório) |
| `options` | array | - | Array de opções (obrigatório) |
| `placeholder` | string | 'Selecione uma opção...' | Texto inicial |
| `showPoints` | boolean | false | Mostrar indicadores de pontos |
| `disabled` | boolean | false | Desabilitar campo |
| `required` | boolean | false | Marcar como obrigatório |

## Opções Disponíveis

### Forma
```typescript
OPCOES_FORMA
// Valores: 'oval' (-1), 'redonda' (0), 'irregular' (+3)
```

### Margens
```typescript
OPCOES_MARGENS
// Valores: 'circunscritas' (-1), 'indistintas' (+1), 'microlobuladas' (+2), 'espiculadas' (+3)
```

### Orientação
```typescript
OPCOES_ORIENTACAO
// Valores: 'paralela' (-1), 'nao-paralela' (+3)
```

### Características Acústicas
```typescript
OPCOES_FEATURES_ACUSTICAS
// Valores: 'sem-alteracoes' (-1), 'reforco' (0), 'sombra' (+2)
```

### Vascularização
```typescript
OPCOES_VASCULARIZACAO
// Valores: 'ausente' (-1), 'periferica' (0), 'central' (+2), 'mista' (+2)
```

### Elastografia
```typescript
OPCOES_ELASTOGRAFIA
// Valores: 'tipo-1' (-1), 'tipo-2' (0), 'tipo-3' (+1), 'tipo-4' (+3)
```

### Profundidade
```typescript
OPCOES_PROFUNDIDADE
// Valores: 'superficial', 'intermediaria', 'profunda' (todos 0 pontos)
```

### Posição no Relógio
```typescript
OPCOES_POSICAO_RELOGIO
// Valores: '1' a '12'
```

### Quadrante
```typescript
OPCOES_QUADRANTE
// Valores: 'qse', 'qsi', 'qie', 'qii', 'retroareolar'
```

### Categoria BI-RADS
```typescript
OPCOES_BIRADS_CATEGORIA
// Valores: 'birads-0' a 'birads-6' com pontos
```

## Sistema de Cores

| Pontos | Cor | Classe Tailwind |
|--------|-----|-----------------|
| -1 | Verde | bg-green-500 |
| 0 | Cinza | bg-gray-300 |
| +1 | Amarelo | bg-yellow-400 |
| +2 | Laranja | bg-orange-400 |
| +3 | Vermelho | bg-red-500 |

## Exemplos Completos

### Exemplo 1: Formulário Simples
```tsx
import { useState } from 'react';
import { LexicoDropdown, OPCOES_FORMA, OPCOES_MARGENS } from '@/components/breast';

export function SimpleForm() {
  const [forma, setForma] = useState('');
  const [margens, setMargens] = useState('');

  return (
    <div className="space-y-4">
      <LexicoDropdown
        label="Forma da Lesão"
        value={forma}
        onChange={setForma}
        options={OPCOES_FORMA}
        showPoints
        required
      />

      <LexicoDropdown
        label="Margens"
        value={margens}
        onChange={setMargens}
        options={OPCOES_MARGENS}
        showPoints
        required
      />
    </div>
  );
}
```

### Exemplo 2: Com Validação
```tsx
import { useState } from 'react';
import { LexicoDropdown, OPCOES_FORMA } from '@/components/breast';

export function FormWithValidation() {
  const [forma, setForma] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!forma) {
      setError('Forma é obrigatória');
      return;
    }
    setError('');
    console.log('Formulário enviado com forma:', forma);
  };

  return (
    <div>
      <LexicoDropdown
        label="Forma"
        value={forma}
        onChange={setForma}
        options={OPCOES_FORMA}
        showPoints
        required
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Enviar
      </button>
    </div>
  );
}
```

### Exemplo 3: Formulário Completo BI-RADS
```tsx
import { useState } from 'react';
import { LexicoDropdown } from '@/components/breast';
import {
  OPCOES_FORMA,
  OPCOES_MARGENS,
  OPCOES_ORIENTACAO,
  OPCOES_FEATURES_ACUSTICAS,
  OPCOES_VASCULARIZACAO,
  OPCOES_ELASTOGRAFIA,
  OPCOES_PROFUNDIDADE,
  OPCOES_POSICAO_RELOGIO,
  OPCOES_QUADRANTE,
  OPCOES_BIRADS_CATEGORIA,
} from '@/components/breast';

export function CompleteFormulario() {
  const [form, setForm] = useState({
    forma: '',
    margens: '',
    orientacao: '',
    features: '',
    vascularizacao: '',
    elastografia: '',
    profundidade: '',
    posicao: '',
    quadrante: '',
    biradsFinal: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LexicoDropdown
        label="Forma"
        value={form.forma}
        onChange={(v) => handleChange('forma', v)}
        options={OPCOES_FORMA}
        showPoints
      />

      <LexicoDropdown
        label="Margens"
        value={form.margens}
        onChange={(v) => handleChange('margens', v)}
        options={OPCOES_MARGENS}
        showPoints
      />

      <LexicoDropdown
        label="Orientação"
        value={form.orientacao}
        onChange={(v) => handleChange('orientacao', v)}
        options={OPCOES_ORIENTACAO}
        showPoints
      />

      <LexicoDropdown
        label="Features Acústicas"
        value={form.features}
        onChange={(v) => handleChange('features', v)}
        options={OPCOES_FEATURES_ACUSTICAS}
        showPoints
      />

      <LexicoDropdown
        label="Vascularização"
        value={form.vascularizacao}
        onChange={(v) => handleChange('vascularizacao', v)}
        options={OPCOES_VASCULARIZACAO}
        showPoints
      />

      <LexicoDropdown
        label="Elastografia"
        value={form.elastografia}
        onChange={(v) => handleChange('elastografia', v)}
        options={OPCOES_ELASTOGRAFIA}
        showPoints
      />

      <LexicoDropdown
        label="Profundidade"
        value={form.profundidade}
        onChange={(v) => handleChange('profundidade', v)}
        options={OPCOES_PROFUNDIDADE}
      />

      <LexicoDropdown
        label="Posição no Relógio"
        value={form.posicao}
        onChange={(v) => handleChange('posicao', v)}
        options={OPCOES_POSICAO_RELOGIO}
      />

      <LexicoDropdown
        label="Quadrante"
        value={form.quadrante}
        onChange={(v) => handleChange('quadrante', v)}
        options={OPCOES_QUADRANTE}
      />

      <LexicoDropdown
        label="Categoria BI-RADS Final"
        value={form.biradsFinal}
        onChange={(v) => handleChange('biradsFinal', v)}
        options={OPCOES_BIRADS_CATEGORIA}
        showPoints
        required
      />
    </div>
  );
}
```

## Opções Customizadas

Você pode criar suas próprias opções passando um array com a interface `OpcaoLexicoComPontuacao`:

```typescript
import { LexicoDropdown, OpcaoLexicoComPontuacao } from '@/components/breast';

const MINHAS_OPCOES: OpcaoLexicoComPontuacao[] = [
  {
    id: 'opcao-1',
    label: 'Opção 1',
    valor: 'valor1',
    pontos: -1,
    descricao: 'Descrição da opção 1',
  },
  {
    id: 'opcao-2',
    label: 'Opção 2',
    valor: 'valor2',
    pontos: 2,
    descricao: 'Descrição da opção 2',
  },
];

export function MinhaFormulario() {
  const [valor, setValor] = useState('');

  return (
    <LexicoDropdown
      label="Meu Campo"
      value={valor}
      onChange={setValor}
      options={MINHAS_OPCOES}
      showPoints
    />
  );
}
```

## Características

✓ TypeScript completo
✓ Integração com Radix UI Select
✓ Sistema de cores e pontuação
✓ Descrições detalhadas em tooltip
✓ Design moderno com Tailwind CSS
✓ Acessibilidade ARIA completa
✓ Responsivo e mobile-friendly
✓ Suporte a dark mode
✓ Validação de campos obrigatórios
✓ Props opcionais e bem documentadas

## Referências

- Componente: `/home/user/Vertex/src/components/breast/LexicoDropdown.tsx`
- Opções: `/home/user/Vertex/src/components/breast/lexicoOpcoes.ts`
- Exemplo Completo: `/home/user/Vertex/src/components/breast/LexicoDropdown.example.tsx`
- Documentação Detalhada: `/home/user/Vertex/src/components/breast/README.md`

## Dúvidas?

Consulte os arquivos de exemplo ou a documentação detalhada no README.md.

---

**Criado em:** 15 de Novembro de 2025
**Versão:** 1.0.0
**Autor:** Claude Code
**Projeto:** Vertex US V2 - Sistema de Laudos Ultrassonográficos
