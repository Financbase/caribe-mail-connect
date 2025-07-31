import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface ProcessFlowDiagramProps {
  definition: string;
  className?: string;
  title?: string;
}

export const ProcessFlowDiagram = ({ 
  definition, 
  className = "",
  title 
}: ProcessFlowDiagramProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true
        }
      });
      
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      ref.current.id = id;
      
      mermaid.render(id, definition, (svgCode) => {
        if (ref.current) {
          ref.current.innerHTML = svgCode;
        }
      });
    }
  }, [definition]);

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      <div 
        ref={ref} 
        className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      />
    </div>
  );
}; 