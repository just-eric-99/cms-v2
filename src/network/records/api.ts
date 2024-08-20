import { API_ENDPOINT } from '@/constants/network.ts'
import { Record, RecordDetails } from '@/network/records/types.ts'

export async function getAllRecords(): Promise<Record[]> {
  // to add take and skip when implementing server side pagination
  const records = await fetch(API_ENDPOINT + '/user-exercise')
  return records.json()
}

export async function getRecordById(id: string): Promise<RecordDetails> {
  const record = await fetch(API_ENDPOINT + `/user-exercise/${id}`)
  return record.json()
}

export async function getVideoByUserExerciseId(id: string) {
  const response = await fetch(
    `${API_ENDPOINT}/user-exercise/record/${id}/download`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message ?? 'No such video found')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}
