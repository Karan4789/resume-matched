
from pdfminer.high_level import extract_text as extract_text_pdf
import docx
import os

def extract_text_from_pdf(file_path):
    """
    Extract text from PDF file
    """
    try:
        text = extract_text_pdf(file_path)
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_path):
    """
    Extract text from DOCX file
    """
    try:
        doc = docx.Document(file_path)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

def extract_text_from_txt(file_path):
    """
    Extract text from TXT file
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
        return text
    except Exception as e:
        print(f"Error extracting text from TXT: {e}")
        return ""
