'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, MessageSquare, Upload } from 'lucide-react'
import QuizGenerator from '@/components/quiz-generator'
import SummaryGenerator from '@/components/summary-generator'
import AnswerEvaluator from '@/components/answer-evaluator'
import MaterialUploader from '@/components/material-uploader'

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

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections = [
    {
      id: 'quiz',
      title: 'Generación de Cuestionarios',
      description: 'Crea cuestionarios automáticos sobre temas de CTA',
      icon: FileText,
      component: QuizGenerator
    },
    {
      id: 'summary',
      title: 'Generación de Resúmenes',
      description: 'Genera resúmenes estructurados de los temas del curso',
      icon: BookOpen,
      component: SummaryGenerator
    },
    {
      id: 'evaluation',
      title: 'Retroalimentación de Respuestas',
      description: 'Evalúa y proporciona comentarios sobre respuestas abiertas',
      icon: MessageSquare,
      component: AnswerEvaluator
    },
    {
      id: 'upload',
      title: 'Gestión de Material',
      description: 'Carga y organiza el material del curso CTA',
      icon: Upload,
      component: MaterialUploader
    }
  ]

  const ActiveComponent = activeSection ? sections.find(s => s.id === activeSection)?.component : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Microservicio IA - Chamilo CTA
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Asistente inteligente para el curso de Ciencia, Tecnología y Ambiente
          </p>
          <Badge variant="secondary" className="text-sm">
            Powered by Mistral 7B via OpenRouter
          </Badge>
        </div>

        {activeSection ? (
          <div className="space-y-4">
            <Button 
              onClick={() => setActiveSection(null)}
              variant="outline"
              className="mb-4"
            >
              ← Volver al Panel Principal
            </Button>
            {ActiveComponent && <ActiveComponent topics={topics} />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card 
                  key={section.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                  onClick={() => setActiveSection(section.id)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="default">
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Integración con Chamilo LMS - Curso CTA</p>
          <p>Desarrollado para optimizar el aprendizaje con IA</p>
        </div>
      </div>
    </div>
  )
}
