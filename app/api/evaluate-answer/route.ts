import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function POST(request: NextRequest) {
  try {
    const { topic, question, answer } = await request.json()

    const prompt = `Eres un profesor experto en Ciencia, Tecnología y Ambiente (CTA) de educación secundaria.

Evalúa la siguiente respuesta de un estudiante basándote en los conocimientos estándar del currículo de CTA:

TEMA: ${topic}
PREGUNTA: ${question}
RESPUESTA DEL ESTUDIANTE: ${answer}

Proporciona una evaluación detallada que incluya:
1. Puntuación del 0 al 100 basada en precisión, completitud y comprensión
2. Retroalimentación constructiva específica para el nivel de secundaria
3. Fortalezas identificadas en la respuesta
4. Áreas que necesitan mejora
5. Sugerencias específicas para mejorar
6. Clasificación general (excellent/good/fair/poor)

Responde en formato JSON con esta estructura:
{
  "score": número del 0 al 100,
  "feedback": "retroalimentación general detallada y constructiva",
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["área de mejora 1", "área de mejora 2"],
  "suggestions": ["sugerencia específica 1", "sugerencia específica 2", "sugerencia específica 3"],
  "grade": "excellent|good|fair|poor"
}`

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
    })

    const text = completion.choices[0]?.message?.content || ''
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
