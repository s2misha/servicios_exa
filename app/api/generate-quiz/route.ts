import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenRouter } from '@ai-sdk/openrouter'
import { getMaterialByTopic } from '@/lib/material-loader'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topic, questionCount, questionTypes } = await request.json()

    // Obtener el material específico del tema
    const materialContent = getMaterialByTopic(topic)
    
    if (!materialContent) {
      return NextResponse.json(
        { error: `No se encontró material para el tema: ${topic}` },
        { status: 404 }
      )
    }

    const prompt = `Eres un experto profesor de Ciencia, Tecnología y Ambiente (CTA) de educación secundaria.

Basándote ÚNICAMENTE en el siguiente material del curso, genera un cuestionario sobre "${topic}":

MATERIAL DEL CURSO:
${materialContent}

Especificaciones del cuestionario:
- Número de preguntas: ${questionCount}
- Tipo de preguntas: ${questionTypes === 'mixed' ? 'mixto (opción múltiple, verdadero/falso y abiertas)' : questionTypes}

IMPORTANTE: 
- Todas las preguntas deben basarse estrictamente en el contenido proporcionado
- No agregues información que no esté en el material
- Las respuestas correctas deben estar claramente respaldadas por el texto

Para cada pregunta incluye:
1. La pregunta claramente formulada
2. Si es opción múltiple: 4 opciones (a, b, c, d) con una correcta
3. Si es verdadero/falso: la respuesta correcta
4. Una explicación breve citando la parte relevante del material

Responde en formato JSON con esta estructura:
{
  "title": "Cuestionario: ${topic}",
  "topic": "${topic}",
  "questions": [
    {
      "type": "multiple|boolean|open",
      "question": "texto de la pregunta",
      "options": ["opción a", "opción b", "opción c", "opción d"], // solo para multiple
      "correctAnswer": "respuesta correcta",
      "explanation": "explicación basada en el material"
    }
  ]
}`

    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.7,
    })

    const quiz = JSON.parse(text)

    return NextResponse.json({ quiz })
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json(
      { error: 'Error al generar el cuestionario' },
      { status: 500 }
    )
  }
}
