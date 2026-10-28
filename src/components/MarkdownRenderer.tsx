import React, { useState } from "react";
import { Copy, Check, Code2, Play } from "lucide-react";
import { marked } from "marked";

interface MarkdownRendererProps {
  content: string;
  onOpenInCodeLab?: (code: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onOpenInCodeLab,
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Extract code blocks vs regular markdown
  const parts: { type: "text" | "code"; content: string; language?: string }[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_\-+]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.substring(lastIndex, match.index),
      });
    }
    parts.push({
      type: "code",
      language: match[1] || "cpp",
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.substring(lastIndex),
    });
  }

  return (
    <div className="space-y-4 text-sm leading-relaxed text-slate-200">
      {parts.map((part, index) => {
        if (part.type === "code") {
          const isCpp = part.language?.toLowerCase().includes("cp") || part.language?.toLowerCase() === "c++" || part.language === "";
          return (
            <div
              key={index}
              className="my-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/90 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono uppercase tracking-wider text-slate-300">
                    {part.language || "cpp"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isCpp && onOpenInCodeLab && (
                    <button
                      onClick={() => onOpenInCodeLab(part.content)}
                      className="flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-indigo-200"
                      title="Open in Interactive Code Lab"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Open in Code Lab
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyCode(part.content, index)}
                    className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    {copiedCodeIndex === index ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-cyan-100/90">
                <pre>{part.content}</pre>
              </div>
            </div>
          );
        }

        // Render HTML parsed markdown
        const rawHtml = marked.parse(part.content, {
          gfm: true,
          breaks: true,
        }) as string;

        return (
          <div
            key={index}
            className="prose prose-invert max-w-none prose-p:my-2 prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-semibold prose-headings:text-slate-100 prose-ul:my-2 prose-li:my-1 prose-table:my-3 prose-th:border-b prose-th:border-slate-700 prose-th:pb-2 prose-th:text-slate-200 prose-td:py-1.5 prose-td:border-b prose-td:border-slate-800/60 prose-strong:text-cyan-300"
            dangerouslySetInnerHTML={{ __html: rawHtml }}
          />
        );
      })}
    </div>
  );
};
