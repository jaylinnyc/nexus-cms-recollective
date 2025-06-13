// src/components/TestimonialCard.vue
<template>
  <v-card class="mx-auto my-4" variant="outlined">
    <v-card-text>
      <p class="text-body-1 font-italic">
        "{{ quote }}"
      </p>
    </v-card-text>
    <v-card-actions>
      <v-avatar size="40" class="mr-3">
        <v-img :src="avatarUrl" alt="Avatar"></v-img>
      </v-avatar>
      <div>
        <div class="font-weight-bold">{{ name }}</div>
        <div class="text-caption">{{ role }}</div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestimonialCard',
  props: {
    quote: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: 'https://placehold.co/40x40?text=User'
    }
  }
})
</script>
