import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function POST(request: Request) {
  const { prompt: userPrompt } = await request.json()
  const { AI } = getRequestContext().env

  const prompt = `NFT art, ${userPrompt}`

  const model = '@cf/black-forest-labs/flux-1-schnell'
  const inputs = { prompt }
  const response = await AI.run(model, inputs)

  for (const [key, value] of Object.entries(response)) {
    if (typeof value === 'string') {
      response[key] = value.replace(/\n/g, '<br>')
      console.log(key)
    }
  }

  return new Response(`data:image/jpeg;base64,${response.image}`, {
    headers: { 'Content-Type': 'image/jpeg' },
  })
}
