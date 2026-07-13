import Groq from 'groq-sdk'

export default defineEventHandler(async (event) => {
  const { apiKey } = useRuntimeConfig()

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'API Key de Groq no configurada en el servidor' })
  }

  const { prompt } = await readBody(event)
  if (!prompt) {
    throw createError({ statusCode: 400, message: 'prompt is required' })
  }

  const groq = new Groq({ apiKey })

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 8192,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw createError({ statusCode: 502, message: 'La IA no generó ningún contenido' })
    }

    return content
  } catch (e: any) {
    console.error('Error en Groq API:', e)
    throw createError({
      statusCode: e.status || 502,
      message: e.message || 'Error al comunicarse con la API de Groq',
    })
  }
})
