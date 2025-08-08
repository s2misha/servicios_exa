import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function POST(request: NextRequest) {
  try {
    const { topic, length } = await request.json()

    const lengthInstructions = {
      short: '1-2 párrafos concisos',
      medium: '3-4 párrafos detallados',
      long: '5 o más párrafos extensos y completos'
    }

    const prompt = `Eres un experto profesor de Ciencia, Tecnología y Ambiente (CTA) de educación secundaria.

Genera un resumen estructurado sobre "${topic}" basándote en el currículo estándar de CTA para educación secundaria.

Especificaciones del resumen:
- Extensión: ${lengthInstructions[length as keyof typeof lengthInstructions]}
- Nivel: Educación secundaria
- Enfoque: Claro, educativo y fácil de entender

El resumen debe incluir:
1. Los conceptos fundamentales del tema
2. Los puntos clave más importantes
3. Los conceptos técnicos relevantes explicados de forma clara

Responde en formato JSON con esta estructura:
{
  "title": "Resumen: ${topic}",
  "topic": "${topic}",
  "content": "texto del resumen completo",
  "keyPoints": ["punto clave 1", "punto clave 2", "punto clave 3"],
  "concepts": ["concepto importante 1", "concepto importante 2", "concepto importante 3"]
}`

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
    })

    const text = completion.choices[0]?.message?.content || ''
    const summary = JSON.parse(text)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Error al generar el resumen' },
      { status: 500 }
    )
  }
}
