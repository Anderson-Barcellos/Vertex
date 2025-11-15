# Componentes de Mama (Breast)

Componentes especializados para exames ultrassonográficos de mama com suporte completo a léxicos BI-RADS 5th Edition.

## Componentes

### BiRadsDisplay

Componente que exibe o resultado do cálculo BI-RADS em tempo real com visualização colorida baseada na categoria.

#### Características

- **Cores Dinâmicas**: Fundo colorido baseado na categoria BI-RADS (2=Verde, 3=Amarelo, 4A=Laranja claro, 4B=Laranja, 4C=Laranja escuro, 5=Vermelho)
- **Categoria em Destaque**: Exibição prominente da categoria com ícone apropriado
- **Pontuação Visível**: Badge com pontuação total em posição destacada
- **Detalhes Expansíveis**: Lista de pontuação por léxico com accordion interativo
- **Recomendação Clínica**: Texto de recomendação contextualizado à categoria
- **Nível de Suspeita**: Classificação do nível de suspeita (benigno/provavelmente-benigno/suspeito/altamente-suspeito)
- **Animações Suaves**: Transições CSS para mudança de estado
- **Estado de Carregamento**: Indicador visual durante cálculo
- **Design Responsivo**: Funciona em diferentes tamanhos de tela
- **Dark Mode**: Suporte completo a tema escuro

#### Props

```typescript
interface BiRadsDisplayProps {
  resultado: ResultadoCalculoBiRads | null;  // Resultado do cálculo
  isLoading?: boolean;                        // Estado de carregamento (default: false)
}
```

#### Interface ResultadoCalculoBiRads

```typescript
interface ResultadoCalculoBiRads {
  categoria: CategoriaBiRads;                     // '1' | '2' | '3' | '4A' | '4B' | '4C' | '5' | '6'
  pontuacaoTotal: number;                         // Soma de todos os pontos
  detalhes: DetalhePontuacao[];                   // Detalhamento por léxico
  recomendacao: string;                           // Texto de recomendação
  nivelSuspeita: 'benigno' | 'provavelmente-benigno' | 'suspeito' | 'altamente-suspeito';
}

interface DetalhePontuacao {
  lexicoNome: string;          // Nome do léxico (ex: "Forma", "Margens")
  valorSelecionado: string;    // Valor escolhido (ex: "Oval", "Irregular")
  pontos: number;              // Pontuação (-1 a +3)
  descricao: string;           // Descrição detalhada
}
```

#### Cores por Categoria

| Categoria | Nível | Cor | Fundo |
|-----------|-------|-----|-------|
| 1 | Negativo | Azul | bg-blue-50 |
| 2 | Benigno | Verde | bg-green-50 |
| 3 | Provavelmente Benigno | Amarelo | bg-yellow-50 |
| 4A | Baixa Suspeita | Laranja Claro | bg-orange-50 |
| 4B | Moderada Suspeita | Laranja | bg-orange-100 |
| 4C | Alta Suspeita | Laranja Escuro | bg-orange-200 |
| 5 | Altamente Suspeito | Vermelho | bg-red-50 |
| 6 | Malignidade Comprovada | Vermelho Forte | bg-red-100 |

#### Exemplos de Uso

##### Exemplo Básico

```tsx
import { BiRadsDisplay } from '@/components/breast/BiRadsDisplay';
import { ResultadoCalculoBiRads } from '@/types/birads';

export function MyComponent() {
  const resultado: ResultadoCalculoBiRads = {
    categoria: '2',
    pontuacaoTotal: 1,
    nivelSuspeita: 'benigno',
    recomendacao: 'Nenhum acompanhamento necessário.',
    detalhes: [
      {
        lexicoNome: 'Forma',
        valorSelecionado: 'Oval',
        pontos: 0,
        descricao: 'Forma oval é característica de lesões benignas'
      }
    ]
  };

  return <BiRadsDisplay resultado={resultado} />;
}
```

##### Exemplo com Carregamento

```tsx
import { BiRadsDisplay } from '@/components/breast/BiRadsDisplay';

export function LoadingExample() {
  const [resultado, setResultado] = useState<ResultadoCalculoBiRads | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular cálculo
    setTimeout(() => {
      setResultado({
        categoria: '4B',
        pontuacaoTotal: 7,
        nivelSuspeita: 'suspeito',
        recomendacao: 'Biopsia recomendada',
        detalhes: []
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  return <BiRadsDisplay resultado={resultado} isLoading={isLoading} />;
}
```

##### Integração com Calculadora BI-RADS

