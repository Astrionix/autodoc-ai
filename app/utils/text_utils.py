from typing import List

def chunk_text(text: str, max_chars: int = 15000) -> List[str]:
    """
    Splits text into smaller chunks based on max_chars.
    Preserves whole words where possible.
    """
    chunks = []
    current_chunk = []
    current_length = 0

    paragraphs = text.split('\n')
    
    for para in paragraphs:
        if current_length + len(para) > max_chars and current_length > 0:
            chunks.append("\n".join(current_chunk))
            current_chunk = [para]
            current_length = len(para)
        else:
            current_chunk.append(para)
            current_length += len(para) + 1 # +1 for newline

    if current_chunk:
        chunks.append("\n".join(current_chunk))

    return chunks
