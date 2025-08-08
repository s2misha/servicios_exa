'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Download, BookOpen } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface Summary {
  title: string
  topic: string
  content: string
  keyPoints: string[]
  concepts: string[]
}

export default function SummaryGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [summaryLength, setSummaryLength] = useState('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
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

  const handleGenerateSummary = async () => {
    if (!selectedTopic) {
      setError('Por favor selecciona un tema')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          length: summaryLength
        }),
      })

      if (!response.ok) {
        throw new Error('Error al generar el resumen')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      setError('Error al generar el resumen. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportSummary = () => {
    if (!summary) return
    
    const summaryText = `# ${summary.title}\n\n## Resumen\n\n${summary.content}\n\n## Puntos Clave\n\n${summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\n## Conceptos Importantes\n\n${summary.concepts.map(concept => `• ${concept}`).join('\n')}`

    const blob = new Blob([summaryText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumen-${selectedTopic.toLowerCase().replace(/\s+/g, '-')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Generador de Resúmenes
          </CardTitle>
          <CardDescription>
            Genera resúmenes estructurados y claros de los temas del curso CTA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="text-sm font-medium mb-2 block">Extensión del Resumen</label>
              <Select value={summaryLength} onValueChange={setSummaryLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Corto (1-2 párrafos)</SelectItem>
                  <SelectItem value="medium">Medio (3-4 párrafos)</SelectItem>
                  <SelectItem value="long">Extenso (5+ párrafos)</SelectItem>
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
            onClick={handleGenerateSummary} 
            disabled={isGenerating || !selectedTopic}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando resumen...
              </>
            ) : (
              'Generar Resumen'
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{summary.title}</CardTitle>
              <CardDescription>Tema: {summary.topic}</CardDescription>
            </div>
            <Button onClick={exportSummary} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Resumen</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {summary.content}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-blue-800">Puntos Clave</h3>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm text-blue-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-green-800">Conceptos Importantes</h3>
                  <ul className="space-y-2">
                    {summary.concepts.map((concept, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-sm text-green-700">{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
