import { API_ENDPOINT } from '@/constants/network.ts'
import { GenerateVoiceRequest, GenerateVoiceResponse } from '@/network/text-to-speech/types.ts'

export async function getVoice(filename: string) {
  const response = await fetch(`${API_ENDPOINT}?filename=${filename}`);

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'No such voice found')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export async function generateVoice(generateVoiceRequest: GenerateVoiceRequest): Promise<GenerateVoiceResponse> {
  const response = await fetch(API_ENDPOINT + '/generateVoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(generateVoiceRequest),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'Failed to generate voice')
  }

  return response.json()
}
