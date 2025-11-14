/// <reference types="vite/client" />

// Declaração de tipos para imports de CSS
declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

// Declaração para imports de CSS simples
declare module '*.css?inline' {
    const content: string;
    export default content;
}
