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
        <span>在线客服</span>
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

const showChat = ref(false)
const userInput = ref('')
const chatContentRef = ref()
const messages = ref([])

const handleSubmit = async () => {
  if (!userInput.value.trim()) return

  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userInput.value.trim()
  })

  // 添加系统回复
  const response = '**感谢您的输入！**\n您的输入已被记录。'
  messages.value.push({
    type: 'system',
    content: marked(response)
  })

  userInput.value = ''

  // 等待DOM更新后滚动到底部
  await nextTick()
  scrollToBottom()
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
  width: 350px;
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
        max-width: 80%;
        padding: 10px 15px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        word-break: break-word;
        white-space: pre-wrap;
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
    margin: 8px 0;
  }

  strong {
    font-weight: 600;
  }
}
</style>
