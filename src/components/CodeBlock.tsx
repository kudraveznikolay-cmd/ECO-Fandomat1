import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700 my-4">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {filename && (
            <span className="text-gray-400 text-sm ml-3 font-mono">{filename}</span>
          )}
          <span className="text-gray-500 text-xs ml-2 bg-gray-700 px-2 py-0.5 rounded">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded hover:bg-gray-700 transition-colors"
        >
          {copied ? '✓ Скопировано' : '📋 Копировать'}
        </button>
      </div>
      <pre className="bg-gray-900 p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-100 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
