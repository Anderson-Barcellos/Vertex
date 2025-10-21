#!/usr/bin/env node

/**
 * Script de teste para validar a geração de laudos
 * Testa o fluxo completo de requisição para o endpoint Gemini
 */

import https from 'https';
import http from 'http';

// Configurações de teste
const TESTS = [
    {
        name: 'Test 1: Hepatomegalia leve',
        data: {
            examType: 'Ultrassonografia de Abdome Total',
            selectedFindings: [
                {
                    organId: 'figado',
                    categoryId: 'tamanho',
                    findingId: 'hepatomegalia',
                    finding: { name: 'Hepatomegalia', id: 'hepatomegalia' },
                    severity: 'Leve',
                    instances: [
                        {
                            id: 'inst_1',
                            measurements: {
                                size: '16 cm no eixo crânio-caudal',
                                location: 'Lobo direito',
                                segment: 'Segmentos V-VI'
                            }
                        }
                    ]
                }
            ],
            normalOrgans: ['vesicula', 'pancreas', 'baco']
        }
    },
    {
        name: 'Test 2: Múltiplos achados com detalhes',
        data: {
            examType: 'Ultrassonografia de Abdome Total',
            selectedFindings: [
                {
                    organId: 'figado',
                    categoryId: 'lesao',
                    findingId: 'nodulo',
                    finding: { name: 'Nódulo hepático', id: 'nodulo' },
                    severity: 'Moderado',
                    instances: [
                        {
                            id: 'inst_1',
                            measurements: {
                                size: '2.5 cm',
                                location: 'Lobo direito',
                                segment: 'Segmento VII',
                                description: 'Lesão hipoecóica, bem delimitada'
                            }
                        },
                        {
                            id: 'inst_2',
                            measurements: {
                                size: '1.2 cm',
                                location: 'Lobo esquerdo',
                                segment: 'Segmento III'
                            }
                        }
                    ]
                },
                {
                    organId: 'rins',
                    categoryId: 'litase',
                    findingId: 'litase_renal',
                    finding: { name: 'Litíase renal', id: 'litase_renal' },
                    severity: 'Leve',
                    instances: [
                        {
                            id: 'inst_1',
                            measurements: {
                                size: '5mm',
                                location: 'Rim direito',
                                quantity: '1 cálculo'
                            }
                        }
                    ]
                }
            ],
            normalOrgans: ['vesicula', 'pancreas']
        }
    },
    {
        name: 'Test 3: Apenas órgãos normais',
        data: {
            examType: 'Ultrassonografia de Abdome Total',
            selectedFindings: [],
            normalOrgans: ['figado', 'vesicula', 'pancreas', 'baco', 'rins', 'adrenais']
        }
    }
];

// Cores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, method = 'POST', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 35000 // Timeout ligeiramente acima do 30s do servidor
        };

        const req = client.request(options, (res) => {
            let body = '';
            const startTime = Date.now();

            res.on('data', (chunk) => {
                body += chunk;
                const elapsed = Date.now() - startTime;
                const chunkSize = (chunk.length / 1024).toFixed(2);
                log(`  ↓ Chunk recebido: ${chunkSize} KB (${elapsed}ms)`, 'cyan');
            });

            res.on('end', () => {
                const elapsed = Date.now() - startTime;
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: body,
                    elapsedTime: elapsed
                });
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (data) {
            const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
            req.write(jsonData);
        }
        req.end();
    });
}

async function buildPrompt(finding, organsCatalog = []) {
    // Simular a função buildPrompt do geminiClient.ts
    let prompt = `Você é um radiologista experiente especializado em ultrassonografia no Brasil.

Gere uma IMPRESSÃO DIAGNÓSTICA profissional e concisa para o seguinte exame de ${finding.examType || 'Ultrassonografia'}:

`;

    if (finding.selectedFindings.length > 0) {
        prompt += 'ACHADOS PATOLÓGICOS:\n';

        finding.selectedFindings.forEach(f => {
            let header = `- ${f.finding.name}`;
            if (f.severity) {
                header += ` (Severidade: ${f.severity})`;
            }
            prompt += header + '\n';

            if (f.instances && f.instances.length > 0) {
                f.instances.forEach((inst, idx) => {
                    prompt += `  Lesão ${idx + 1}:\n`;

                    if (inst.measurements?.size) {
                        prompt += `    • Tamanho: ${inst.measurements.size}\n`;
                    }
                    if (inst.measurements?.location) {
                        prompt += `    • Localização: ${inst.measurements.location}\n`;
                    }
                    if (inst.measurements?.segment) {
                        prompt += `    • Segmento: ${inst.measurements.segment}\n`;
                    }
                    if (inst.measurements?.quantity) {
                        prompt += `    • Quantidade: ${inst.measurements.quantity}\n`;
                    }
                    if (inst.measurements?.description) {
                        prompt += `    • Descrição: ${inst.measurements.description}\n`;
                    }
                });
            }

            if (f.details) {
                prompt += `  Detalhes: ${f.details}\n`;
            }

            prompt += '\n';
        });
        prompt += '\n';
    }

    if (finding.normalOrgans.length > 0) {
        prompt += 'ÓRGÃOS NORMAIS (sem alterações):\n';

        finding.normalOrgans.forEach(organId => {
            const organName = organsCatalog?.find(org => org.id === organId)?.name || organId;
            prompt += `- ${organName}\n`;
        });
        prompt += '\n';
    }

    prompt += `INSTRUÇÕES:
1. Gere APENAS a impressão diagnóstica, sem incluir descrição dos achados
2. Use terminologia médica apropriada em português brasileiro
3. Seja conciso mas completo
4. Inclua correlações clínicas quando relevante
5. Se houver achados significativos, mencione necessidade de acompanhamento quando apropriado
6. Use classificações padronizadas (BI-RADS, TI-RADS, etc) quando aplicável
7. NÃO inclua cabeçalho ou título, apenas o texto da impressão
8. Estruture a resposta em parágrafos claros e bem organizados
`;

    return prompt;
}

