<!--.vitepress/theme/components/giscus.vue-->
<script setup>
import Giscus from '@giscus/vue'
import { useData, useRoute } from 'vitepress'

const { frontmatter, isDark } = useData()
</script>

<template>
  <div class="container">
    <Giscus
      class="giscus"
      v-if="frontmatter['comment'] !== false"
      id="comments"
      repo="hf-xz/hf-xz.github.io"
      repoId="R_kgDOKV8K4Q"
      category="giscus"
      categoryId="DIC_kwDOKV8K4c4CZnx6"
      mapping="specific"
      :term="useRoute().path"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      :theme="isDark ? 'noborder_dark' : 'noborder_light'"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.container {
  margin-top: 2rem;
}
</style>