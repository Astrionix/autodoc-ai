import os
import pdfplumber
import docx

def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.pdf':
        return extract_from_pdf(file_path)
    elif ext == '.docx':
        return extract_from_docx(file_path)
    elif ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file extension: {ext}")

def extract_from_pdf(file_path: str) -> str:
    text = ""
    # Try pdfplumber first
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"pdfplumber failed: {e}")

    # If pdfplumber returned empty, try PyPDF2 as fallback
    if not text.strip():
        try:
            import PyPDF2
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            print(f"PyPDF2 fallback also failed: {e}")

    return text.strip()

def extract_from_docx(file_path: str) -> str:
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
