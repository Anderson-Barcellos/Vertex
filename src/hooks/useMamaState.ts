import { useState, useCallback } from 'react';
import type { LesaoMamaria, EstadoExameMama } from '@/types/birads';

/**
 * React hook para gerenciar estado de exame de mama
 *
 * Fornece gerenciamento centralizado de estado para exames mamários,
 * incluindo dados de ambas as mamas (direita e esquerda) e seus
 * linfonodos regionais correspondentes.
 *
 * @example
 * ```tsx
 * function MamaExamPage() {
 *   const {
 *     mamaDireita,
 *     mamaEsquerda,
 *     linfonodoDireito,
 *     linfonodoEsquerdo,
 *     updateMamaDireita,
 *     updateMamaEsquerda,
 *     setLinfonodoDireito,
 *     setLinfonodoEsquerdo,
 *     resetState
 *   } = useMamaState();
 *
 *   const handleMamaDireitaChange = (lesao: LesaoMamaria) => {
 *     updateMamaDireita(lesao);
 *   };
 *
 *   return (
 *     <div>
 *       <MamaPanel side="direita" lesao={mamaDireita} onUpdate={updateMamaDireita} />
 *       <MamaPanel side="esquerda" lesao={mamaEsquerda} onUpdate={updateMamaEsquerda} />
 *       <button onClick={resetState}>Limpar Exame</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {Object} Objeto contendo:
 *   - `mamaDireita`: Estado atual da mama direita
 *   - `mamaEsquerda`: Estado atual da mama esquerda
 *   - `linfonodoDireito`: Estado do linfonodo direito ('normal' ou 'alterado')
 *   - `linfonodoEsquerdo`: Estado do linfonodo esquerdo ('normal' ou 'alterado')
 *   - `updateMamaDireita`: Função para atualizar mama direita
 *   - `updateMamaEsquerda`: Função para atualizar mama esquerda
 *   - `setLinfonodoDireito`: Função para atualizar estado do linfonodo direito
 *   - `setLinfonodoEsquerdo`: Função para atualizar estado do linfonodo esquerdo
 *   - `resetState`: Função para resetar todos os estados para valores iniciais
 *
 * @public
 */
export function useMamaState() {
  /**
   * Estado da mama direita
   * Inicializado com tipo 'normal' (sem alterações)
   *
   * @type {[LesaoMamaria, Function]}
   */
  const [mamaDireita, setMamaDireita] = useState<LesaoMamaria>({
    lado: 'direita',
    tipo: 'normal'
  });

  /**
   * Estado da mama esquerda
   * Inicializado com tipo 'normal' (sem alterações)
   *
   * @type {[LesaoMamaria, Function]}
   */
  const [mamaEsquerda, setMamaEsquerda] = useState<LesaoMamaria>({
    lado: 'esquerda',
    tipo: 'normal'
  });

  /**
   * Estado do linfonodo regional direito
   * Valores possíveis: 'normal' ou 'alterado'
   *
   * @type {['normal' | 'alterado', Function]}
   */
  const [linfonodoDireito, setLinfonodoDireito] = useState<'normal' | 'alterado'>(
    'normal'
  );

  /**
   * Estado do linfonodo regional esquerdo
   * Valores possíveis: 'normal' ou 'alterado'
   *
   * @type {['normal' | 'alterado', Function]}
   */
  const [linfonodoEsquerdo, setLinfonodoEsquerdo] = useState<'normal' | 'alterado'>(
    'normal'
  );

  /**
   * Atualiza o estado da mama direita
   *
   * Função memoizada que previne re-renders desnecessários
   * em componentes filhos que recebem esta função como prop.
   *
   * @param {LesaoMamaria} lesao - Novo estado da lesão mamária direita
   *
   * @example
   * ```tsx
   * updateMamaDireita({
   *   lado: 'direita',
   *   tipo: 'nodulo',
   *   tamanho: '1.5 x 1.2 cm',
   *   localizacao: 'QSE',
   *   forma: 'oval',
   *   margens: 'circunscritas',
   *   padraoEco: 'hipoecoico'
   * });
   * ```
   *
   * @callback
   */
  const updateMamaDireita = useCallback((lesao: LesaoMamaria) => {
    setMamaDireita(lesao);
  }, []);

  /**
   * Atualiza o estado da mama esquerda
   *
   * Função memoizada que previne re-renders desnecessários
   * em componentes filhos que recebem esta função como prop.
   *
   * @param {LesaoMamaria} lesao - Novo estado da lesão mamária esquerda
   *
   * @example
   * ```tsx
   * updateMamaEsquerda({
   *   lado: 'esquerda',
   *   tipo: 'cisto',
   *   tamanho: '0.8 x 0.7 cm',
   *   localizacao: 'QIE',
   *   padraoEco: 'anecoico'
   * });
   * ```
   *
   * @callback
   */
  const updateMamaEsquerda = useCallback((lesao: LesaoMamaria) => {
    setMamaEsquerda(lesao);
  }, []);

  /**
   * Reseta todos os estados para seus valores iniciais
   *
   * Volta ambas as mamas para o estado 'normal' e linfonodos
   * para 'normal'. Útil para limpar o formulário ou iniciar
   * um novo exame.
   *
   * @example
   * ```tsx
   * // Ao clicar em "Novo Exame"
   * <button onClick={resetState}>Novo Exame</button>
   * ```
   *
   * @callback
   */
  const resetState = useCallback(() => {
    setMamaDireita({ lado: 'direita', tipo: 'normal' });
    setMamaEsquerda({ lado: 'esquerda', tipo: 'normal' });
    setLinfonodoDireito('normal');
    setLinfonodoEsquerdo('normal');
  }, []);

  /**
   * Objeto de retorno contendo todos os estados e funções
   *
   * @type {Object}
   * @property {LesaoMamaria} mamaDireita - Estado atual da mama direita
   * @property {LesaoMamaria} mamaEsquerda - Estado atual da mama esquerda
   * @property {'normal' | 'alterado'} linfonodoDireito - Estado do linfonodo direito
   * @property {'normal' | 'alterado'} linfonodoEsquerdo - Estado do linfonodo esquerdo
   * @property {Function} updateMamaDireita - Atualiza mama direita
   * @property {Function} updateMamaEsquerda - Atualiza mama esquerda
   * @property {Function} setLinfonodoDireito - Atualiza linfonodo direito
   * @property {Function} setLinfonodoEsquerdo - Atualiza linfonodo esquerdo
   * @property {Function} resetState - Reseta todos os estados para inicial
   */
  return {
    mamaDireita,
    mamaEsquerda,
    linfonodoDireito,
    linfonodoEsquerdo,
    updateMamaDireita,
    updateMamaEsquerda,
    setLinfonodoDireito,
    setLinfonodoEsquerdo,
    resetState
  };
}

/**
 * Tipo exportado para facilitar type hints em componentes que usam o hook
 *
 * @example
 * ```tsx
 * import type { UseMamaStateReturn } from '@/hooks/useMamaState';
 *
 * interface MamaPanelProps {
 *   state: UseMamaStateReturn;
 * }
 * ```
 */
export type UseMamaStateReturn = ReturnType<typeof useMamaState>;
