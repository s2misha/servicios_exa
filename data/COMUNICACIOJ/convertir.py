import os
from docx import Document

def convert_docx_to_txt(input_dir, output_dir):
    """
    Convierte todos los archivos .docx de un directorio de entrada a .txt en un directorio de salida.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Directorio de salida creado: {output_dir}")

    print(f"Buscando archivos .docx en: {input_dir}")
    
    converted_count = 0
    for filename in os.listdir(input_dir):
        if filename.endswith(".docx"):
            docx_path = os.path.join(input_dir, filename)
            txt_filename = os.path.splitext(filename)[0] + ".txt"
            txt_path = os.path.join(output_dir, txt_filename)

            try:
                document = Document(docx_path)
                full_text = []
                for para in document.paragraphs:
                    full_text.append(para.text)
                
                # Unir el texto de los párrafos con saltos de línea
                text_content = "\n".join(full_text)

                with open(txt_path, "w", encoding="utf-8") as f:
                    f.write(text_content)
                
                print(f"Convertido: '{filename}' -> '{txt_filename}'")
                converted_count += 1
            except Exception as e:
                print(f"Error al procesar '{filename}': {e}")
    
    if converted_count == 0:
        print(f"No se encontraron archivos .docx en '{input_dir}'. Asegúrate de que tus documentos estén allí.")
    else:
        print(f"\nProceso de conversión completado. Se convirtieron {converted_count} archivos.")
        print(f"Los archivos .txt se encuentran en: {output_dir}")

if __name__ == "__main__":
    # Carpeta donde están los .docx y donde se guardarán los .txt
    carpeta = r"C:\Users\AGUILAR\Downloads\COMUNICACIOJ"
    convert_docx_to_txt(carpeta, carpeta)
