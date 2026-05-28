import React from 'react';

/**
 * Simple markdown formatter for training content
 * Converts basic markdown syntax to React components
 */

export function formatTrainingContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc list-inside space-y-2 my-4 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-300">
              {formatInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      elements.push(<br key={index} />);
      return;
    }

    // Bullet point
    if (trimmed.startsWith('•')) {
      listItems.push(trimmed.substring(1).trim());
      return;
    }

    // Flush pending list
    flushList();

    // Heading **text**
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const heading = trimmed.slice(2, -2);
      elements.push(
        <h3 key={index} className="text-lg font-bold text-white mt-6 mb-3">
          {formatInline(heading)}
        </h3>
      );
      return;
    }

    // Reflection prompt (italic in asterisks)
    if (trimmed.startsWith('*Reflection:') || trimmed.startsWith('*Reflection:')) {
      elements.push(
        <div key={index} className="bg-primary-teal/10 border-l-4 border-primary-teal p-4 my-4 rounded-r-lg">
          <p className="text-primary-teal font-semibold mb-1">Reflection</p>
          <p className="text-gray-300 italic">{trimmed.replace(/\*Reflection:\s*/, '')}</p>
        </div>
      );
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={index} className="my-2 text-gray-300">
        {formatInline(trimmed)}
      </p>
    );
  });

  // Flush any remaining list
  flushList();

  return <div className="space-y-2">{elements}</div>;
}

function formatInline(text: string): React.ReactNode {
  const result: React.ReactNode[] = [];
  let current = '';
  let bold = false;
  let italic = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    // Bold **text**
    if (char === '*' && next === '*') {
      if (current) {
        result.push(<span key={result.length}>{renderText(current, bold, italic)}</span>);
        current = '';
      }
      bold = !bold;
      i++;
      continue;
    }

    // Italic *text*
    if (char === '*' && next !== '*') {
      if (current) {
        result.push(<span key={result.length}>{renderText(current, bold, italic)}</span>);
        current = '';
      }
      italic = !italic;
      continue;
    }

    current += char;
  }

  if (current) {
    result.push(<span key={result.length}>{renderText(current, bold, italic)}</span>);
  }

  return <>{result}</>;
}

function renderText(text: string, bold: boolean, italic: boolean): React.ReactNode {
  let result: React.ReactNode = text;

  if (italic) {
    result = <em className="italic">{result}</em>;
  }

  if (bold) {
    result = <strong className="font-semibold text-white">{result}</strong>;
  }

  return result;
}
