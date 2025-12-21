import google.generativeai as genai
import os

# Явно указываем ключ (или убедитесь, что os.getenv работает)
api_key = "AIzaSyDozP5IGSOA3W4YjF-opLUFV9oyYppbwnM"
genai.configure(api_key=api_key)

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Доступная модель: {m.name}")
except Exception as e:
    print(f"Ошибка: {e}")