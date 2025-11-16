import React, { useState } from 'react';
import { CaretDown, Warning, CheckCircle, Info } from '@phosphor-icons/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ResultadoCalculoBiRads, CategoriaBiRads } from '@/types/birads';

export interface BiRadsDisplayProps {
  resultado: ResultadoCalculoBiRads | null;
  isLoading?: boolean;
}

/**
 * Componente que exibe o resultado do cálculo BI-RADS em tempo real
 * Com cores, pontuações e recomendações
 */
export const BiRadsDisplay: React.FC<BiRadsDisplayProps> = ({
  resultado,
  isLoading = false,
}) => {
  const [expandedDetails, setExpandedDetails] = useState(false);

  if (isLoading) {
    return (
      <Card className="border-2 border-muted/20">
        <CardContent className="flex items-center justify-center py-12">
          <div className="space-y-4 text-center">
            <div className="animate-spin">
              <Info size={32} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Calculando BI-RADS...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!resultado) {
    return (
      <Card className="border-2 border-muted/20">
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            Preencha os achados para calcular o BI-RADS
          </p>
        </CardContent>
      </Card>
    );
  }

  // Determinar cores baseadas na categoria
  const getBiRadsColors = (categoria: CategoriaBiRads) => {
    const colorMap: Record<CategoriaBiRads, {
      bg: string;
      border: string;
      text: string;
      badge: string;
      badgeText: string;
    }> = {
      '1': {
        bg: 'bg-blue-50 dark:bg-blue-950',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-900 dark:text-blue-100',
        badge: 'bg-blue-100 dark:bg-blue-900',
        badgeText: 'text-blue-800 dark:text-blue-200',
      },
      '2': {
        bg: 'bg-green-50 dark:bg-green-950',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-900 dark:text-green-100',
        badge: 'bg-green-100 dark:bg-green-900',
        badgeText: 'text-green-800 dark:text-green-200',
      },
      '3': {
        bg: 'bg-yellow-50 dark:bg-yellow-950',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-900 dark:text-yellow-100',
        badge: 'bg-yellow-100 dark:bg-yellow-900',
        badgeText: 'text-yellow-800 dark:text-yellow-200',
      },
      '4A': {
        bg: 'bg-orange-50 dark:bg-orange-950',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-900 dark:text-orange-100',
        badge: 'bg-orange-100 dark:bg-orange-900',
        badgeText: 'text-orange-800 dark:text-orange-200',
      },
      '4B': {
        bg: 'bg-orange-100 dark:bg-orange-900',
        border: 'border-orange-300 dark:border-orange-700',
        text: 'text-orange-900 dark:text-orange-100',
        badge: 'bg-orange-200 dark:bg-orange-800',
        badgeText: 'text-orange-800 dark:text-orange-200',
      },
      '4C': {
        bg: 'bg-orange-200 dark:bg-orange-800',
        border: 'border-orange-400 dark:border-orange-600',
        text: 'text-orange-900 dark:text-orange-100',
        badge: 'bg-orange-300 dark:bg-orange-700',
        badgeText: 'text-orange-900 dark:text-orange-100',
      },
      '5': {
        bg: 'bg-red-50 dark:bg-red-950',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-900 dark:text-red-100',
        badge: 'bg-red-100 dark:bg-red-900',
        badgeText: 'text-red-800 dark:text-red-200',
      },
      '6': {
        bg: 'bg-red-100 dark:bg-red-900',
        border: 'border-red-300 dark:border-red-700',
        text: 'text-red-900 dark:text-red-100',
        badge: 'bg-red-200 dark:bg-red-800',
        badgeText: 'text-red-900 dark:text-red-100',
      },
    };

    return colorMap[categoria] || colorMap['2'];
  };

  const colors = getBiRadsColors(resultado.categoria);

  // Mapeamento de descrições de categorias
  const descricaoCategorias: Record<CategoriaBiRads, string> = {
    '1': 'Negativo',
    '2': 'Benigno',
    '3': 'Provavelmente Benigno',
    '4A': 'Baixa Suspeita',
    '4B': 'Moderada Suspeita',
    '4C': 'Alta Suspeita',
    '5': 'Altamente Suspeito',
    '6': 'Malignidade Comprovada',
  };

  // Ícone baseado no nível de suspeita
  const getIcon = () => {
    switch (resultado.nivelSuspeita) {
      case 'benigno':
        return <CheckCircle size={24} weight="fill" />;
      case 'provavelmente-benigno':
        return <CheckCircle size={24} weight="fill" />;
      case 'suspeito':
        return <Warning size={24} weight="fill" />;
      case 'altamente-suspeito':
        return <Warning size={24} weight="fill" />;
      default:
        return <Info size={24} weight="fill" />;
    }
  };

  return (
    <Card
      className={`border-2 transition-all duration-500 ease-out ${colors.bg} ${colors.border} ${colors.text}`}
    >
      {/* Header com Categoria Principal */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">{getIcon()}</div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  BI-RADS {resultado.categoria}
                </CardTitle>
                <CardDescription className={colors.text}>
                  {descricaoCategorias[resultado.categoria]}
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Badge de Pontuação */}
          <div
            className={`
              px-4 py-3 rounded-lg font-semibold text-center
              transition-all duration-300
              ${colors.badge} ${colors.badgeText}
            `}
          >
            <div className="text-3xl font-bold">{resultado.pontuacaoTotal}</div>
            <div className="text-xs">pontos</div>
          </div>
        </div>
      </CardHeader>

      {/* Recomendação */}
      <CardContent className="space-y-4">
        <div
          className={`
            p-4 rounded-lg border-l-4 transition-all duration-300
            ${colors.badge} border-current
          `}
        >
          <div className={`text-sm font-semibold ${colors.text} mb-1`}>
            Recomendação:
          </div>
          <div className={`text-sm ${colors.text}`}>
            {resultado.recomendacao}
          </div>
        </div>

        {/* Seção Expansível de Detalhes */}
        {resultado.detalhes && resultado.detalhes.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-300 ease-out
                ${colors.badge} hover:opacity-80
                focus:outline-none focus:ring-2 focus:ring-offset-2
              `}
              aria-expanded={expandedDetails}
            >
              <span className={`font-semibold ${colors.badgeText}`}>
                Detalhamento da Pontuação
              </span>
              <CaretDown
                size={20}
                weight="bold"
                className={`
                  transition-transform duration-300 ease-out
                  ${expandedDetails ? 'rotate-180' : ''}
                `}
              />
            </button>

            {/* Itens de Detalhes */}
            {expandedDetails && (
              <div
                className={`
                  space-y-2 pt-2 pl-4 border-l-2 transition-all duration-300 ease-out
                  ${colors.border}
                `}
              >
                {resultado.detalhes.map((detalhe, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-md bg-white/50 dark:bg-black/10
                      hover:bg-white/70 dark:hover:bg-black/20
                      transition-all duration-200 ease-out
                      animate-in fade-in slide-in-from-top-2
                      animation-delay-[${index * 50}ms]
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold text-sm ${colors.text}`}>
                        {detalhe.lexicoNome}
                      </span>
                      <span
                        className={`
                          px-2 py-1 rounded text-xs font-bold
                          ${detalhe.pontos > 0
                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : detalhe.pontos < 0
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                          }
                        `}
                      >
                        {detalhe.pontos > 0 ? '+' : ''}{detalhe.pontos}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {detalhe.valorSelecionado}
                    </div>
                    {detalhe.descricao && (
                      <div className={`text-xs ${colors.text} mt-1 opacity-75`}>
                        {detalhe.descricao}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer com Nível de Suspeita */}
      <CardFooter className="border-t pt-4">
        <div className="w-full flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase ${colors.text}`}>
            Nível de Suspeita
          </span>
          <span className={`text-sm font-bold capitalize ${colors.badgeText}`}>
            {resultado.nivelSuspeita.replace('-', ' ')}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BiRadsDisplay;
