import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-4">Teste - Landing Page</h1>
      <p className="text-xl">Se você está vendo isso, o React está funcionando!</p>
      <div className="mt-8">
        <a
          href="/exame/abdome-total"
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Ir para Abdome Total
        </a>
      </div>
    </div>
  );
}

export default App;