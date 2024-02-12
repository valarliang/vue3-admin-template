<script setup>
import { isExternal as external } from '@/utils'
import { computed } from 'vue'
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ''
  }
})

const isExternal = computed(() => external(props.name))

const styleExternalIcon = computed(() => ({
  mask: `url(${props.name}) no-repeat 50% 50%`,
  '-webkit-mask': `url(${props.name}) no-repeat 50% 50%`
}))

const iconName = computed(() => `#icon-${props.name}`)
</script>

<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    :class="className"
  />
  <svg v-else class="svg-icon" :class="className" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
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
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
