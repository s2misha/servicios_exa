'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Download, RefreshCw } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface Question {
  type: 'multiple' | 'boolean' | 'open'
  question: string
  options?: string[]
  correctAnswer?: string | boolean
  explanation?: string
}

interface Quiz {
  title: string
  topic: string
  questions: Question[]
}

export default function QuizGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [questionCount, setQuestionCount] = useState('5')
  const [questionTypes, setQuestionTypes] = useState('mixed')
  const [isGenerating, setIsGenerating] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
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

  const handleGenerateQuiz = async () => {
    if (!selectedTopic) {
      setError('Por favor selecciona un tema')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          questionCount: parseInt(questionCount),
          questionTypes
        }),
      })

      if (!response.ok) {
        throw new Error('Error al generar el cuestionario')
      }

      const data = await response.json()
      setQuiz(data.quiz)
    } catch (err) {
      setError('Error al generar el cuestionario. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportQuiz = () => {
    if (!quiz) return
    
    const quizText = `# ${quiz.title}\n\n${quiz.questions.map((q, i) => {
      let questionText = `## Pregunta ${i + 1}\n${q.question}\n\n`
      
      if (q.type === 'multiple' && q.options) {
        questionText += q.options.map((opt, j) => `${String.fromCharCode(97 + j)}) ${opt}`).join('\n') + '\n\n'
        questionText += `**Respuesta correcta:** ${q.correctAnswer}\n\n`
      } else if (q.type === 'boolean') {
        questionText += `**Respuesta correcta:** ${q.correctAnswer ? 'Verdadero' : 'Falso'}\n\n`
      }
      
      if (q.explanation) {
        questionText += `**Explicación:** ${q.explanation}\n\n`
      }
      
      return questionText
    }).join('---\n\n')}`

    const blob = new Blob([quizText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cuestionario-${selectedTopic.toLowerCase().replace(/\s+/g, '-')}.md`
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
            <RefreshCw className="w-5 h-5" />
            Generador de Cuestionarios
          </CardTitle>
          <CardDescription>
            Genera cuestionarios automáticos basados en el material del curso CTA
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
              <label className="text-sm font-medium mb-2 block">Número de Preguntas</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 preguntas</SelectItem>
                  <SelectItem value="5">5 preguntas</SelectItem>
                  <SelectItem value="10">10 preguntas</SelectItem>
                  <SelectItem value="15">15 preguntas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Preguntas</label>
              <Select value={questionTypes} onValueChange={setQuestionTypes}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixto</SelectItem>
                  <SelectItem value="multiple">Solo opción múltiple</SelectItem>
                  <SelectItem value="boolean">Solo verdadero/falso</SelectItem>
                  <SelectItem value="open">Solo preguntas abiertas</SelectItem>
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
            onClick={handleGenerateQuiz} 
            disabled={isGenerating || !selectedTopic}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando cuestionario...
              </>
            ) : (
              'Generar Cuestionario'
            )}
          </Button>
        </CardContent>
      </Card>

      {quiz && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>Tema: {quiz.topic}</CardDescription>
            </div>
            <Button onClick={exportQuiz} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {question.type === 'multiple' ? 'Opción Múltiple' : 
                     question.type === 'boolean' ? 'V/F' : 'Abierta'}
                  </Badge>
                  <span className="text-sm font-medium">Pregunta {index + 1}</span>
                </div>
                
                <p className="font-medium mb-3">{question.question}</p>
                
                {question.type === 'multiple' && question.options && (
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="text-sm font-medium w-6">
                          {String.fromCharCode(97 + optIndex)})
                        </span>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.correctAnswer && (
                  <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                    <span className="text-sm font-medium text-green-800">
                      Respuesta correcta: {question.correctAnswer.toString()}
                    </span>
                  </div>
                )}
                
                {question.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                    <span className="text-sm text-blue-800">
                      <strong>Explicación:</strong> {question.explanation}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
