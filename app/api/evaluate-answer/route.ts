import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { createOpenRouter } from '@ai-sdk/openrouter'
import { getMaterialByTopic } from '@/lib/material-loader'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topic, question, answer } = await request.json()

    // Obtener el material específico del tema como referencia
    const materialContent = getMaterialByTopic(topic)
    
    const prompt = `Eres un profesor experto en Ciencia, Tecnología y Ambiente (CTA) de educación secundaria.

Evalúa la siguiente respuesta de un estudiante usando como referencia el material del curso:

MATERIAL DE REFERENCIA:
${materialContent || 'Material no disponible - evalúa basándote en conocimientos generales de CTA'}

TEMA: ${topic}
PREGUNTA: ${question}
RESPUESTA DEL ESTUDIANTE: ${answer}

Proporciona una evaluación detallada que incluya:
1. Puntuación del 0 al 100 basada en precisión, completitud y comprensión
2. Retroalimentación constructiva específica para el nivel de secundaria
3. Fortalezas identificadas en la respuesta
4. Áreas que necesitan mejora
5. Sugerencias específicas para mejorar, referenciando el material cuando sea posible
6. Clasificación general (excellent/good/fair/poor)

IMPORTANTE: Si hay material de referencia disponible, compara la respuesta con ese contenido específico.

Responde en formato JSON con esta estructura:
{
  "score": número del 0 al 100,
  "feedback": "retroalimentación general detallada y constructiva",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["área de mejora 1", "área de mejora 2"],
  "suggestions": ["sugerencia específica 1", "sugerencia específica 2", "sugerencia específica 3"],
  "grade": "excellent|good|fair|poor"
}`

    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.5,
    })

    const evaluation = JSON.parse(text)

    return NextResponse.json({ evaluation })
  } catch (error) {
    console.error('Error evaluating answer:', error)
    return NextResponse.json(
      { error: 'Error al evaluar la respuesta' },
      { status: 500 }
    )
  }
}
