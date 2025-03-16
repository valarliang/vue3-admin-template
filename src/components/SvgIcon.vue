<script setup lang="ts">
import { isExternal as external } from '@/utils'
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const isExternal = computed(() => external(props.name))

const styleExternalIcon = computed(() => ({
  mask: `url(${props.name}) center/cover no-repeat`,
  '-webkit-mask': `url(${props.name}) center/cover no-repeat`
}))

const iconName = computed(() => `#icon-${props.name}`)
</script>

<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" />
  <el-icon v-else>
    <svg class="svg-icon" aria-hidden="true">
      <use :xlink:href="iconName" />
    </svg>
  </el-icon>
</template>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  display: inline-block;
  background-color: currentColor;
}
</style>
