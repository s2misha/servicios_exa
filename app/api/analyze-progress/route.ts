import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenRouter } from '@ai-sdk/openrouter'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { studentData } = await request.json()

    const prompt = `Eres un experto en análisis educativo y pedagogía para Ciencia, Tecnología y Ambiente (CTA).

Analiza los siguientes datos del estudiante y genera un informe de progreso detallado:

DATOS DEL ESTUDIANTE:
${studentData}

Proporciona un análisis completo que incluya:
1. Progreso general (porcentaje del 0 al 100)
2. Fortalezas identificadas
3. Debilidades o áreas problemáticas
4. Recomendaciones específicas para mejorar
5. Rendimiento por tema (con puntuación y estado)
6. Próximos pasos sugeridos

Responde en formato JSON con esta estructura:
{
  "studentName": "nombre extraído de los datos o 'Estudiante'",
  "overallProgress": número del 0 al 100,
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "weaknesses": ["debilidad 1", "debilidad 2"],
  "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"],
  "topicPerformance": [
    {
      "topic": "nombre del tema",
      "score": puntuación del 0 al 100,
      "status": "excellent|good|needs_improvement|critical"
    }
  ],
  "nextSteps": ["paso 1", "paso 2", "paso 3"]
}`

    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.5,
    })

    const analysis = JSON.parse(text)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing progress:', error)
    return NextResponse.json(
      { error: 'Error al analizar el progreso' },
      { status: 500 }
    )
  }
}
