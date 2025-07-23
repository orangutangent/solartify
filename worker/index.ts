/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-anonymous-default-export */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// A simple function to convert ArrayBuffer to Base64
// function arrayBufferToBase64(buffer: ArrayBuffer): string {
//   let binary = ''
//   const bytes = new Uint8Array(buffer)
//   const len = bytes.byteLength
//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i])
//   }
//   return btoa(binary)
// }

export default {
  async fetch(request: Request, env: { AI: any }): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    if (request.method !== 'POST') {
      return new Response('Expected POST', { status: 405 })
    }

    try {
      const { prompt: userPrompt } = await request.json()
      if (!userPrompt) {
        return new Response('Missing prompt in request body', { status: 400, headers: corsHeaders })
      }

      const prompt = `NFT art, ${userPrompt}`
      const model = '@cf/black-forest-labs/flux-1-schnell'
      const inputs = { prompt }
      const aiResponse = await env.AI.run(model, inputs)

      // const base64Image = arrayBufferToBase64(aiResponse)
      const dataUrl = `data:image/jpeg;base64,${aiResponse.image}`

      const responseHeaders = {
        ...corsHeaders,
        'Content-Type': 'text/plain', // The response is now a text string (the Data URL)
      }

      return new Response(dataUrl, {
        headers: responseHeaders,
      })
    } catch (e) {
      console.error('Error generating image:', e)
      const errorMessage = e instanceof Error ? e.message : String(e)
      return new Response(`Error: ${errorMessage}`, { status: 500, headers: corsHeaders })
    }
  },
}
