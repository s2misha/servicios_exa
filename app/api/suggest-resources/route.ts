import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenRouter } from '@ai-sdk/openrouter'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topic, level, resourceType } = await request.json()

    const prompt = `Eres un experto en educación de Ciencia, Tecnología y Ambiente (CTA).

Sugiere recursos educativos adicionales para el tema "${topic}" con estas especificaciones:
- Nivel del estudiante: ${level}
- Tipo de recurso preferido: ${resourceType === 'all' ? 'cualquier tipo' : resourceType}
- Audiencia: Estudiantes de educación secundaria

Para cada recurso incluye:
1. Tipo (reading/video/activity/website/document)
2. Título descriptivo
3. Descripción del contenido
4. URL (si es un recurso real conocido) o "Buscar en línea: [términos de búsqueda]"
5. Nivel de dificultad (basic/intermediate/advanced)
6. Tiempo estimado de estudio

Responde en formato JSON con esta estructura:
{
  "topic": "${topic}",
  "resources": [
    {
      "type": "reading|video|activity|website|document",
      "title": "título del recurso",
      "description": "descripción detallada",
      "url": "URL o instrucciones de búsqueda",
      "difficulty": "basic|intermediate|advanced",
      "estimatedTime": "tiempo estimado"
    }
  ],
  "additionalNotes": "notas adicionales sobre cómo usar estos recursos"
}`

    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.7,
    })

    const suggestion = JSON.parse(text)

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('Error suggesting resources:', error)
    return NextResponse.json(
      { error: 'Error al generar sugerencias' },
      { status: 500 }
    )
  }
}
