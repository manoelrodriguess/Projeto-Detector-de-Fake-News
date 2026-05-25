import { useEffect, useState } from 'react';

// Componente de input para colar/digitar a notícia a ser analisada
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
    // Limpar erro anterior
    setError('');

    if (selectedFile) {
      if (!onAnalyzeFile) {
        setError('Upload de arquivo não está disponível agora');
        return;
      }

      onAnalyzeFile(selectedFile);
      return;
    }

    // Validações
    if (!text.trim()) {
      setError('Por favor, digite ou cole uma notícia para analisar');
      return;
    }

    if (text.trim().length < 50) {
      setError('A notícia deve ter pelo menos 50 caracteres para uma análise confiável');
      return;
    }

    // Chamar função do parent
    onAnalyze(text);
  };

  const handleKeyDown = (e) => {
    // Permitir Ctrl+Enter para enviar
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
      <label htmlFor="newsInput" className="block text-white font-bold text-lg">
        📝 Cole ou Digite uma Notícia
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
          <div className="absolute inset-0 z-10 rounded-xl border-2 border-dashed border-cyan-400 bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center text-cyan-100 font-semibold pointer-events-none">
            Solte a imagem ou arquivo aqui
          </div>
        )}

        {selectedFile && previewUrl && (
          <div
            onClick={openPreview}
            className="group absolute left-3 top-3 z-20 w-40 max-w-[45vw] overflow-hidden rounded-2xl border border-slate-600/70 bg-slate-950/80 shadow-xl shadow-black/40 backdrop-blur-md text-left transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-zoom-in"
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
                className="block w-full max-h-32 object-cover object-center transition duration-300 group-hover:brightness-75"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white opacity-0 scale-90 transition duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-lg backdrop-blur-sm">
                  🔍
                </span>
              </div>
              <button
                type="button"
                onClick={clearSelectedFile}
                aria-label="Remover imagem anexada"
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg hover:bg-black/80 hover:scale-105 transition-all duration-200"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  clearSelectedFile();
                }}
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-slate-200 bg-slate-900/90 border-t border-slate-700/70">
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
              // não bloquear a colagem normal se houver erro
              console.error('Erro ao processar paste:', err);
            }
          }}
          disabled={disabled || isLoading}
          placeholder="Digite ou cole uma notícia, postagem, artigo ou qualquer texto para análise..."
          className="w-full h-48 p-4 bg-slate-900/70 text-white border-2 border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500 backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-blue-500/10 focus:shadow-xl focus:shadow-blue-500/20 group-hover:border-slate-400/50"
        />

        {selectedFile && !previewUrl && (
          <div className="absolute left-3 bottom-3 right-28 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border bg-blue-500/20 text-blue-100 border-blue-400/50 shadow-lg shadow-blue-500/20 truncate">
            📎 {selectedFile.name}
            <button
              type="button"
              onClick={clearSelectedFile}
              className="ml-2 underline text-blue-200 hover:text-white"
            >
              remover
            </button>
          </div>
        )}

        {/* Indicador de caracteres no canto */}
        <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border transition-all shadow-lg ${
          selectedFile || charCount >= 50
            ? 'bg-green-500/25 text-green-200 border-green-400/60 shadow-green-500/20 hover:shadow-green-500/40'
            : 'bg-yellow-500/25 text-yellow-200 border-yellow-400/60 shadow-yellow-500/20 hover:shadow-yellow-500/40'
        }`}>
          {selectedFile ? 'arquivo' : `${charCount} / 50`}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label
          htmlFor="newsFileInput"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-600/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80 hover:border-slate-500/80 cursor-pointer transition-all duration-300"
        >
          📎 Anexar arquivo, imagem ou print
        </label>

        {selectedFile && (
          <button
            type="button"
            onClick={clearSelectedFile}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-600/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80 hover:border-slate-500/80 transition-all duration-300"
          >
            ✖ Limpar anexo
          </button>
        )}
      </div>

      {/* Barra de progresso de caracteres */}
      <div className="w-full h-2 rounded-full bg-slate-700/40 backdrop-blur-md overflow-hidden border border-slate-600/60 shadow-lg shadow-slate-900/50">
        <div
          className={`h-full transition-all duration-300 rounded-full relative ${
            isValid ? 'bg-linear-to-r from-green-500 via-cyan-500 to-green-500' : 'bg-linear-to-r from-yellow-500 via-orange-500 to-yellow-500'
          }`}
          style={{
            width: `${percentage}%`,
            boxShadow: isValid
              ? '0 0 15px rgba(34, 197, 94, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)'
              : '0 0 15px rgba(251, 146, 60, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Mensagem de erro com animação */}
      {error && (
        <div className="animate-slideInDown p-4 bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-lg text-red-300 text-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Botão de análise com estado */}
      <button
        onClick={handleAnalyze}
        disabled={isDisabled}
        className={`w-full px-6 py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg group ${
          isDisabled
            ? 'bg-slate-700/30 text-slate-400 cursor-not-allowed border border-slate-600/30 backdrop-blur-sm'
            : 'bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-blue-500/60 hover:shadow-blue-500 border border-blue-400/60 hover:border-blue-300/80 hover:scale-105 active:scale-95 backdrop-blur-sm'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analisando...
          </>
        ) : selectedFile ? (
          <>
            🚀 Analisar arquivo
          </>
        ) : !isValid ? (
          <>
            🔒 Mínimo 50 caracteres
          </>
        ) : (
          <>
            🚀 Analisar
          </>
        )}
      </button>

      {onLoadRandomNews && (
        <button
          type="button"
          onClick={onLoadRandomNews}
          disabled={disabled || isLoading}
          className="w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-base bg-slate-800/60 hover:bg-slate-700/70 text-slate-100 border border-slate-600/60 hover:border-slate-500/80 hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          🎲 Carregar notícia aleatória do backend
        </button>
      )}

      <p className="text-slate-500 text-xs text-center leading-relaxed">
        💡 Dica: pressione <span className="bg-slate-800/50 px-2 py-1 rounded text-slate-400">Ctrl+Enter</span> para enviar mais rapidamente
      </p>

      {isPreviewOpen && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 opacity-0 animate-[fadeIn_300ms_ease-out_forwards]"
          onClick={closePreview}
          role="presentation"
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/60 scale-95 animate-[scaleIn_300ms_ease-out_forwards]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Visualização ampliada de ${selectedFile?.name || 'imagem'}`}
          >
            <button
              type="button"
              onClick={closePreview}
              aria-label="Fechar visualização"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white shadow-lg transition-all duration-200 hover:bg-black/80 hover:scale-105"
            >
              ✕
            </button>

            <div className="max-h-[85vh] overflow-auto bg-black/30">
              <img
                src={previewUrl}
                alt={`Imagem ampliada de ${selectedFile?.name || 'imagem anexada'}`}
                className="mx-auto block w-full max-h-[85vh] object-contain"
              />
            </div>

            <div className="border-t border-white/10 px-5 py-4 text-sm text-slate-200 bg-slate-950/95">
              <p className="truncate font-medium">{selectedFile?.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
