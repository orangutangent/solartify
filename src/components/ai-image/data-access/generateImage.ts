export async function generateImage(prompt: string): Promise<string> {
  const res = await fetch(process.env.NEXT_PUBLIC_GENERATOR_URL!, {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  })
  return res.text()
}
