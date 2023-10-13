<script setup>
const props = defineProps({
  height: {
    type: String,
    default: '300'
  },
  title: {
    type: String,
  },
  src: {
    type: String,
    required: true
  }
})
</script>

<template>
  <iframe
  :height="props.height"
  style="width: 100%;"
  scrolling="no"
  :title="props.title"
  :src="props.src"
  frameborder="no"
  loading="lazy"
  allowtransparency="true"
  allowfullscreen="true">
    {{ src }}
  </iframe>
</template>

<style scoped>
  iframe {
    margin-top: 1rem;
  }
</style>
