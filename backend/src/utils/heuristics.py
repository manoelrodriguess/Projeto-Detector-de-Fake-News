def analyze_with_heuristics(text: str) -> dict:
    text_lower = text.lower()
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
        return {
            "classification": "fake",
            "confidence": 0.92,
            "indicators": [
                "Linguagem sensacionalista detectada",
                "Apelo à urgência identificado",
                "Padrão típico de desinformação",
            ],
        }

    return {
        "classification": "true",
        "confidence": 0.85,
        "indicators": [
            "Nenhum padrão de urgência extrema encontrado",
            "Texto com tom mais factual",
            "Baixa presença de gatilhos típicos de fake news",
        ],
    }