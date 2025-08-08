'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Lightbulb, ExternalLink, BookOpen, Video, FileText, Globe } from 'lucide-react'

interface Resource {
  type: 'reading' | 'video' | 'activity' | 'website' | 'document'
  title: string
  description: string
  url?: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  estimatedTime: string
}

interface ResourceSuggestion {
  topic: string
  resources: Resource[]
  additionalNotes: string
}

export default function ResourceSuggester() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [studentLevel, setStudentLevel] = useState('intermediate')
  const [resourceType, setResourceType] = useState('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState<ResourceSuggestion | null>(null)
  const [error, setError] = useState('')

  const topics = [
    'La Ciencia',
    'Método Científico',
    'Campos de Aplicación del Método Científico',
    'Personajes de Ciencia',
    'Biotecnología',
    'El Conocimiento Científico y Empírico',
    'Materiales de Laboratorio',
    'El Método Científico - La Penicilina'
  ]

  const handleGenerateSuggestions = async () => {
    if (!selectedTopic) {
      setError('Por favor selecciona un tema')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const response = await fetch('/api/suggest-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          level: studentLevel,
          resourceType
        }),
      })

      if (!response.ok) {
        throw new Error('Error al generar sugerencias')
      }

      const data = await response.json()
      setSuggestion(data.suggestion)
    } catch (err) {
      setError('Error al generar sugerencias. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <BookOpen className="w-4 h-4" />
      case 'video':
        return <Video className="w-4 h-4" />
      case 'activity':
        return <FileText className="w-4 h-4" />
      case 'website':
        return <Globe className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'reading':
        return 'Lectura'
      case 'video':
        return 'Video'
      case 'activity':
        return 'Actividad'
      case 'website':
        return 'Sitio Web'
      case 'document':
        return 'Documento'
      default:
        return 'Recurso'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'basic':
        return 'Básico'
      case 'intermediate':
        return 'Intermedio'
      case 'advanced':
        return 'Avanzado'
      default:
        return 'N/A'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Sugerencias de Recursos
          </CardTitle>
          <CardDescription>
            Obtén recomendaciones personalizadas de recursos adicionales para complementar el aprendizaje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tema del Curso</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tema" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nivel del Estudiante</label>
              <Select value={studentLevel} onValueChange={setStudentLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Recurso</label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="reading">Lecturas</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="activity">Actividades</SelectItem>
                  <SelectItem value="website">Sitios web</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={handleGenerateSuggestions} 
            disabled={isGenerating || !selectedTopic}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando sugerencias...
              </>
            ) : (
              'Generar Sugerencias'
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestion && (
        <Card>
          <CardHeader>
            <CardTitle>Recursos Recomendados</CardTitle>
            <CardDescription>Tema: {suggestion.topic}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestion.additionalNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-800">Notas Adicionales</h3>
                <p className="text-sm text-blue-700">{suggestion.additionalNotes}</p>
              </div>
            )}

            <div className="grid gap-4">
              {suggestion.resources.map((resource, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <h3 className="font-semibold">{resource.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getResourceTypeLabel(resource.type)}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                          {getDifficultyLabel(resource.difficulty)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Tiempo estimado: {resource.estimatedTime}
                      </span>
                      {resource.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Acceder
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
