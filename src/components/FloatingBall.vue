<template>
  <div class="floating-ball-container">
    <!-- 悬浮球 -->
    <div class="floating-ball" @click="showChat = true">
      <el-icon><ChatLineRound /></el-icon>
    </div>

    <!-- 聊天窗口 -->
    <div class="chat-window" :class="{ 'chat-window-show': showChat }">
      <!-- 聊天窗口头部 -->
      <div class="chat-header">
        <span>deepseek</span>
        <el-icon class="close-icon" @click="showChat = false"><Close /></el-icon>
      </div>

      <!-- 聊天内容区域 -->
      <div class="chat-content" ref="chatContentRef">
        <template v-for="(message, index) in messages" :key="index">
          <!-- 用户消息 -->
          <div v-if="message.type === 'user'" class="message-item user">
            <div class="message-bubble" v-html="formatUserMessage(message.content)"></div>
          </div>
          <!-- 系统回复 -->
          <div v-else class="message-item response">
            <div class="message-bubble markdown-body" v-html="message.content"></div>
          </div>
        </template>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input">
        <el-input
          v-model="userInput"
          type="textarea"
          :rows="3"
          placeholder="请输入您的内容..."
          resize="none"
          @keydown.enter="handleKeydown"
        />
        <el-button type="primary" @click="handleSubmit" class="submit-btn"> 发送 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { marked } from 'marked'
import { ChatLineRound, Close } from '@element-plus/icons-vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

// 安全的HTML转义函数
const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 配置 marked 选项
const renderer = new marked.Renderer()

// 自定义代码块渲染
renderer.code = function ({ text, lang }) {
  try {
    const validLanguage = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const escapedCode = escapeHtml(text)
    let highlightedCode

    try {
      highlightedCode = hljs.highlight(text, { language: validLanguage }).value
    } catch (e) {
      console.warn('代码高亮失败，使用普通文本显示', e)
      highlightedCode = escapedCode
    }

    return `
      <div class="code-block">
        <div class="code-block-header">
          <span class="code-language">${validLanguage}</span>
          <button class="copy-button" onclick="(() => { try { navigator.clipboard.writeText(\`${escapedCode.replace(/`/g, '\\`')}\`); } catch(e) {} })()">
            复制
          </button>
        </div>
        <pre><code class="hljs language-${validLanguage}">${highlightedCode}</code></pre>
      </div>
    `
  } catch (error) {
    console.error('代码块渲染失败', error)
    return `<pre><code>${escapeHtml(text)}</code></pre>`
  }
}

// 配置 marked
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  pedantic: false
})

const showChat = ref(false)
const userInput = ref('')
const chatContentRef = ref()
const messages = ref([])
const loading = ref(false)

const handleSubmit = async () => {
  if (!userInput.value.trim() || loading.value) return

  const userMessage = userInput.value.trim()
  userInput.value = ''
  loading.value = true

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userMessage
  })

  // 添加一个空的系统回复消息
  const systemMessageIndex = messages.value.length
  messages.value.push({
    type: 'system',
    content: ''
  })

  try {
    const response = await fetch('/api/deepseek/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let accumulatedContent = ''
    let isDone = false

    while (!isDone) {
      const { done, value } = await reader.read()
      isDone = done
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            break
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              accumulatedContent += parsed.content
              try {
                messages.value[systemMessageIndex].content = marked(accumulatedContent)
                await nextTick()
                scrollToBottom()
              } catch (e) {
                console.error('Markdown 渲染失败:', e)
                messages.value[systemMessageIndex].content = escapeHtml(accumulatedContent)
              }
            }
          } catch (e) {
            console.error('解析响应数据失败:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('API Error:', error)
    messages.value[systemMessageIndex].content = marked(
      `**错误：${error.message || '服务出现错误，请稍后重试'}**`
    )
  } finally {
    loading.value = false
  }
}

const handleKeydown = (e) => {
  // 如果按下 Shift+Enter，不阻止默认行为（允许换行）
  if (e.shiftKey) {
    return
  }
  // 如果只按下 Enter，阻止默认行为并提交
  e.preventDefault()
  handleSubmit()
}

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// 滚动到底部
const scrollToBottom = () => {
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
  }
}

// 添加格式化用户消息的函数
const formatUserMessage = (content) => {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>')
}
</script>

<style lang="scss" scoped>
.floating-ball-container {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 9999;

  .floating-ball {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }

    :deep(.el-icon) {
      font-size: 24px;
      color: white;
    }
  }
}

.chat-window {
  position: fixed;
  right: 40px;
  bottom: 120px;
  width: 400px;
  height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  transform: scale(0);
  opacity: 0;
  transform-origin: bottom right;
  transition: all 0.3s ease;

  &.chat-window-show {
    transform: scale(1);
    opacity: 1;
  }

  .chat-header {
    height: 50px;
    padding: 0 20px;
    background: #409eff;
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;

    .close-icon {
      cursor: pointer;
      font-size: 20px;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .chat-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f5f5f5;

    .message-item {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;

      &.response {
        align-items: flex-start;

        .message-bubble {
          background: white;
          border-radius: 0 12px 12px 12px;
        }
      }

      &.user {
        align-items: flex-end;

        .message-bubble {
          background: #409eff;
          color: white;
          border-radius: 12px 0 12px 12px;
        }
      }

      .message-bubble {
        max-width: 90%;
        padding: 10px 15px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        word-break: break-word;
        white-space: normal;
      }
    }
  }

  .chat-input {
    padding: 15px;
    border-top: 1px solid #eee;
    background: white;
    border-radius: 0 0 12px 12px;

    :deep(.el-textarea__inner) {
      resize: none;
      border-radius: 8px;
      padding: 8px 12px;
      line-height: 1.5;
    }

    .submit-btn {
      width: 100%;
      margin-top: 10px;
      border-radius: 8px;
    }
  }
}

:deep(.markdown-body) {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif;

  p {
    margin: 4px 0;
  }

  strong {
    font-weight: 600;
  }

  .code-block {
    margin: 8px 0;
    border-radius: 6px;
    overflow: hidden;
    background: #282c34;

    .code-block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: #21252b;
      border-bottom: 1px solid #181a1f;

      .code-language {
        color: #abb2bf;
        font-size: 12px;
        text-transform: lowercase;
      }

      .copy-button {
        background: transparent;
        border: 1px solid #181a1f;
        border-radius: 4px;
        color: #abb2bf;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #2c313a;
          border-color: #2c313a;
        }
      }
    }

    pre {
      margin: 0;
      padding: 16px;
      background: transparent;

      code {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        font-size: 14px;
        color: #abb2bf;
        background: transparent;
        padding: 0;
        margin: 0;
        border-radius: 0;
      }
    }
  }

  .hljs {
    color: #abb2bf;
    background: transparent;

    .hljs-keyword,
    .hljs-operator {
      color: #c678dd;
    }

    .hljs-function {
      color: #61afef;
    }

    .hljs-string {
      color: #98c379;
    }

    .hljs-number {
      color: #d19a66;
    }

    .hljs-comment {
      color: #5c6370;
      font-style: italic;
    }

    .hljs-attr {
      color: #d19a66;
    }

    .hljs-built_in {
      color: #e6c07b;
    }
  }

  code {
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-size: 85%;
    margin: 0;
    padding: 0.2em 0.4em;
  }
}
</style>
