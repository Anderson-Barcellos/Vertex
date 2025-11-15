/**
 * EXEMPLO DE USO DO COMPONENTE LexicoDropdown
 * Demonstra diferentes cenários de uso com as opções pré-configuradas
 */

import React, { useState } from 'react';
import { LexicoDropdown } from './LexicoDropdown';
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
} from './lexicoOpcoes';

/**
 * Componente de exemplo completo mostrando uso em um formulário BI-RADS
 */
export const LexicoDropdownExample: React.FC = () => {
  // Estados para cada campo
  const [forma, setForma] = useState('');
  const [margens, setMargens] = useState('');
  const [orientacao, setOrientacao] = useState('');
  const [features, setFeatures] = useState('');
  const [vascularizacao, setVascularizacao] = useState('');
  const [elastografia, setElastografia] = useState('');
  const [profundidade, setProfundidade] = useState('');
  const [posicao, setPosicao] = useState('');
  const [quadrante, setQuadrante] = useState('');
  const [biradsFinal, setBiradsFinal] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Exemplo de Uso: LexicoDropdown
        </h1>
        <p className="text-muted-foreground">
          Demonstração de componentes dropdown reutilizáveis para léxicos BI-RADS
        </p>
      </div>

      {/* Seção 1: Características Morfológicas */}
      <section className="space-y-4 p-4 rounded-lg border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground">
          Características Morfológicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Forma */}
          <LexicoDropdown
            label="Forma"
            value={forma}
            onChange={setForma}
            options={OPCOES_FORMA}
            placeholder="Selecione a forma..."
            showPoints
            required
          />

          {/* Margens */}
          <LexicoDropdown
            label="Margens"
            value={margens}
            onChange={setMargens}
            options={OPCOES_MARGENS}
            placeholder="Selecione as margens..."
            showPoints
            required
          />

          {/* Orientação */}
          <LexicoDropdown
            label="Orientação"
            value={orientacao}
            onChange={setOrientacao}
            options={OPCOES_ORIENTACAO}
            placeholder="Selecione a orientação..."
            showPoints
          />

          {/* Características Acústicas */}
          <LexicoDropdown
            label="Características Acústicas Posteriores"
            value={features}
            onChange={setFeatures}
            options={OPCOES_FEATURES_ACUSTICAS}
            placeholder="Selecione a característica..."
            showPoints
          />
        </div>
      </section>

      {/* Seção 2: Características Vasculares e Elásticas */}
      <section className="space-y-4 p-4 rounded-lg border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground">
          Características Vasculares e Elásticas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vascularização */}
          <LexicoDropdown
            label="Vascularização"
            value={vascularizacao}
            onChange={setVascularizacao}
            options={OPCOES_VASCULARIZACAO}
            placeholder="Selecione o padrão..."
            showPoints
          />

          {/* Elastografia */}
          <LexicoDropdown
            label="Elastografia"
            value={elastografia}
            onChange={setElastografia}
            options={OPCOES_ELASTOGRAFIA}
            placeholder="Selecione o tipo..."
            showPoints
          />
        </div>
      </section>

      {/* Seção 3: Localização */}
      <section className="space-y-4 p-4 rounded-lg border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground">Localização</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profundidade */}
          <LexicoDropdown
            label="Profundidade"
            value={profundidade}
            onChange={setProfundidade}
            options={OPCOES_PROFUNDIDADE}
            placeholder="Selecione..."
          />

          {/* Posição no Relógio */}
          <LexicoDropdown
            label="Posição no Relógio"
            value={posicao}
            onChange={setPosicao}
            options={OPCOES_POSICAO_RELOGIO}
            placeholder="Selecione..."
          />

          {/* Quadrante */}
          <LexicoDropdown
            label="Quadrante"
            value={quadrante}
            onChange={setQuadrante}
            options={OPCOES_QUADRANTE}
            placeholder="Selecione..."
          />
        </div>
      </section>

      {/* Seção 4: Classificação Final BI-RADS */}
      <section className="space-y-4 p-4 rounded-lg border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground">
          Classificação Final BI-RADS
        </h2>

        <LexicoDropdown
          label="Categoria BI-RADS"
          value={biradsFinal}
          onChange={setBiradsFinal}
          options={OPCOES_BIRADS_CATEGORIA}
          placeholder="Selecione a categoria BI-RADS..."
          showPoints
          required
        />
      </section>

      {/* Resumo dos Valores Selecionados */}
      <section className="space-y-4 p-4 rounded-lg border border-border bg-secondary/20">
        <h2 className="text-xl font-semibold text-foreground">
          Resumo dos Valores Selecionados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {forma && <div>Forma: <strong>{forma}</strong></div>}
          {margens && <div>Margens: <strong>{margens}</strong></div>}
          {orientacao && <div>Orientação: <strong>{orientacao}</strong></div>}
          {features && <div>Features Acústicas: <strong>{features}</strong></div>}
          {vascularizacao && <div>Vascularização: <strong>{vascularizacao}</strong></div>}
          {elastografia && <div>Elastografia: <strong>{elastografia}</strong></div>}
          {profundidade && <div>Profundidade: <strong>{profundidade}</strong></div>}
          {posicao && <div>Posição: <strong>{posicao}h</strong></div>}
          {quadrante && <div>Quadrante: <strong>{quadrante}</strong></div>}
          {biradsFinal && <div>BI-RADS: <strong>{biradsFinal}</strong></div>}
        </div>

        {!forma && !margens && !orientacao && !features && !vascularizacao && !elastografia && !profundidade && !posicao && !quadrante && !biradsFinal && (
          <p className="text-muted-foreground italic">
            Selecione as opções acima para visualizar os valores aqui
          </p>
        )}
      </section>

      {/* Informações de Uso */}
      <section className="space-y-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900">Como Usar</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
          <li>
            <strong>showPoints:</strong> Ativa a exibição dos indicadores de pontos
          </li>
          <li>
            <strong>placeholder:</strong> Define o texto quando nenhuma opção está selecionada
          </li>
          <li>
            <strong>required:</strong> Marca o campo como obrigatório
          </li>
          <li>
            <strong>disabled:</strong> Desabilita o campo
          </li>
          <li>Passe suas opções via prop <code>options</code></li>
          <li>Use <code>onChange</code> para capturar mudanças de estado</li>
        </ul>
      </section>

      {/* Legenda de Cores */}
      <section className="space-y-4 p-4 rounded-lg border border-border bg-card">
        <h3 className="font-semibold text-foreground">Legenda de Cores (Pontuação)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500" />
            <span className="text-sm">Negativo (-1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300" />
            <span className="text-sm">Zero (0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400" />
            <span className="text-sm">Mais Um (+1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-400" />
            <span className="text-sm">Mais Dois (+2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500" />
            <span className="text-sm">Mais Três (+3)</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LexicoDropdownExample;
