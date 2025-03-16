<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@/components/SvgIcon.vue'
import { privateRoutes, publicRoutes } from '@/router'

const router = useRouter()
const { t } = useI18n()

const searchValue = ref('')
const isShow = ref(false)

// 扁平化路由数据，生成搜索选项
const searchPool = computed(() => {
  const generateRoutes = (routes) => {
    const result = []

    routes.forEach((route) => {
      // 跳过隐藏的路由
      if (route.hidden) return
      // 获取国际化的标题
      const title = route.meta?.title ? [t(`route.${route.meta.title}`)] : []
      // 处理当前路由
      if (route.path) {
        result.push({
          path: route.path,
          title
        })
      }

      // 递归处理子路由
      if (route.children) {
        const childrenRoutes = generateRoutes(route.children)
        childrenRoutes.forEach((childRoute) => {
          // 将父级标题添加到子路由标题前
          result.push({
            path: childRoute.path.startsWith('/')
              ? childRoute.path
              : `${route.path}/${childRoute.path}`,
            title: [...title, ...childRoute.title]
          })
        })
      }
    })

    return result
  }

  return generateRoutes([...publicRoutes, ...privateRoutes])
})

// 搜索方法
const querySearch = (query) => {
  if (query) {
    const results = searchPool.value.filter((item) => {
      return item.title.some((title) => title.toLowerCase().includes(query.toLowerCase()))
    })
    nextTick(() => (searchOptions.value = results)) // default-first-option在微任务中生效
  } else {
    searchOptions.value = []
  }
}

// 选择搜索结果
const onSelectChange = (path) => {
  router.push(path)
  searchValue.value = ''
  isShow.value = false
}

const toggleClick = () => {
  isShow.value = !isShow.value
  searchValue.value = ''
  searchOptions.value = []
  // 当显示搜索框时，自动聚焦
  if (isShow.value) {
    selectRef.value?.focus()
  }
}

const searchOptions = ref([])
const selectRef = ref(null)
</script>

<template>
  <div :class="[{ show: isShow }, 'header-search']">
    <SvgIcon class="svg" name="search" @click="toggleClick" />
    <el-select
      ref="selectRef"
      class="search-input"
      v-model="searchValue"
      filterable
      default-first-option
      remote
      :placeholder="$t('navBar.headerSearch')"
      :remote-method="querySearch"
      @change="onSelectChange"
      @blur="toggleClick"
    >
      <el-option
        v-for="option in searchOptions"
        :key="option.path"
        :label="option.title.join(' > ')"
        :value="option.path"
      ></el-option>
    </el-select>
  </div>
</template>

<style lang="scss" scoped>
.header-search {
  margin-right: 10px;
  font-size: 18px;
  cursor: pointer;
  .svg {
    font-size: 18px;
    vertical-align: middle;
  }
  :deep(.search-input) {
    width: 0;
    transition: width 0.2s;
    .el-select__wrapper {
      padding: 4px;
      box-shadow: none;
      .el-select__selection {
        border-bottom: 1px solid #d9d9d9;
      }
    }
  }
}
.show {
  .search-input {
    width: 210px;
    margin-left: 10px;
  }
}
</style>
