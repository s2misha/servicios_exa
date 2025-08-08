import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenRouter } from '@ai-sdk/openrouter'
import { getMaterialByTopic } from '@/lib/material-loader'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topic, length } = await request.json()

    // Obtener el material específico del tema
    const materialContent = getMaterialByTopic(topic)
    
    if (!materialContent) {
      return NextResponse.json(
        { error: `No se encontró material para el tema: ${topic}` },
        { status: 404 }
      )
    }

    const lengthInstructions = {
      short: '1-2 párrafos concisos',
      medium: '3-4 párrafos detallados',
      long: '5 o más párrafos extensos y completos'
    }

    const prompt = `Eres un experto profesor de Ciencia, Tecnología y Ambiente (CTA) de educación secundaria.

Basándote ÚNICAMENTE en el siguiente material del curso, genera un resumen estructurado sobre "${topic}":

MATERIAL DEL CURSO:
${materialContent}

Especificaciones del resumen:
- Extensión: ${lengthInstructions[length as keyof typeof lengthInstructions]}
- Nivel: Educación secundaria
- Enfoque: Claro, educativo y fácil de entender

IMPORTANTE:
- Usa únicamente la información del material proporcionado
- No agregues información externa
- Mantén la terminología y conceptos del material original

El resumen debe incluir:
1. Los conceptos fundamentales del material
2. Los puntos clave más importantes mencionados
3. Los conceptos técnicos relevantes explicados en el texto

Responde en formato JSON con esta estructura:
{
  "title": "Resumen: ${topic}",
  "topic": "${topic}",
  "content": "texto del resumen completo basado en el material",
  "keyPoints": ["punto clave 1 del material", "punto clave 2 del material", "punto clave 3 del material"],
  "concepts": ["concepto importante 1", "concepto importante 2", "concepto importante 3"]
}`

    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.6,
    })

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
