import fs from 'fs'
import path from 'path'

export interface MaterialFile {
  id: string
  title: string
  topic: string
  content: string
  filename: string
  uploadDate: string
}

// Mapeo de archivos a temas
const fileTopicMapping: Record<string, string> = {
  'LA CIENCIA MÓDULO  N° 01.txt': 'La Ciencia',
  'METODO CIENTIFICO   1°.txt': 'Método Científico',
  'CAMPOS  DE APLICACIÓN  DEL MÉTODO CIENTÍFICO.txt': 'Campos de Aplicación del Método Científico',
  'PERSONAJES DE CIENCIA   N°02.txt': 'Personajes de Ciencia',
  'BIOTECNOLOGIA  N°03.txt': 'Biotecnología',
  'EL CONOCIMIENTO CIENTIFICO Y EMPIRICO N°04.txt': 'El Conocimiento Científico y Empírico',
  'MATERIALES DE LABORATORIO PRIMER AÑO.txt': 'Materiales de Laboratorio',
  'EL MÉTODO CIENTÍFICO- LA PENICILINA.txt': 'El Método Científico - La Penicilina'
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
      const content = fs.readFileSync(filePath, 'utf-8')
      
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
        content: content.trim(),
        filename,
        uploadDate: new Date().toISOString().split('T')[0]
      }
    })

    return materials
  } catch (error) {
    console.error('Error loading material files:', error)
    return []
  }
}

export function getMaterialByTopic(topic: string): string {
  const materials = loadMaterialFiles()
  const material = materials.find(m => m.topic === topic)
  return material ? material.content : ''
}

export function getAllTopics(): string[] {
  const materials = loadMaterialFiles()
  return [...new Set(materials.map(m => m.topic))]
}
