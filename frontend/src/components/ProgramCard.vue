// src/components/ProgramCard.vue
<template>
  <v-card class="mx-auto my-4" max-width="400" height="100%">
    <v-img
      :src="imageUrl"
      height="200px"
      cover
    ></v-img>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text class="text-justify">
      <p>{{ description }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="text"
        :to="link"
      >
        Learn More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProgramCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: 'https://placehold.co/400x200?text=Program'
    },
    link: {
      type: String,
      default: '/programs'
    }
  }
})
</script>