```tsx
import { BiRadsDisplay } from '@/components/breast/BiRadsDisplay';
import { calcularBiRads } from '@/services/biradsCalculator';

export function ExamWithCalculator() {
  const [achados, setAchados] = useState({/* ... */});
  const [resultado, setResultado] = useState<ResultadoCalculoBiRads | null>(null);

  useEffect(() => {
    if (achados.completo) {
      const result = calcularBiRads(achados);
      setResultado(result);
    }
  }, [achados]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        {/* Formulário com LexicoDropdown */}
      </div>
      <div>
        <BiRadsDisplay resultado={resultado} />
      </div>
    </div>
  );
}
```

### LexicoDropdown

Componente dropdown reutilizável para seleção de opções BI-RADS com pontuação e descrições.

#### Características

- **Pontuação Visual**: Indicadores coloridos para cada opção (-1, 0, +1, +2, +3)
- **Tooltips Descritivos**: Descrições detalhadas ao hoverar
- **Design Moderno**: Integração com Tailwind CSS e Radix UI
- **TypeScript Completo**: Tipos totalmente definidos
- **Acessível**: Suporte a ARIA labels e navegação por teclado
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

#### Props

```typescript
interface LexicoDropdownProps {
  label: string;                           // Rótulo do campo
  value: string;                           // Valor selecionado
  onChange: (value: string) => void;       // Callback de mudança
  options: OpcaoLexicoComPontuacao[];      // Array de opções
  placeholder?: string;                    // Texto inicial (default: 'Selecione uma opção...')
  showPoints?: boolean;                    // Exibir indicadores de pontos (default: false)
  disabled?: boolean;                      // Desabilitar campo (default: false)
  required?: boolean;                      // Marcar como obrigatório (default: false)
}
```

#### Interface OpcaoLexicoComPontuacao

```typescript
interface OpcaoLexicoComPontuacao {
  id: string;              // Identificador único
  label: string;           // Texto exibido
  valor: string;           // Valor interno
  pontos?: number;         // -1 (negativo), 0, 1, 2, 3
  descricao?: string;      // Descrição detalhada
}
```

#### Codificação de Pontos

| Pontos | Cor | Significado |
|--------|-----|-------------|
| -1 | Verde | Achado benigno |
| 0 | Cinza | Neutro ou variável |
| +1 | Amarelo | Baixo risco |
| +2 | Laranja | Risco moderado |
| +3 | Vermelho | Alto risco |

#### Exemplos de Uso

##### Exemplo Básico

```tsx
import { LexicoDropdown } from '@/components/breast/LexicoDropdown';
import { OPCOES_FORMA } from '@/components/breast/lexicoOpcoes';

export function MyComponent() {
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

##### Exemplo com Validação

```tsx
import { LexicoDropdown } from '@/components/breast/LexicoDropdown';
import { OPCOES_MARGENS } from '@/components/breast/lexicoOpcoes';

export function FormWithValidation() {
  const [margens, setMargens] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!margens) {
      newErrors.push('Margens é obrigatório');
    }

    setErrors(newErrors);
    if (newErrors.length === 0) {
      // Enviar formulário
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LexicoDropdown
        label="Margens"
        value={margens}
        onChange={setMargens}
        options={OPCOES_MARGENS}
        showPoints
        required
      />
      {errors.includes('Margens é obrigatório') && (
        <p className="text-red-500 text-sm mt-1">Este campo é obrigatório</p>
      )}
    </form>
  );
}
```

##### Exemplo Completo de Formulário BI-RADS

```tsx
import { useState } from 'react';
import { LexicoDropdown } from '@/components/breast/LexicoDropdown';
import {
  OPCOES_FORMA,
  OPCOES_MARGENS,
  OPCOES_ORIENTACAO,
  OPCOES_FEATURES_ACUSTICAS,
  OPCOES_VASCULARIZACAO,
  OPCOES_ELASTOGRAFIA,
  OPCOES_BIRADS_CATEGORIA,
} from '@/components/breast/lexicoOpcoes';