async function runTest(testCase, index) {
    log(`\n${'='.repeat(80)}`, 'bright');
    log(`Test ${index + 1}: ${testCase.name}`, 'bright');
    log(`${'='.repeat(80)}`, 'bright');

    try {
        // Construir o prompt como seria feito no app
        const prompt = await buildPrompt(testCase.data);

        log(`\n📝 Prompt gerado (${prompt.length} caracteres):`, 'blue');
        log(`\n${prompt.substring(0, 300)}...\n`, 'cyan');

        // Preparar dados do request
        const requestBody = { text: prompt };
        const requestSize = JSON.stringify(requestBody).length;

        log(`\n📤 Enviando request:`, 'blue');
        log(`  • URL: ${process.env.VITE_GEMINI_API_URL || 'https://ultrassom.ai:8177/geminiCall'}`);
        log(`  • Body size: ${(requestSize / 1024).toFixed(2)} KB`);
        log(`  • Findings: ${testCase.data.selectedFindings.length}`);
        log(`  • Normal organs: ${testCase.data.normalOrgans.length}`);
        log(`  • Timestamp: ${new Date().toISOString()}`);

        // Fazer request
        const startTime = Date.now();
        const response = await makeRequest(
            process.env.VITE_GEMINI_API_URL || 'https://ultrassom.ai:8177/geminiCall',
            'POST',
            requestBody
        );
        const totalTime = Date.now() - startTime;

        // Verificar resposta
        if (response.status === 200) {
            log(`\n✅ Request bem-sucedido!`, 'green');
            log(`\n📥 Resposta recebida:`, 'blue');
            log(`  • Status: ${response.status}`);
            log(`  • Size: ${(response.body.length / 1024).toFixed(2)} KB`);
            log(`  • Time: ${totalTime}ms`);

            log(`\n📄 Impressão diagnóstica gerada:`, 'green');
            log(`\n${response.body}\n`, 'green');

            return true;
        } else {
            log(`\n❌ Request falhou!`, 'red');
            log(`  • Status: ${response.status}`, 'red');
            log(`  • Response: ${response.body}`, 'red');
            return false;
        }
    } catch (error) {
        log(`\n❌ Erro ao executar teste:`, 'red');
        log(`  • ${error.message}`, 'red');
        if (error.stack) {
            log(`  Stack: ${error.stack}`, 'red');
        }
        return false;
    }
}

async function main() {
    log(`\n${'='.repeat(80)}`, 'bright');
    log(`🧪 Teste de Geração de Laudos - Sistema UltraSound Report GE`, 'bright');
    log(`${'='.repeat(80)}`, 'bright');

    log(`\n⚙️  Configurações:`, 'yellow');
    log(`  • Endpoint: ${process.env.VITE_GEMINI_API_URL || 'https://ultrassom.ai:8177/geminiCall'}`);
    log(`  • Model: ${process.env.VITE_GEMINI_MODEL || 'gemini-2.5-pro'}`);
    log(`  • Tests: ${TESTS.length}`);
    log(`  • Timestamp início: ${new Date().toISOString()}`);

    let passed = 0;
    let failed = 0;

    for (let i = 0; i < TESTS.length; i++) {
        const result = await runTest(TESTS[i], i);
        if (result) {
            passed++;
        } else {
            failed++;
        }

        // Aguardar 2 segundos entre testes
        if (i < TESTS.length - 1) {
            log(`\n⏳ Aguardando 2 segundos antes do próximo teste...`, 'yellow');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Resumo final
    log(`\n${'='.repeat(80)}`, 'bright');
    log(`📊 Resumo dos Testes`, 'bright');
    log(`${'='.repeat(80)}`, 'bright');
    log(`\n✅ Passed: ${passed}`, 'green');
    log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
    log(`📈 Total: ${TESTS.length}`);
    log(`\n✨ Timestamp fim: ${new Date().toISOString()}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

// Executar testes
main().catch(error => {
    log(`\n❌ Erro fatal:`, 'red');
    log(`  ${error.message}`, 'red');
    process.exit(1);
});
