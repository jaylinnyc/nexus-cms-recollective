// src/components/HeroSection.vue
<template>
  <v-parallax
    src="https://media.recollectivect.com/public/home_banner.jpg"
    height="400"
    scale="1.5"
  >
    <div class="d-flex flex-column fill-height justify-center align-center text-white">
      <h1 class="text-h2 font-weight-bold text-center mb-4">The Recollective</h1>
      <h2 class="text-h5 text-center">Links today's careers to tomorrow's possibilities</h2>
      <v-btn
        class="mt-6"
        size="large"
        color="secondary"
        variant="elevated"
        to="/get-involved"
      >
        Get Involved
      </v-btn>
    </div>
  </v-parallax>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeroSection'
})
</script>
