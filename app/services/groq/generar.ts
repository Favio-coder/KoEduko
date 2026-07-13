import Groq from 'groq-sdk'

export async function generarConGroq(
  apiKey: string,
  prompt: string
): Promise<string> {
  const groq = new Groq({ apiKey })

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 8192,
  })

  return completion.choices[0]?.message?.content ?? ''
}
