from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware # Importa o middleware para lidar com CORS
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que qualquer frontend acesse
    allow_credentials=True,
    allow_methods=["*"], # Permite POST, GET, etc
    allow_headers=["*"],
)

# Dizemos para a API qual é o formato de dados que o Frontend vai enviar
class Noticia(BaseModel):
    texto: str

# Rota de teste para ver se a API está online
@app.get("/")
def home():
    return {"mensagem": "Detector de Fake News API está rodando!"}

# Rota principal que vai receber o texto do seu Frontend
@app.post("/analisar")
async def analisar_noticia(noticia: Noticia):
    # ==========================================
    # AQUI ENTRARÁ O MODELO DA HUGGING FACE.
    # Por enquanto, uma lógica simples para você testar seu Frontend:
    # ==========================================
    texto_recebido = noticia.texto.lower()
    
    # Palavras comuns em Fake News (exagero e urgência)
    palavras_suspeitas = ["urgente", "repasse", "cura milagrosa", "espalhem", "chocante"]
    
    # Verifica se tem padrão suspeito
    if any(palavra in texto_recebido for palavra in palavras_suspeitas):
        return {
            "resultado": "Suspeito", 
            "confianca": 0.92,
            "motivo": "Padrão de urgência ou sensacionalismo detectado."
        }
    else:
        return {
            "resultado": "Provavelmente Verdadeiro", 
            "confianca": 0.85,
            "motivo": "Nenhuma anomalia linguística grave detectada."
        }