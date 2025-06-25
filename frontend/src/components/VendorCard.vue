<template>
  <v-card class="mx-auto" max-width="400" elevation="2">
    <v-img
      :src="imageUrl"
      height="200"
      cover
      class="align-end"
      gradient="to top, rgba(0,0,0,.5), rgba(0,0,0,0)"
    >
      <v-card-title class="text-white">{{ title }}</v-card-title>
    </v-img>

    <v-card-text class="text-body-1">
      <p>{{ description }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="black"
        variant="text"
        :to="link"
        class="ml-2"
      >
        Discover More
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VendorCard',
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
      required: true
    },
    link: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>