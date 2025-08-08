import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function POST(request: NextRequest) {
  try {
    const { topic, questionCount, questionTypes } = await request.json()

    const prompt = `Eres un experto profesor de Ciencia, Tecnología y Ambiente (CTA) de educación secundaria.

Genera un cuestionario sobre "${topic}" basándote en el currículo estándar de CTA para educación secundaria.

Especificaciones del cuestionario:
- Número de preguntas: ${questionCount}
- Tipo de preguntas: ${questionTypes === 'mixed' ? 'mixto (opción múltiple, verdadero/falso y abiertas)' : questionTypes}

El cuestionario debe cubrir los conceptos fundamentales del tema según el currículo de CTA.

Para cada pregunta incluye:
1. La pregunta claramente formulada
2. Si es opción múltiple: 4 opciones (a, b, c, d) con una correcta
3. Si es verdadero/falso: la respuesta correcta
4. Una explicación breve del concepto

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
      "explanation": "explicación del concepto"
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const text = completion.choices[0]?.message?.content || ''
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
