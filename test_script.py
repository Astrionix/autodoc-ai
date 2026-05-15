import sys
sys.path.append('c:/projects/Doc/autodoc-ai')
from app.services.document_processor import extract_text
print("Testing first PDF:")
try:
    text1 = extract_text('c:/projects/Doc/autodoc-ai/uploads/2f47df18-adce-4503-9c7c-f8b4ea6ec393.pdf')
    print("Length:", len(text1))
    print("Preview:", repr(text1[:100]))
except Exception as e:
    print("Error:", e)

print("\nTesting second PDF:")
try:
    text2 = extract_text('c:/projects/Doc/autodoc-ai/uploads/54cfcbe4-3543-41c7-8021-914b8c68e2b3.pdf')
    print("Length:", len(text2))
    print("Preview:", repr(text2[:100]))
except Exception as e:
    print("Error:", e)
