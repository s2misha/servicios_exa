import fs from 'fs'
import path from 'path'

export interface MaterialFile {
  id: string
  title: string
  topic: string
  filename: string
  uploadDate: string
  hasContent: boolean
}

// Mapeo de archivos a temas (basado en tus archivos)
const fileTopicMapping: Record<string, string> = {
  'BIOTECNOLOGIA  N°03.txt': 'Biotecnología',
  'CAMPOS  DE APLICACIÓN  DEL MÉTODO CIENTÍFICO.txt': 'Campos de Aplicación del Método Científico',
  'EL CONOCIMIENTO CIENTIFICO Y EMPIRICO N°04.txt': 'El Conocimiento Científico y Empírico',
  'EL MÉTODO CIENTÍFICO- LA PENICILINA.txt': 'El Método Científico - La Penicilina',
  'LA CIENCIA MÓDULO  N° 01.txt': 'La Ciencia',
  'MATERIALES DE LABORATORIO PRIMER AÑO.txt': 'Materiales de Laboratorio',
  'METODO CIENTIFICO   1°.txt': 'Método Científico',
  'PERSONAJES DE CIENCIA   N°02.txt': 'Personajes de Ciencia'
}

export function loadMaterialFiles(): MaterialFile[] {
  const materialsPath = path.join(process.cwd(), 'data', 'cta-materials')

  try {
    // Verificar si existe el directorio
    if (!fs.existsSync(materialsPath)) {
      console.log('Directorio de materiales no encontrado:', materialsPath)
      return []
    }

    const files = fs.readdirSync(materialsPath)
    const txtFiles = files.filter(file => file.endsWith('.txt'))
    
    const materials: MaterialFile[] = txtFiles.map((filename, index) => {
      const filePath = path.join(materialsPath, filename)
      const hasContent = fs.existsSync(filePath)
      
      // Obtener el tema basado en el nombre del archivo
      const topic = fileTopicMapping[filename] || 'Tema General'
      
      // Generar título limpio
      const title = filename
        .replace('.txt', '')
        .replace(/N°\d+/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      return {
        id: `material-${index + 1}`,
        title,
        topic,
        filename,
        uploadDate: new Date().toISOString().split('T')[0],
        hasContent
      }
    })

    return materials
  } catch (error) {
    console.error('Error loading material files:', error)
    return []
  }
}

export function getAllTopics(): string[] {
  const materials = loadMaterialFiles()
  return [...new Set(materials.map(m => m.topic))]
}

// Esta función ya no lee el contenido para ahorrar tokens
export function getTopicExists(topic: string): boolean {
  const materials = loadMaterialFiles()
  return materials.some(m => m.topic === topic)
}
