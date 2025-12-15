<template>
  <div class="q-pa-md full-height">
    <q-card class="chat-container">
      <!-- 工具栏 -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('aiChat.title') }}</div>
        <q-space />
        <q-btn flat round dense icon="delete" @click="clearChat">
          <q-tooltip>{{ $t('aiChat.toolbar.clearChat') }}</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="add" @click="newChat">
          <q-tooltip>{{ $t('aiChat.toolbar.newChat') }}</q-tooltip>
        </q-btn>
      </q-card-section>

      <!-- 聊天记录区域 -->
      <q-card-section class="messages-container" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="msg.role">
          <div class="avatar">
            <q-avatar :color="msg.role === 'user' ? 'primary' : 'secondary'" text-color="white">
              <q-icon :name="msg.role === 'user' ? 'person' : 'smart_toy'" />
            </q-avatar>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(msg.content)"></div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
      </q-card-section>

      <!-- 输入区域 -->
      <q-card-section class="input-container q-pa-md">
        <q-input v-model="inputMessage" type="textarea" :placeholder="$t('aiChat.inputPlaceholder')" outlined dense
          autogrow :disable="loading || !store.top.aiConfig.enabled" @keypress.enter.prevent="sendMessage">
          <template v-slot:after>
            <q-btn round flat color="primary" icon="send" :loading="loading" :disable="!store.top.aiConfig.enabled"
              @click="sendMessage" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'
import useStore from '@/stores'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { chatCompletion, type ChatMessage } from '@/utils/api'
import MarkdownIt from 'markdown-it'
const { proxy } = getCurrentInstance() as any

const md = new MarkdownIt()
const store = useStore()
const $q = useQuasar()
const router = useRouter()

const inputMessage = ref('')
const loading = ref(false)
const messages = ref<Array<ChatMessage & { time: string }>>([])
const messagesContainer = ref<HTMLElement | null>(null)

// 格式化消息(支持 Markdown)
const formatMessage = (content: string) => {
  return md.render(content)
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 发送消息
const sendMessage = async () => {
  if (!store.top.aiConfig.enabled) {
    $q.notify({
      type: 'warning',
      message: proxy.$t('aiChat.notification.configRequired')
    })
    router.push('/common/settings')
    return
  }

  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = {
    role: 'user' as const,
    content: inputMessage.value,
    time: new Date().toLocaleTimeString()
  }

  messages.value.push(userMessage)
  inputMessage.value = ''
  loading.value = true

  await scrollToBottom()

  try {
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: proxy.$t('aiChat.systemPrompt') },
      ...messages.value.map(({ role, content }) => ({ role, content }))
    ]

    const response = await chatCompletion(chatMessages)

    if (response.data.choices?.[0]?.message) {
      messages.value.push({
        role: 'assistant',
        content: response.data.choices[0].message.content,
        time: new Date().toLocaleTimeString()
      })
    } else {
      throw new Error('Invalid response')
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('aiChat.notification.sendFailed')
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

// 清空对话
const clearChat = () => {
  messages.value = []
}

// 新对话
const newChat = () => {
  clearChat()
  inputMessage.value = ''
}

// 组件加载时检查配置
onMounted(() => {
  if (!store.top.aiConfig.enabled) {
    $q.notify({
      type: 'warning',
      message: proxy.$t('aiChat.notification.configRequired')
    })
    router.push('/common/settings')
  }
})
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  background: var(--q-grey-1);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user .message-content {
  background: var(--q-primary);
  color: white;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
}

.message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.message-time {
  font-size: 0.8em;
  color: var(--q-grey-7);
  margin-top: 4px;
}

.user .message-time {
  text-align: right;
  color: rgba(255, 255, 255, 0.7);
}

.input-container {
  padding: 20px;
  background: white;
  border-top: 1px solid var(--q-separator-color);
}

/* 深色模式 */
.body--dark {
  .chat-container {
    background: var(--q-dark);
  }

  .message-content {
    background: #2d2d2d;
  }

  .input-container {
    background: #1d1d1d;
  }

  .message-text :deep(code),
  .message-text :deep(pre) {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>