from django.utils.translation import gettext as _
from django.utils import translation

def translate_text(text, target_language):
    """
    Dịch chuỗi văn bản sang ngôn ngữ được chỉ định.

    Args:
        text (str): Chuỗi cần dịch.
        target_language (str): Mã ngôn ngữ (ví dụ: 'vi', 'en').

    Returns:
        str: Chuỗi đã được dịch.
    """
    try:
        # Kích hoạt ngôn ngữ mục tiêu
        translation.activate(target_language)
        translated_text = _(text)
        translation.deactivate()  # Tắt ngôn ngữ sau khi dịch
        return translated_text
    except Exception as e:
        return f"Error translating text: {e}"
