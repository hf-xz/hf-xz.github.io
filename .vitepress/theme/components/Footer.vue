<template>
  <div class="footer" :class="{ dark: isDark }">
    <a class="icp" href="https://beian.miit.gov.cn/" target="_blank">
      京ICP备2026011892号-1
    </a>
  </div>
</template>

<script setup>
import { useData } from "vitepress";

const { isDark } = useData();
</script>

<style lang="css" scoped>
.footer {
  background-color: #f5f5f5;
  padding: 10px 0;
}
.footer.dark {
  background-color: #333;
}
.icp {
  display: block;
  text-align: center;
  font-size: small;
}
</style>
