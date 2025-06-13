<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar
      color="white"
      density="compact"
      elevation="4"
      :elevation-on-scroll="true"
      class="transition-all duration-300"
    >
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          class="d-md-none"
          color="black"
        ></v-app-bar-nav-icon>
        <router-link to="/" class="d-flex align-center text-decoration-none">
          <img src="/rc-transparent.png" alt="The Recollective Logo" style="height: 25px; margin-left: 10px;" class="transition-transform hover:scale-105" />
        </router-link>
      </template>

      <!-- Desktop Navigation -->
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          variant="text"
          class="mx-3 text-black font-weight-medium text-uppercase transition-colors hover:text-gray-600"
          :class="{ 'text-gray-600': $route.path === item.path }"
        >
          {{ item.title }}
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer (Mobile) -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      class="bg-white"
      width="280"
    >
      <v-list>
        <v-list-item class="py-6">
          <template v-slot:prepend>
            <img src="/rc-transparent.png" alt="The Recollective Logo" style="height: 48px; margin-right: 16px;" />
          </template>
          <v-list-item-title class="text-h6 font-weight-bold text-black">The Recollective</v-list-item-title>
          <v-list-item-subtitle class="text-caption text-gray-600">Far Rockaway, NY</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :value="item.title"
          :to="item.path"
          active-color="black"
          class="transition-all hover:bg-gray-100"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" color="black"></v-icon>
          </template>
          <v-list-item-title class="text-black">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <slot></slot>
    </v-main>

    <!-- Footer -->
    <v-footer
      color="white"
      class="text-center py-6 elevation-4"
    >
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="mb-4">
          <v-btn
            v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-instagram']"
            :key="icon"
            class="mx-2"
            icon
            variant="text"
            color="black"
            :class="{ 'scale-110': hoverIcon === icon }"
            @mouseover="hoverIcon = icon"
            @mouseleave="hoverIcon = ''"
          >
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <div class="text-center text-black opacity-80 text-body-2">
            © {{ new Date().getFullYear() }} — <strong>The Recollective</strong> — Far Rockaway, NY
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const drawer = ref(false)
    const hoverIcon = ref('')
    const menuItems = [
      { title: 'Home', path: '/', icon: 'mdi-home' },
      { title: 'About', path: '/about', icon: 'mdi-information' },
      { title: 'Vendors', path: '/vendors', icon: 'mdi-store' },
      { title: 'Visit Us', path: '/visit-us', icon: 'mdi-map-marker' },
      { title: 'Become a Vendor', path: '/become-a-vendor', icon: 'mdi-plus-box' },
      { title: 'Events', path: '/events', icon: 'mdi-calendar' },
      { title: 'Contact', path: '/contact', icon: 'mdi-email' }
    ]

    return {
      drawer,
      hoverIcon,
      menuItems
    }
  }
})
</script>

<style scoped>
.v-app-bar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.v-navigation-drawer {
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.v-btn {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.v-footer {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.transition-all {
  transition: all 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:bg-gray-100:hover {
  background-color: #f5f5f5;
}

.hover\:text-gray-600:hover {
  color: #666;
}
</style>