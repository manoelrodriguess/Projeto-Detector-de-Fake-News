import { useEffect, useState } from 'react';
import { FileText, Paperclip, ScanSearch, Search, Shuffle, Trash2, TriangleAlert, X } from 'lucide-react';

export default function NewsInput({
  text,
  setText,
  onAnalyze,
  onAnalyzeFile,
  onLoadRandomNews,
  selectedFile,
  setSelectedFile,
  isLoading,
  disabled = false,
}) {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const acceptedFileTypes = '.txt,.pdf,.png,.jpg,.jpeg,.webp,.bmp,.tiff';

  const handleAnalyze = () => {
    setError('');

    if (selectedFile) {
      if (!onAnalyzeFile) {
        setError('Upload de arquivo não está disponível agora');
        return;
      }

      onAnalyzeFile(selectedFile);
      return;
    }

    if (!text.trim()) {
      setError('Por favor, digite ou cole uma notícia para analisar');
      return;
    }

    if (text.trim().length < 50) {
      setError('A notícia deve ter pelo menos 50 caracteres para uma análise confiável');
      return;
    }

    onAnalyze(text);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const charCount = text.length;
  const isValid = text.trim().length >= 50;
  const percentage = Math.min((charCount / 50) * 100, 100);
  const isDisabled = disabled || isLoading || (!isValid && !selectedFile);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setError('');

    if (!file) {
      if (setSelectedFile) {
        setSelectedFile(null);
      }
      return;
    }

    if (setSelectedFile) {
      setSelectedFile(file);
    }

    if (setText) {
      setText('');
    }
  };

  const clearSelectedFile = () => {
    if (setSelectedFile) {
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (!selectedFile || !selectedFile.type?.startsWith('image/')) {
      setPreviewUrl('');
      setIsPreviewOpen(false);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!isPreviewOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isPreviewOpen]);

  const handleFileSelection = (file) => {
    if (!file) return;

    setError('');

    if (setSelectedFile) {
      setSelectedFile(file);
    }

    if (setText) {
      setText('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFile = event.dataTransfer?.files?.[0] || null;
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

  const openPreview = () => {
    if (previewUrl) {
      setIsPreviewOpen(true);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      <label htmlFor="newsInput" className="flex items-center gap-2 text-lg font-semibold text-slate-100">
        <FileText className="h-5 w-5" />
        Cole ou digite uma notícia
      </label>

      <div
        className={`relative group transition-all duration-200 ${isDragging ? 'scale-[1.01]' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/90 font-semibold text-slate-200 pointer-events-none">
            Solte a imagem ou arquivo aqui
          </div>
        )}

        {selectedFile && previewUrl && (
          <div
            onClick={openPreview}
            className="group absolute left-3 top-3 z-20 w-40 max-w-[45vw] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 text-left transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-500 cursor-zoom-in"
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPreview();
              }
            }}
          >
            <div className="relative">
              <img
                src={previewUrl}
                alt={`Pré-visualização de ${selectedFile.name}`}
                className="block w-full max-h-32 object-cover object-center transition duration-300 group-hover:brightness-90"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-slate-100 opacity-0 scale-90 transition duration-300 group-hover:opacity-100 group-hover:scale-100">
                  <Search className="h-5 w-5" />
                </span>
              </div>
              <button
                type="button"
                onClick={clearSelectedFile}
                aria-label="Remover imagem anexada"
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-100 transition-all duration-200 hover:bg-slate-900 hover:scale-105"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  clearSelectedFile();
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-800 bg-slate-900 px-3 py-2 text-[11px] text-slate-300">
              <span className="truncate">{selectedFile.name}</span>
            </div>
          </div>
        )}

        <input
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          disabled={disabled || isLoading}
          className="hidden"
          id="newsFileInput"
        />

        <textarea
          id="newsInput"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (selectedFile && setSelectedFile) {
              setSelectedFile(null);
            }
            setError('');
          }}
          onKeyDown={handleKeyDown}
          onPaste={async (e) => {
            try {
              if (!e.clipboardData) return;
              const items = Array.from(e.clipboardData.items || []);
              for (const item of items) {
                if (!item || !item.type) continue;
                if (item.type.startsWith('image/')) {
                  const fileBlob = item.getAsFile ? item.getAsFile() : null;
                  if (fileBlob && setSelectedFile) {
                    const ext = fileBlob.type.split('/')[1] || 'png';
                    const file = new File([fileBlob], `clipboard.${ext}`, { type: fileBlob.type });
                    setSelectedFile(file);
                    if (setText) setText('');
                    e.preventDefault();
                    break;
                  }
                }
              }
            } catch (err) {
              console.error('Erro ao processar paste:', err);
            }
          }}
          disabled={disabled || isLoading}
          placeholder="Digite ou cole uma notícia, postagem, artigo ou qualquer texto para análise..."
          className="w-full h-48 resize-none rounded-xl border-2 border-slate-800 bg-slate-950 p-4 text-white placeholder-slate-500 transition-colors duration-200 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        {selectedFile && !previewUrl && (
          <div className="absolute left-3 bottom-3 right-28 truncate rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Paperclip className="h-3.5 w-3.5" />
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={clearSelectedFile}
              className="ml-2 text-slate-400 underline hover:text-slate-200"
            >
              remover
            </button>
          </div>
        )}

        <div className={`absolute bottom-3 right-3 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
          selectedFile || charCount >= 50
            ? 'border-slate-700 bg-slate-900 text-slate-200'
            : 'border-slate-700 bg-slate-900 text-slate-400'
        }`}>
          {selectedFile ? 'arquivo' : `${charCount} / 50`}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label
          htmlFor="newsFileInput"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-slate-200 transition-colors duration-200 hover:bg-slate-800"
        >
          <Paperclip className="h-4 w-4" />
          Anexar arquivo, imagem ou print
        </label>

        {selectedFile && (
          <button
            type="button"
            onClick={clearSelectedFile}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-slate-200 transition-colors duration-200 hover:bg-slate-800"
          >
            <Trash2 className="h-4 w-4" />
            Limpar anexo
          </button>
        )}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
        <div
          className={`h-full transition-all duration-300 rounded-full relative ${
            isValid ? 'bg-slate-300' : 'bg-slate-600'
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {error && (
        <div className="animate-slideInDown rounded-lg border border-red-900 bg-slate-950 p-4 text-sm text-red-200">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={isDisabled}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-lg font-semibold transition-colors duration-200 ${
          isDisabled
            ? 'cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-500'
            : 'border border-slate-700 bg-slate-100 text-slate-950 hover:bg-white active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-slate-500 border-t-slate-100 animate-spin" />
            Analisando...
          </>
        ) : selectedFile ? (
          <>
            <ScanSearch className="h-5 w-5" />
            Analisar arquivo
          </>
        ) : !isValid ? (
          <>
            <TriangleAlert className="h-5 w-5" />
            Mínimo 50 caracteres
          </>
        ) : (
          <>
            <ScanSearch className="h-5 w-5" />
            Analisar
          </>
        )}
      </button>

      {onLoadRandomNews && (
        <button
          type="button"
          onClick={onLoadRandomNews}
          disabled={disabled || isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition-colors duration-200 hover:bg-slate-800"
        >
          <Shuffle className="h-4 w-4" />
          Carregar notícia aleatória do backend
        </button>
      )}

      <p className="text-center text-xs leading-relaxed text-slate-500">
        Dica: pressione <span className="rounded bg-slate-900 px-2 py-1 text-slate-400">Ctrl+Enter</span> para enviar mais rapidamente
      </p>

      {isPreviewOpen && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 opacity-0 animate-[fadeIn_300ms_ease-out_forwards]"
          onClick={closePreview}
          role="presentation"
        >
          <div
            className="relative w-full max-w-5xl scale-95 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 animate-[scaleIn_300ms_ease-out_forwards]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Visualização ampliada de ${selectedFile?.name || 'imagem'}`}
          >
            <button
              type="button"
              onClick={closePreview}
              aria-label="Fechar visualização"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-slate-100 transition-colors duration-200 hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[85vh] overflow-auto bg-black/20">
              <img
                src={previewUrl}
                alt={`Imagem ampliada de ${selectedFile?.name || 'imagem anexada'}`}
                className="mx-auto block w-full max-h-[85vh] object-contain"
              />
            </div>

            <div className="border-t border-slate-800 bg-slate-950 px-5 py-4 text-sm text-slate-300">
              <p className="truncate font-medium">{selectedFile?.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}