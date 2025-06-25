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
          <v-list-item-subtitle class="text-caption text-gray-600">Bridgeport, CT</v-list-item-subtitle>
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
          <!-- MDI Icons (Facebook, Twitter) -->
          <v-btn
            v-for="icon in mdiIcons"
            :key="icon.icon"
            class="mx-2"
            icon
            variant="text"
            color="black"
            :href="icon.href"
            target="_blank"
            :class="{ 'scale-110': hoverIcon === icon.icon }"
            @mouseover="hoverIcon = icon.icon"
            @mouseleave="hoverIcon = ''"
          >
            <v-icon>{{ icon.icon }}</v-icon>
          </v-btn>
          <!-- Instagram -->
          <v-btn
            class="mx-2"
            icon
            variant="text"
            color="black"
            href="https://www.instagram.com/therecollectivect"
            target="_blank"
            :class="{ 'scale-110': hoverIcon === 'mdi-instagram' }"
            @mouseover="hoverIcon = 'mdi-instagram'"
            @mouseleave="hoverIcon = ''"
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <!-- TikTok SVG Image -->
          <v-btn
            class="mx-2"
            icon
            variant="text"
            color="black"
            href="https://www.tiktok.com/@therecollectivect"
            target="_blank"
            :class="{ 'scale-110': hoverIcon === 'tiktok' }"
            @mouseover="hoverIcon = 'tiktok'"
            @mouseleave="hoverIcon = ''"
          >
            <img src="@/assets/tiktok.svg" alt="TikTok Logo" class="social-icon" />
          </v-btn>
        </v-col>
        <v-col cols="12">
          <div class="text-center text-black opacity-80 text-body-2">
            © {{ new Date().getFullYear() }} — <strong>The Recollective</strong> — Bridgeport, CT
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const drawer = ref(false);
    const hoverIcon = ref('');
    const menuItems = [
      { title: 'Home', path: '/', icon: 'mdi-home' },
      { title: 'About', path: '/about', icon: 'mdi-information' },
      { title: 'Vendors', path: '/vendors', icon: 'mdi-store' },
      { title: 'Become a Vendor', path: '/become-a-vendor', icon: 'mdi-plus-box' },
      { title: 'Contact', path: '/contact', icon: 'mdi-email' },
    ];
    const mdiIcons = [
      { icon: 'mdi-facebook', href: '#' },
      { icon: 'mdi-twitter', href: '#' }
    ];

    return {
      drawer,
      hoverIcon,
      menuItems,
      mdiIcons,
    };
  },
});
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

/* Style TikTok SVG to match MDI icons */
.social-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  transition: transform 0.3s ease; /* Match hover effect */
  pointer-events: none; /* Prevent img from blocking click events */
}
</style>