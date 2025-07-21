export async function generateImage(prompt: string): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
  return res.text()
}
