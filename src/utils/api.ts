import request from './request'
import useStore from '@/stores'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export const chatCompletion = async (messages: ChatMessage[]) => {
  const store = useStore()
  const { apiKey, baseUrl, model, temperature, maxTokens } = store.top.aiConfig

  return request({
    url: `${baseUrl}/v1/chat/completions`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: {
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    }
  })
}