export function BiRadsForm() {
  const [forma, setForma] = useState('');
  const [margens, setMargens] = useState('');
  const [orientacao, setOrientacao] = useState('');
  const [features, setFeatures] = useState('');
  const [vascularizacao, setVascularizacao] = useState('');
  const [elastografia, setElastografia] = useState('');
  const [biradsFinal, setBiradsFinal] = useState('');

  const handleSubmit = () => {
    const formData = {
      forma,
      margens,
      orientacao,
      features,
      vascularizacao,
      elastografia,
      biradsFinal,
    };
    console.log('Dados do formulário:', formData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <LexicoDropdown
          label="Forma"
          value={forma}
          onChange={setForma}
          options={OPCOES_FORMA}
          showPoints
        />

        <LexicoDropdown
          label="Margens"
          value={margens}
          onChange={setMargens}
          options={OPCOES_MARGENS}
          showPoints
        />

        <LexicoDropdown
          label="Orientação"
          value={orientacao}
          onChange={setOrientacao}
          options={OPCOES_ORIENTACAO}
          showPoints
        />

        <LexicoDropdown
          label="Features Acústicas"
          value={features}
          onChange={setFeatures}
          options={OPCOES_FEATURES_ACUSTICAS}
          showPoints
        />

        <LexicoDropdown
          label="Vascularização"
          value={vascularizacao}
          onChange={setVascularizacao}
          options={OPCOES_VASCULARIZACAO}
          showPoints
        />

        <LexicoDropdown
          label="Elastografia"
          value={elastografia}
          onChange={setElastografia}
          options={OPCOES_ELASTOGRAFIA}
          showPoints
        />
      </div>

      <LexicoDropdown
        label="Categoria BI-RADS Final"
        value={biradsFinal}
        onChange={setBiradsFinal}
        options={OPCOES_BIRADS_CATEGORIA}
        showPoints
        required
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Enviar
      </button>
    </div>
  );
}
```

## Opções Pré-configuradas

O arquivo `lexicoOpcoes.ts` fornece opções pré-configuradas baseadas nas diretrizes BI-RADS 5th Edition:

### Disponíveis

- `OPCOES_FORMA` - Formas de lesão (oval, redonda, irregular)
- `OPCOES_MARGENS` - Tipos de margens (circunscritas, indistintas, microlobuladas, espiculadas)
- `OPCOES_ORIENTACAO` - Orientação da lesão (paralela, não paralela)
- `OPCOES_FEATURES_ACUSTICAS` - Características posteriores (sem alterações, reforço, sombra)
- `OPCOES_COMPOSICAO` - Composição (anecoica, hiperecogênica, complexa, sólida)
- `OPCOES_VASCULARIZACAO` - Padrão vascular (ausente, periférica, central, mista)
- `OPCOES_PADRAO_VASCULAR` - Tipo de padrão (penetrante, radiado)
- `OPCOES_ELASTOGRAFIA` - Tipos de elastografia (1-4)
- `OPCOES_PROFUNDIDADE` - Profundidade da lesão
- `OPCOES_POSICAO_RELOGIO` - Posição em horas (12-11)
- `OPCOES_QUADRANTE` - Quadrante mamário (QSE, QSI, QIE, QII, retroareolar)
- `OPCOES_BIRADS_CATEGORIA` - Categorias BI-RADS finais (0-6)

## Cores e Pontuação

### Sistema de Cores

```
Verde (#22c55e)   = Benigno / Negativo (-1)
Cinza (#d1d5db)   = Neutro (0)
Amarelo (#facc15) = Baixo risco (+1)
Laranja (#fb923c) = Risco moderado (+2)
Vermelho (#ef4444) = Alto risco / Maligno (+3)
```

### Interpretação

- **-1 (Verde)**: Achados claramente benignos
- **0 (Cinza)**: Achados neutros ou variáveis
- **+1 (Amarelo)**: Achados sugestivos de malignidade leve
- **+2 (Laranja)**: Achados sugestivos de malignidade moderada
- **+3 (Vermelho)**: Achados altamente sugestivos de malignidade

## Integração

### Com Radix UI

O componente usa a biblioteca Radix UI para componentes acessíveis:

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
```

### Com Tailwind CSS

Completamente estilizado com Tailwind CSS v4:

```tsx
className="rounded-lg border border-border bg-background text-foreground"
```

### Com TypeScript

Tipos completos inclusos:

```typescript
import { LexicoDropdown, OpcaoLexicoComPontuacao } from '@/components/breast/LexicoDropdown';
```

## Acessibilidade

- Suporte completo a ARIA labels
- Navegação por teclado (Tab, Enter, Espaço, Setas)
- Contraste adequado entre cores e fundos
- Descrições semânticas para cada opção
- Compatível com leitores de tela

## Performance

- Renderização otimizada com React
- Sem re-renders desnecessários
- Memoização de callbacks onde apropriado
- Suporte a lazy loading de opções

## Documentação Adicional

Para mais informações sobre BI-RADS, consulte:
- BI-RADS 5th Edition - Breast Imaging Reporting and Data System
- Documentação do projeto em `/home/user/Vertex/CLAUDE.md`
- Arquivo de diretrizes em `/home/user/Vertex/DIRETRIZES_EXAMES.md`

## Arquivo de Exemplo

Um exemplo completo de uso está disponível em:
`/home/user/Vertex/src/components/breast/LexicoDropdown.example.tsx`

Para visualizar o exemplo no navegador, importe e use o componente `LexicoDropdownExample`.

---

**Última Atualização:** 15 de Novembro de 2025
**Versão:** 1.0.0
**Mantido por:** Vertex Team
