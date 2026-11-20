import React, { useMemo } from 'react';
import katex from 'katex';

interface KatexMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const KatexMath: React.FC<KatexMathProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="font-mono text-content-primary">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

