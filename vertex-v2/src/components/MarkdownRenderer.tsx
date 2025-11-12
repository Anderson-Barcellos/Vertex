import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

/**
 * Componente para renderizar markdown com suporte a GFM (GitHub Flavored Markdown)
 */
export default function MarkdownRenderer({
  content,
  className = '',
  isStreaming = false
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className} ${isStreaming ? 'streaming' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Personalização dos componentes do markdown
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-semibold mb-3 mt-4 text-gray-800" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium mb-2 mt-3 text-gray-700" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="mb-3 text-gray-700 leading-relaxed text-[13px]" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-3 ml-4 text-gray-700" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-3 ml-4 text-gray-700" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-gray-900" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>
              {children}
            </em>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ children, ...props }) => {
            // Inline code
            return (
              <code
                className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-4"
              {...props}
            >
              {children}
            </pre>
          ),
          hr: () => <hr className="my-6 border-gray-300" />,
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-100" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Cursor de streaming */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-gray-500 animate-pulse ml-1" />
      )}
    </div>
  );
}