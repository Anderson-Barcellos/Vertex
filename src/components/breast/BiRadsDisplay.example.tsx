/**
 * Exemplo de Uso do Componente BiRadsDisplay
 *
 * Este arquivo demonstra como usar o componente de exibição
 * de BI-RADS calculado em tempo real
 */

import { BiRadsDisplay, BiRadsDisplayProps } from './BiRadsDisplay';
import { ResultadoCalculoBiRads } from '@/types/birads';

// ============================================================================
// EXEMPLO 1: BI-RADS 2 (Benigno)
// ============================================================================

export const exemploCategoriaBenigna = (): BiRadsDisplayProps => {
  const resultado: ResultadoCalculoBiRads = {
    categoria: '2',
    pontuacaoTotal: 1,
    nivelSuspeita: 'benigno',
    recomendacao: 'Nenhum acompanhamento necessário. Lesão claramente benigna.',
    detalhes: [
      {
        lexicoNome: 'Forma',
        valorSelecionado: 'Oval',
        pontos: 0,
        descricao: 'Forma oval é característica de lesões benignas',
      },
      {
        lexicoNome: 'Margens',
        valorSelecionado: 'Circunscritas',
        pontos: 0,
        descricao: 'Margens bem definidas indicam benignidade',
      },
      {
        lexicoNome: 'Padrão de Eco',
        valorSelecionado: 'Anecoico',
        pontos: -1,
        descricao: 'Padrão anecoico é altamente específico para cistos simples',
      },
      {
        lexicoNome: 'Características Posteriores',
        valorSelecionado: 'Reforço Acústico',
        pontos: -1,
        descricao: 'Reforço acústico suporta diagnóstico de cisto',
      },
    ],
  };

  return {
    resultado,
    isLoading: false,
  };
};

// ============================================================================
// EXEMPLO 2: BI-RADS 4B (Moderada Suspeita)
// ============================================================================

export const exemploCategoriaSuspeitaModera = (): BiRadsDisplayProps => {
  const resultado: ResultadoCalculoBiRads = {
    categoria: '4B',
    pontuacaoTotal: 7,
    nivelSuspeita: 'suspeito',
    recomendacao: 'Biopsia recomendada. Nódulo apresenta características suspeitas.',
    detalhes: [
      {
        lexicoNome: 'Forma',
        valorSelecionado: 'Irregular',
        pontos: 1,
        descricao: 'Forma irregular aumenta suspeita de malignidade',
      },
      {
        lexicoNome: 'Orientação',
        valorSelecionado: 'Não-Paralela',
        pontos: 1,
        descricao: 'Orientação não-paralela é suspeita',
      },
      {
        lexicoNome: 'Margens',
        valorSelecionado: 'Espiculadas',
        pontos: 3,
        descricao: 'Margens espiculadas são altamente suspeitas',
      },
      {
        lexicoNome: 'Padrão de Eco',
        valorSelecionado: 'Hipoecoico',
        pontos: 1,
        descricao: 'Padrão hipoecoico pode indicar malignidade',
      },
      {
        lexicoNome: 'Características Posteriores',
        valorSelecionado: 'Sombra Acústica',
        pontos: 2,
        descricao: 'Sombra acústica é achado suspeito',
      },
      {
        lexicoNome: 'Calcificações',
        valorSelecionado: 'Microcalcificações',
        pontos: 2,
        descricao: 'Microcalcificações sugerem malignidade',
      },
      {
        lexicoNome: 'Vascularização',
        valorSelecionado: 'Acentuada',
        pontos: 2,
        descricao: 'Vascularização acentuada central é suspeita',
      },
    ],
  };

  return {
    resultado,
    isLoading: false,
  };
};

// ============================================================================
// EXEMPLO 3: BI-RADS 5 (Altamente Suspeito)
// ============================================================================

export const exemploAltoSuspeita = (): BiRadsDisplayProps => {
  const resultado: ResultadoCalculoBiRads = {
    categoria: '5',
    pontuacaoTotal: 15,
    nivelSuspeita: 'altamente-suspeito',
    recomendacao: 'Achado altamente sugestivo de malignidade. Biopsia urgente e tratamento oncológico recomendado.',
    detalhes: [
      {
        lexicoNome: 'Forma',
        valorSelecionado: 'Irregular',
        pontos: 1,
        descricao: 'Forma altamente irregular',
      },
      {
        lexicoNome: 'Margens',
        valorSelecionado: 'Espiculadas',
        pontos: 3,
        descricao: 'Margens francamente espiculadas',
      },
      {
        lexicoNome: 'Padrão de Eco',
        valorSelecionado: 'Hipoecoico',
        pontos: 1,
        descricao: 'Padrão claramente hipoecoico',
      },
      {
        lexicoNome: 'Características Posteriores',
        valorSelecionado: 'Sombra Acústica',
        pontos: 2,
        descricao: 'Sombra acústica proeminente',
      },
      {
        lexicoNome: 'Calcificações',
        valorSelecionado: 'Microcalcificações',
        pontos: 2,
        descricao: 'Microcalcificações pleomórficas',
      },
      {
        lexicoNome: 'Vascularização',
        valorSelecionado: 'Acentuada',
        pontos: 2,
        descricao: 'Vascularização central penetrante',
      },
      {
        lexicoNome: 'Tamanho',
        valorSelecionado: '> 3 cm',
        pontos: 4,
        descricao: 'Lesão de grande tamanho',
      },
    ],
  };

  return {
    resultado,
    isLoading: false,
  };
};

// ============================================================================
// EXEMPLO 4: Estado de Carregamento
// ============================================================================

export const exemploCarregamento = (): BiRadsDisplayProps => {
  return {
    resultado: null,
    isLoading: true,
  };
};

// ============================================================================
// EXEMPLO 5: Sem Dados
// ============================================================================

export const exemploSemDados = (): BiRadsDisplayProps => {
  return {
    resultado: null,
    isLoading: false,
  };
};

// ============================================================================
// COMPONENTE DE DEMONSTRAÇÃO
// ============================================================================

/**
 * Componente de demonstração que mostra todos os exemplos
 */
export function BiRadsDisplayDemo() {
  return (
    <div className="space-y-8 p-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-4">BI-RADS Benigno (2)</h2>
        <BiRadsDisplay {...exemploCategoriaBenigna()} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">BI-RADS Moderada Suspeita (4B)</h2>
        <BiRadsDisplay {...exemploCategoriaSuspeitaModera()} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">BI-RADS Altamente Suspeito (5)</h2>
        <BiRadsDisplay {...exemploAltoSuspeita()} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Estado de Carregamento</h2>
        <BiRadsDisplay {...exemploCarregamento()} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sem Dados</h2>
        <BiRadsDisplay {...exemploSemDados()} />
      </div>
    </div>
  );
}
