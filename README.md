# Vertex V2 🏥

**Sistema de Laudos Ultrassonográficos com IA**

[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/status-Produção-success.svg)]()

Sistema moderno para geração automatizada de laudos ultrassonográficos usando IA generativa (Gemini/OpenAI/Claude), seguindo diretrizes médicas brasileiras (CBR, BI-RADS, TI-RADS).

## ✨ Principais Recursos

- 🤖 **IA Integrada**: Geração automática de impressões diagnósticas
- 📊 **Calculadoras Automáticas**: BI-RADS, TI-RADS, NASCET, ITB/IDB
- 🏥 **9 Modalidades**: Abdome, Carótidas, Tireoide, Mama, Arterial, Venoso, Ombro, etc.
- 🎨 **Interface Moderna**: Design glassmorphism com streaming em tempo real
- 📱 **Desktop-first**: Otimizado para uso profissional em desktop

## 🚀 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/Anderson-Barcellos/vertex-v2.git
cd vertex-v2

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:8200

## 🔑 Credenciais

```
Login: anders
Senha: vertex2025
```

## 📋 Exames Disponíveis

| Exame | Calculadoras | Status |
|-------|--------------|--------|
| **Abdome Total** | - | ✅ Ativo |
| **Doppler Carótidas** | NASCET, Gray-Weale | ✅ Ativo |
| **Tireoide** | TI-RADS ACR | ✅ Ativo |
| **Mama** | BI-RADS 5ª ed. | ✅ Ativo |
| **Arterial MMII** | ITB/IDB Automático | ✅ Ativo |
| **Venoso MMII** | CEAP | ✅ Ativo |
| **Ombro** | - | ✅ Ativo |
| **Vasos Abdominais** | - | ✅ Ativo |
| **Parede Abdominal** | - | ✅ Ativo |

## 🛠️ Stack Tecnológica

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7.2
- **Estilização**: Tailwind CSS v4 + Radix UI
- **IA**: Gemini 3.0 Pro, OpenAI GPT-4, Claude Sonnet
- **Backend API**: FastAPI (Python) - https://ultrassom.ai:8177

## 📚 Documentação

- **[CLAUDE.md](./CLAUDE.md)** - Referência rápida para desenvolvimento
- **[ROADMAP.md](./ROADMAP.md)** - Histórico de desenvolvimento e próximos passos
- **[docs/](./docs/)** - Documentação técnica completa

## 👨‍⚕️ Autor

**Dr. Anderson Barcellos**  
Neuropsiquiatra e Ultrassonografista  
Santa Cruz do Sul, RS - Brasil

## 📄 Licença

Proprietária - Todos os direitos reservados

---

*Para mais informações técnicas, consulte [CLAUDE.md](./CLAUDE.md)*