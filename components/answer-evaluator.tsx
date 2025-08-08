'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Evaluation {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  grade: 'excellent' | 'good' | 'fair' | 'poor'
}

export default function AnswerEvaluator() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [question, setQuestion] = useState('')
  const [studentAnswer, setStudentAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
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

  const sampleQuestions = {
    'La Ciencia': [
      '¿Qué es la ciencia y cuáles son sus características principales?',
      'Explica la diferencia entre ciencia pura y ciencia aplicada.',
      '¿Cuál es la importancia de la ciencia en el desarrollo de la sociedad?'
    ],
    'Método Científico': [
      '¿Cuáles son los pasos del método científico y por qué es importante seguirlos?',
      'Explica la diferencia entre hipótesis y teoría científica.',
      '¿Cómo se puede garantizar la objetividad en una investigación científica?'
    ],
    'Biotecnología': [
      '¿Qué es la biotecnología y cuáles son sus principales aplicaciones?',
      'Explica los beneficios y riesgos de la biotecnología moderna.',
      '¿Cómo contribuye la biotecnología al desarrollo sostenible?'
    ],
    'Materiales de Laboratorio': [
      '¿Cuáles son los materiales básicos de un laboratorio de ciencias?',
      'Explica las medidas de seguridad que se deben seguir en el laboratorio.',
      '¿Cómo se debe manipular correctamente el material de vidrio?'
    ]
  }

  const handleEvaluateAnswer = async () => {
    if (!selectedTopic || !question || !studentAnswer) {
      setError('Por favor completa todos los campos')
      return
    }

    setIsEvaluating(true)
    setError('')
    
    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: selectedTopic,
          question,
          answer: studentAnswer
        }),
      })

      if (!response.ok) {
        throw new Error('Error al evaluar la respuesta')
      }

      const data = await response.json()
      setEvaluation(data.evaluation)
    } catch (err) {
      setError('Error al evaluar la respuesta. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsEvaluating(false)
    }
  }

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'fair':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'poor':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Evaluador de Respuestas
          </CardTitle>
          <CardDescription>
            Obtén retroalimentación automática y detallada sobre respuestas abiertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <label className="text-sm font-medium mb-2 block">Pregunta</label>
            <Textarea
              placeholder="Escribe la pregunta que quieres evaluar..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
            {selectedTopic && sampleQuestions[selectedTopic as keyof typeof sampleQuestions] && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">Preguntas de ejemplo:</p>
                <div className="space-y-1">
                  {sampleQuestions[selectedTopic as keyof typeof sampleQuestions].map((q, index) => (
                    <button
                      key={index}
                      onClick={() => setQuestion(q)}
                      className="text-xs text-blue-600 hover:text-blue-800 block text-left"
                    >
                      • {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Respuesta del Estudiante</label>
            <Textarea
              placeholder="Pega aquí la respuesta del estudiante para evaluar..."
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              rows={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={handleEvaluateAnswer} 
            disabled={isEvaluating || !selectedTopic || !question || !studentAnswer}
            className="w-full"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Evaluando respuesta...
              </>
            ) : (
              'Evaluar Respuesta'
            )}
          </Button>
        </CardContent>
      </Card>

      {evaluation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Evaluación de la Respuesta</CardTitle>
              <div className="flex items-center gap-2">
                {getGradeIcon(evaluation.grade)}
                <Badge className={getGradeColor(evaluation.grade)}>
                  {evaluation.score}/100 puntos
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Retroalimentación General</h3>
              <p className="text-gray-700 leading-relaxed">
                {evaluation.feedback}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Fortalezas Identificadas
                </h3>
                <ul className="space-y-2">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm text-green-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-orange-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Áreas de Mejora
                </h3>
                <ul className="space-y-2">
                  {evaluation.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-sm text-orange-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-blue-800">Sugerencias para Mejorar</h3>
              <ul className="space-y-2">
                {evaluation.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm text-blue-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
