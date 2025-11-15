import { LesaoMamaria, Lado } from '@/types/birads';
import { LexicoDropdown } from './LexicoDropdown';
import { BiRadsDisplay } from './BiRadsDisplay';
import {
  OPCOES_FORMA, OPCOES_ORIENTACAO, OPCOES_MARGENS,
  OPCOES_PADRAO_ECO, OPCOES_POSTERIOR, OPCOES_CALCIFICACOES,
  OPCOES_VASCULARIZACAO, OPCOES_LOCALIZACAO
} from '@/data/biradsLexicons';
import { calcularBiRads } from '@/services/biradsCalculator';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface MamaPanelProps {
  lado: Lado;
  lesao: LesaoMamaria;
  onChange: (lesao: LesaoMamaria) => void;
}

export function MamaPanel({ lado, lesao, onChange }: MamaPanelProps) {
  const [biRadsResultado, setBiRadsResultado] = useState<ReturnType<typeof calcularBiRads> | null>(null);

  // Calcular BI-RADS automaticamente quando lesao muda
  useEffect(() => {
    if (lesao.tipo === 'nodulo') {
      const resultado = calcularBiRads(lesao);
      setBiRadsResultado(resultado);
    } else {
      setBiRadsResultado(null);
    }
  }, [lesao]);

  const handleTipoChange = (tipo: 'normal' | 'nodulo' | 'cisto') => {
    onChange({
      ...lesao,
      tipo,
      // Reset campos se não for nódulo
      ...(tipo !== 'nodulo' && {
        tamanho: '',
        localizacao: '',
        forma: '',
        orientacao: '',
        margens: '',
        padraoEco: '',
        caracteristicasPosterior: '',
        calcificacoes: '',
        vascularizacao: ''
      })
    });
  };

  const handleFieldChange = (field: keyof LesaoMamaria, value: string) => {
    onChange({
      ...lesao,
      [field]: value
    });
  };

  const tituloLado = lado === 'direita' ? 'Mama Direita' : 'Mama Esquerda';

  return (
    <Card className="p-6 space-y-6 bg-white/80 backdrop-blur-sm border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">{tituloLado}</h3>
      </div>

      {/* Tipo de Achado */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tipo de Achado
        </label>
        <Select value={lesao.tipo} onValueChange={handleTipoChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o tipo de achado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="nodulo">Nódulo</SelectItem>
            <SelectItem value="cisto">Cisto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mensagem para Normal ou Cisto */}
      {lesao.tipo === 'normal' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Mama sem alterações significativas ao exame ultrassonográfico.
          </p>
        </div>
      )}

      {lesao.tipo === 'cisto' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Cisto simples identificado. Achado benigno sem necessidade de caracterização adicional.
          </p>
        </div>
      )}

      {/* Campos para Nódulo */}
      {lesao.tipo === 'nodulo' && (
        <div className="space-y-6">
          {/* Tamanho */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tamanho (cm)
            </label>
            <Input
              type="text"
              placeholder="Ex: 1.2 x 0.8 x 0.9"
              value={lesao.tamanho}
              onChange={(e) => handleFieldChange('tamanho', e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Formato: comprimento x altura x largura
            </p>
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Localização
            </label>
            <Select
              value={lesao.localizacao}
              onValueChange={(value) => handleFieldChange('localizacao', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a localização" />
              </SelectTrigger>
              <SelectContent>
                {OPCOES_LOCALIZACAO.map((opcao) => (
                  <SelectItem key={opcao.valor} value={opcao.valor}>
                    {opcao.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Características BI-RADS */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900">
              Caracterização BI-RADS
            </h4>

            <LexicoDropdown
              label="Forma"
              value={lesao.forma}
              onChange={(value) => handleFieldChange('forma', value)}
              opcoes={OPCOES_FORMA}
            />

            <LexicoDropdown
              label="Orientação"
              value={lesao.orientacao}
              onChange={(value) => handleFieldChange('orientacao', value)}
              opcoes={OPCOES_ORIENTACAO}
            />

            <LexicoDropdown
              label="Margens"
              value={lesao.margens}
              onChange={(value) => handleFieldChange('margens', value)}
              opcoes={OPCOES_MARGENS}
            />

            <LexicoDropdown
              label="Padrão Ecográfico"
              value={lesao.padraoEco}
              onChange={(value) => handleFieldChange('padraoEco', value)}
              opcoes={OPCOES_PADRAO_ECO}
            />

            <LexicoDropdown
              label="Características Posteriores"
              value={lesao.caracteristicasPosterior}
              onChange={(value) => handleFieldChange('caracteristicasPosterior', value)}
              opcoes={OPCOES_POSTERIOR}
            />

            <LexicoDropdown
              label="Calcificações"
              value={lesao.calcificacoes}
              onChange={(value) => handleFieldChange('calcificacoes', value)}
              opcoes={OPCOES_CALCIFICACOES}
            />

            <LexicoDropdown
              label="Vascularização"
              value={lesao.vascularizacao}
              onChange={(value) => handleFieldChange('vascularizacao', value)}
              opcoes={OPCOES_VASCULARIZACAO}
            />
          </div>

          {/* BI-RADS Display */}
          {biRadsResultado && (
            <div className="pt-4 border-t border-gray-200">
              <BiRadsDisplay resultado={biRadsResultado} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
