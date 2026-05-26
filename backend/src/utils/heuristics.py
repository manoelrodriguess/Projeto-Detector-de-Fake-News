def analyze_with_heuristics(text: str, image=None) -> dict:
    """Analisa o texto (e opcionalmente uma imagem) usando heurísticas simples.

    Regras incorporadas:
    1) Seja cético com citações de fontes famosas — não marcar automaticamente como verdadeiro.
    2) Alegações extraordinárias (alienígenas, Terra Plana, sobrenatural etc.) são tratadas como falsas,
       a menos que o texto seja claramente sobre o mito/reportagem histórica.
    3) Se a imagem parecer montagem, reduzir fortemente a confiança.

    Parâmetro `image` pode ser None, um caminho de arquivo (str) ou outro objeto que indique manipulação.
    Esta função usa heurísticas textuais simples; análises visuais avançadas devem ser feitas por modelos especializados.
    """

    text_lower = (text or "").lower()
    indicators = []

    # 1) termos sensacionalistas / avisos de desinformação
    suspicious_terms = [
        "urgente",
        "repasse",
        "cura milagrosa",
        "espalhem",
        "chocante",
        "clique agora",
        "verdade escondida",
    ]
    is_suspicious = any(term in text_lower for term in suspicious_terms)
    if is_suspicious:
        indicators.append("Linguagem sensacionalista detectada")

    # 2) citações de fontes famosas — sinal de alerta, mas não prova de falsidade
    famous_sources = ["g1", "globo", "cnn", "bbc", "folha", "uol", "estadao", "récord", "antena"]
    cited_sources = [s for s in famous_sources if s in text_lower]
    if cited_sources:
        indicators.append(f"Cita fonte(s) famosa(s): {', '.join(cited_sources)} — mantenha ceticismo")

    # 3) alegações extraordinárias
    extraordinary_terms = [
        "alien", "alienígena", "et ", "terra plana", "conspiração", "sobrenatural",
        "milagre", "extraterrestre", "varginha", "ovni", "ufologia",
    ]
    is_extraordinary = any(term in text_lower for term in extraordinary_terms)
    # exceções quando o texto trata do mito/lenda/reportagem sobre o caso
    myth_terms = ["mito", "lenda", "reportagem", "análise", "história", "histórico"]
    is_myth_report = any(term in text_lower for term in myth_terms)
    if is_extraordinary and not is_myth_report:
        return {
            "classification": "fake",
            "confidence": 0.99,
            "indicators": [
                "Alegação extraordinária detectada",
                "Tratar como falsa, a menos que exista evidência verificável",
            ],
        }
    elif is_extraordinary and is_myth_report:
        indicators.append("Alegação extraordinária mencionada no contexto de mito/reportagem")

    # 4) análise básica de imagem (heurística superficial)
    image_montage = False
    if image is not None:
        # heurística simples: se `image` for um caminho que contenha palavras indicativas
        try:
            if isinstance(image, str):
                img_lower = image.lower()
                if any(k in img_lower for k in ("montagem", "manipulado", "photoshop", "fake", "edited")):
                    image_montage = True
            else:
                # Se receber outro tipo de objeto, não fazemos análise profunda aqui
                # Usuário/aplicação pode integrar verificação de integridade, metadados ou modelos ML.
                pass
        except Exception:
            pass

    if image_montage:
        indicators.append("Imagem com aparência de montagem detectada — confiança reduzida")

    # Determinar confiança base
    base_confidence = 0.85
    if is_suspicious:
        base_confidence = max(0.5, base_confidence - 0.25)
    if cited_sources and not is_suspicious and not image_montage:
        # citações de fonte reduzem confiança, mas não classificam como falsa por si só
        base_confidence = min(base_confidence, 0.6)
    if image_montage:
        base_confidence = max(0.01, base_confidence - 0.4)

    classification = "fake" if (is_suspicious or image_montage) else "true"

    if not indicators:
        indicators = [
            "Nenhum padrão de urgência extrema encontrado",
            "Sem indicadores textuais fortes de desinformação",
        ]

    return {
        "classification": classification,
        "confidence": round(base_confidence, 2),
        "indicators": indicators,
    }