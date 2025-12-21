from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ResidentialComplex, Building, Apartment
import json
import os

router = APIRouter(prefix="/ai-assistant", tags=["AI Assistant"])

# Настройка Gemini API из переменных окружения
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment variables!")
else:
    print(f"✅ GEMINI_API_KEY loaded: {GEMINI_API_KEY[:10]}...")
    genai.configure(api_key=GEMINI_API_KEY)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_preferences: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    recommendations: Optional[List[dict]] = None


def get_available_properties(db: Session) -> dict:
    # Берем только 1 ЖК и 3 свободные квартиры для теста
    complexes = db.query(ResidentialComplex).limit(1).all()
    apartments = db.query(Apartment).filter(Apartment.status == "Free").limit(3).all()

    properties_info = {"complexes": [], "apartments": []}

    for complex in complexes:
        properties_info["complexes"].append({
            "name": complex.name,
            "city": str(complex.city),
            "min_price": float(complex.min_price) if complex.min_price else 0
        })

    for apt in apartments:
        properties_info["apartments"].append({
            "id": apt.id,
            "total_price": float(apt.total_price),
            "apartment_type": apt.apartment_type
        })
    return properties_info


def create_system_prompt(properties_data: dict) -> str:
    """Создать системный промпт для AI помощника"""
    return f"""Ты - профессиональный консультант по недвижимости компании Baspana Group в Казахстане.
Твоя задача - помочь клиентам найти идеальное жилье из доступных вариантов.

ДОСТУПНЫЕ ЖИЛЫЕ КОМПЛЕКСЫ И КВАРТИРЫ:
{json.dumps(properties_data, ensure_ascii=False, indent=2)}

ТВОИ ОБЯЗАННОСТИ:
1. Задавай уточняющие вопросы о потребностях клиента:
   - Бюджет (в тенге)
   - Количество комнат (Studio, One Bedroom, Two Bedroom, Three Bedroom, Penthouse)
   - Желаемый район/город
   - Площадь
   - Этаж
   - Наличие балкона
   - Тип отделки (Black Box, White Box, Finished, Turnkey)

2. Анализируй требования и рекомендуй наиболее подходящие варианты
3. Объясняй преимущества каждого варианта
4. Отвечай на русском или казахском языке (по выбору клиента)
5. Будь дружелюбным и профессиональным

ВАЖНО:
- Рекомендуй только те квартиры, которые есть в списке выше
- Указывай конкретные ID квартир и ЖК
- Учитывай бюджет клиента
- Если подходящих вариантов нет, предложи ближайшие альтернативы

Начни с приветствия и спроси о предпочтениях клиента. Также при отправке сообщении не пиши жирным текстом или другими стилями."""


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
        request: ChatRequest,
        db: Session = Depends(get_db)
):
    try:
        properties_data = get_available_properties(db)
        system_prompt = create_system_prompt(properties_data)

        # Инициализируем модель СРАЗУ с системной инструкцией
        model = genai.GenerativeModel(
            model_name='gemini-flash-latest',
            system_instruction=system_prompt
        )

        # Формируем историю сообщений (без системного промпта внутри истории)
        history = []
        for msg in request.messages[:-1]:
            history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })

        chat = model.start_chat(history=history)
        last_user_msg = request.messages[-1].content
        response = chat.send_message(last_user_msg)

        response_text = response.text

        # Парсинг рекомендаций
        recommendations = []
        for apt in properties_data["apartments"]:
            if f"ID: {apt['id']}" in response_text or f"№{apt['number']}" in response_text:
                recommendations.append({
                    "type": "apartment",
                    "id": apt["id"],
                    "number": apt["number"],
                    "apartment_type": apt["apartment_type"],
                    "total_price": apt["total_price"]
                })

        return ChatResponse(
            response=response_text,
            recommendations=recommendations if recommendations else None
        )

    except Exception as e:
        print(f"❌ Gemini Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка AI: {str(e)}")


@router.get("/initialize")
async def initialize_chat(db: Session = Depends(get_db)):
    """Получить начальное приветствие от AI помощника"""
    try:
        print("🔍 Fetching properties data...")
        properties_data = get_available_properties(db)

        system_prompt = create_system_prompt(properties_data)

        print("🔍 Initializing Gemini model (gemini-2.0-flash-lite)...")
        # ИСПРАВЛЕНО: Заменили 'gemini-pro' на 'gemini-2.0-flash'
        model = genai.GenerativeModel(
            model_name='gemini-flash-latest',
            system_instruction=system_prompt
        )

        print("🔍 Generating greeting...")
        # Теперь просто просим поздороваться, так как инструкции уже в модели
        response = model.generate_content("Напиши короткое приветственное сообщение клиенту от Baspana Group.")

        return {
            "greeting": response.text,
            "available_complexes_count": len(properties_data["complexes"]),
            "available_apartments_count": len(properties_data["apartments"])
        }

    except Exception as e:
        print(f"❌ ERROR in initialize: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка инициализации: {str(e)}")