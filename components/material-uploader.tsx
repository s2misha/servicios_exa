'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, RefreshCw, FolderOpen, CheckCircle } from 'lucide-react'

interface Material {
  id: string
  title: string
  topic: string
  content: string
  filename: string
  uploadDate: string
}

export default function MaterialUploader() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadMaterials = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/load-materials')
      if (!response.ok) {
        throw new Error('Error al cargar los materiales')
      }
      
      const data = await response.json()
      setMaterials(data.materials)
    } catch (err) {
      setError('Error al cargar los materiales. Asegúrate de que los archivos estén en la carpeta correcta.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Instrucciones */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FolderOpen className="w-5 h-5" />
            Instrucciones para Cargar Material
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-3">
            <p><strong>Carpeta de materiales:</strong> <code className="bg-blue-100 px-2 py-1 rounded">data/cta-materials/</code></p>
            <p>Sube tus archivos .txt a esta carpeta en la raíz del proyecto:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>LA CIENCIA MÓDULO N° 01.txt</li>
              <li>METODO CIENTIFICO 1°.txt</li>
              <li>CAMPOS DE APLICACIÓN DEL MÉTODO CIENTÍFICO.txt</li>
              <li>PERSONAJES DE CIENCIA N°02.txt</li>
              <li>BIOTECNOLOGIA N°03.txt</li>
              <li>EL CONOCIMIENTO CIENTIFICO Y EMPIRICO N°04.txt</li>
              <li>MATERIALES DE LABORATORIO PRIMER AÑO.txt</li>
              <li>EL MÉTODO CIENTÍFICO- LA PENICILINA.txt</li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Nota:</strong> Después de subir los archivos, haz clic en "Recargar Materiales" para actualizar la lista.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Material del Curso CTA ({materials.length} archivos cargados)
          </CardTitle>
          <CardDescription>
            Material disponible para generar cuestionarios, resúmenes y otras actividades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={loadMaterials}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Cargando materiales...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recargar Materiales
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de materiales */}
      <Card>
        <CardHeader>
          <CardTitle>Archivos Detectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.length > 0 ? (
              materials.map((material) => (
                <div key={material.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">{material.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {material.filename}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {material.topic}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {material.content.length > 200 
                      ? `${material.content.substring(0, 200)}...` 
                      : material.content
                    }
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Caracteres: {material.content.length.toLocaleString()}</span>
                    <span>Cargado: {new Date(material.uploadDate).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No se encontraron archivos</p>
                <p className="text-sm">Sube los archivos .txt a la carpeta <code>data/cta-materials/</code></p>
                <p className="text-sm mt-2">Luego haz clic en "Recargar Materiales"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas del Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{materials.length}</div>
                <div className="text-sm text-blue-800">Archivos</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(materials.map(m => m.topic)).size}
                </div>
                <div className="text-sm text-green-800">Temas</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(materials.reduce((acc, m) => acc + m.content.length, 0) / 1000)}K
                </div>
                <div className="text-sm text-purple-800">Caracteres</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(materials.reduce((acc, m) => acc + m.content.split(' ').length, 0) / 1000)}K
                </div>
                <div className="text-sm text-orange-800">Palabras</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
