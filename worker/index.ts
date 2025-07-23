
export default {
  async fetch(request: Request, env: { AI: any }) {
    if (request.method !== 'POST') {
      return new Response('Expected POST', { status: 405 });
    }

    try {
      const { prompt: userPrompt } = await request.json();
      if (!userPrompt) {
        return new Response('Missing prompt in request body', { status: 400 });
      }

      const prompt = `NFT art, ${userPrompt}`;
      const model = '@cf/black-forest-labs/flux-1-schnell';
      const inputs = { prompt };
      const response = await env.AI.run(model, inputs);

      return new Response(response.image, {
        headers: { 'Content-Type': 'image/jpeg' },
      });
    } catch (e) {
      console.error('Error generating image:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      return new Response(`Error: ${errorMessage}`, { status: 500 });
    }
  },
};
