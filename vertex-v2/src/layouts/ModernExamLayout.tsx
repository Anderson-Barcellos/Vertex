import React from 'react';

type ModernExamLayoutProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
  panels: React.ReactNode;
  floatingPanel?: React.ReactNode;
};

/**
 * ModernExamLayout
 *
 * Grid de 12 colunas com sidebar | main | painéis,
 * cabeçalho glass e suporte a painel flutuante via prop `floatingPanel`.
 *
 * Mantém as mesmas classes utilitárias usadas nas páginas modernas atuais
 * para evitar regressões visuais.
 */
export default function ModernExamLayout({
  header,
  sidebar,
  main,
  panels,
  floatingPanel
}: ModernExamLayoutProps) {
  return (
    <div className="modern-layout min-h-screen">
      <header className="glass-panel mb-0 rounded-none border-0 border-b border-white/10">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          {header}
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3 animate-slide-left" data-sidebar>
            <div className="glass-sidebar rounded-2xl p-6 sticky top-6 max-h-[calc(100vh-120px)] overflow-y-auto modern-scrollbar">
              {sidebar}
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-6 animate-fade-up">
            {main}
          </main>

          <aside className="col-span-12 lg:col-span-3 animate-slide-right">
            <div className="sticky top-6 space-y-4 min-h-[calc(100vh-8rem)]">
              {panels}
            </div>
          </aside>
        </div>
      </div>

      {floatingPanel}
    </div>
  );
}

