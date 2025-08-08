'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

interface ProgressAnalysis {
  studentName: string
  overallProgress: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  topicPerformance: {
    topic: string
    score: number
    status: 'excellent' | 'good' | 'needs_improvement' | 'critical'
  }[]
  nextSteps: string[]
}

export default function ProgressAnalyzer() {
  const [studentData, setStudentData] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ProgressAnalysis | null>(null)
  const [error, setError] = useState('')

  const sampleData = `Estudiante: María González
Actividades completadas:
- Método Científico: 85/100 (Quiz completado, ensayo entregado)
- Ecosistemas: 72/100 (Quiz completado, proyecto pendiente)
- Cambio Climático: 90/100 (Todas las actividades completadas)
- Energías Renovables: 45/100 (Solo quiz completado)

Tiempo en plataforma: 15 horas
Última conexión: Hace 2 días
Participación en foros: 8 mensajes`

  const handleAnalyzeProgress = async () => {
    if (!studentData.trim()) {
      setError('Por favor ingresa los datos del estudiante')
      return
    }

    setIsAnalyzing(true)
    setError('')
    
    try {
      const response = await fetch('/api/analyze-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentData: studentData
        }),
      })

      if (!response.ok) {
        throw new Error('Error al analizar el progreso')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError('Error al analizar el progreso. Inténtalo de nuevo.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'good':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'needs_improvement':
        return <TrendingDown className="w-4 h-4 text-yellow-600" />
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'needs_improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excelente'
      case 'good':
        return 'Bueno'
      case 'needs_improvement':
        return 'Necesita Mejora'
      case 'critical':
        return 'Crítico'
      default:
        return 'N/A'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analizador de Progreso
          </CardTitle>
          <CardDescription>
            Analiza el progreso del estudiante y genera recomendaciones personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Datos del Estudiante (logs de Chamilo, calificaciones, actividades)
            </label>
            <Textarea
              placeholder="Pega aquí los datos exportados de Chamilo o información del estudiante..."
              value={studentData}
              onChange={(e) => setStudentData(e.target.value)}
              rows={8}
            />
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentData(sampleData)}
              >
                Usar datos de ejemplo
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={handleAnalyzeProgress} 
            disabled={isAnalyzing || !studentData.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analizando progreso...
              </>
            ) : (
              'Analizar Progreso'
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Resumen General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Análisis de Progreso - {analysis.studentName}</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {analysis.overallProgress}% Progreso General
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${analysis.overallProgress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Rendimiento por Tema */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.topicPerformance.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(topic.status)}
                      <span className="font-medium">{topic.topic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{topic.score}/100</span>
                      <Badge className={`text-xs ${getStatusColor(topic.status)}`}>
                        {getStatusLabel(topic.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fortalezas y Debilidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Fortalezas Identificadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  Áreas de Mejora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones Personalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-sm text-blue-800">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Próximos Pasos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos Sugeridos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
