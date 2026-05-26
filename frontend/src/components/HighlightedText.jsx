import { FileText } from 'lucide-react';

export default function HighlightedText({ text, suspiciousSpans = [] }) {
  if (!text) return null;

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const spans = suspiciousSpans
    .map((span) => ({
      ...span,
      excerpt: String(span.excerpt || '').trim(),
      reason: String(span.reason || '').trim(),
    }))
    .filter((span) => span.excerpt.length > 0)
    .sort((a, b) => b.excerpt.length - a.excerpt.length);

  const segments = [{ text, highlighted: false, reason: '' }];

  spans.forEach((span) => {
    const pattern = new RegExp(escapeRegExp(span.excerpt), 'gi');
    const nextSegments = [];

    segments.forEach((segment) => {
      if (segment.highlighted) {
        nextSegments.push(segment);
        return;
      }

      let lastIndex = 0;
      let match;
      const segmentText = segment.text;
      pattern.lastIndex = 0;

      while ((match = pattern.exec(segmentText)) !== null) {
        if (match.index > lastIndex) {
          nextSegments.push({
            text: segmentText.slice(lastIndex, match.index),
            highlighted: false,
            reason: '',
          });
        }

        nextSegments.push({
          text: segmentText.slice(match.index, match.index + match[0].length),
          highlighted: true,
          reason: span.reason,
        });

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < segmentText.length) {
        nextSegments.push({
          text: segmentText.slice(lastIndex),
          highlighted: false,
          reason: '',
        });
      }
    });

    segments.splice(0, segments.length, ...nextSegments);
  });

  return (
    <div className="w-full space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
        <FileText className="h-4 w-4" />
        Análise do Texto
      </h3>
      
      <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-6 leading-relaxed text-slate-200">
        {spans.length === 0 ? (
          <p className="text-slate-400 whitespace-pre-wrap">{text}</p>
        ) : (
          <p className="whitespace-pre-wrap">
            {segments.map((segment, index) =>
              segment.highlighted ? (
                <mark
                  key={`${index}-${segment.text}`}
                  title={segment.reason}
                  className="rounded px-1.5 py-0.5 border border-red-900 bg-red-950 text-red-100"
                >
                  {segment.text}
                </mark>
              ) : (
                <span key={`${index}-${segment.text}`}>{segment.text}</span>
              )
            )}
          </p>
        )}
      </div>

      {spans.length > 0 && (
        <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded bg-red-950 border border-red-900" />
            <span className="text-slate-400">Trecho possivelmente falso</span>
          </div>
        </div>
      )}
    </div>
  );
}
