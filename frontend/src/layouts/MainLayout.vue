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
          <img
            :src="logoUrl"
            alt="Recollective Logo"
            style="height: 25px; margin-left: 10px"
            class="transition-transform hover:scale-105"
          />
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
            <img
              :src="logoUrl"
              alt="Recollective Logo"
              style="height: 48px; margin-right: 16px"
            />
          </template>
          <v-list-item-title class="text-h6 font-weight-bold text-black"
            >Recollective</v-list-item-title
          >
          <v-list-item-subtitle class="text-caption text-gray-600"
            >Bridgeport, CT</v-list-item-subtitle
          >
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
          <v-list-item-title class="text-black">{{
            item.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <slot></slot>
    </v-main>

    <!-- Footer -->
    <v-footer color="white" class="text-center py-6 elevation-4">
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="mb-4">
          <v-btn
            v-for="social in socials.filter((s) => s.href)"
            :key="social.id"
            class="mx-2"
            icon
            variant="text"
            color="black"
            :href="social.href"
            target="_blank"
            :class="{ 'scale-110': hoverIcon === social.id }"
            @mouseover="hoverIcon = social.id"
            @mouseleave="hoverIcon = ''"
          >
            <v-icon v-if="!social.isCustom">{{ social.icon }}</v-icon>
            <img
              v-else
              :src="social.customSrc"
              :alt="social.customAlt"
              class="social-icon"
            />
          </v-btn>
        </v-col>
        <v-col cols="12">
          <div class="text-center text-black opacity-80 text-body-2">
            © {{ new Date().getFullYear() }} —
            <strong>Recollective</strong> — Bridgeport, CT
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { strapiApi } from "@/plugins/axios";
import tiktokIcon from "@/assets/tiktok.svg";

export default defineComponent({
  name: "MainLayout",
  setup() {
    const drawer = ref(false);
    const hoverIcon = ref("");
    const logoUrl = ref("/rc-transparent.png"); // Fallback
    const socials = ref([
      {
        id: "facebook",
        icon: "mdi-facebook",
        href: "",
        baseUrl: "https://www.facebook.com/",
      },
      {
        id: "instagram",
        icon: "mdi-instagram",
        href: "",
        baseUrl: "https://www.instagram.com/",
      },
      {
        id: "tiktok",
        isCustom: true,
        customSrc: tiktokIcon,
        customAlt: "TikTok Logo",
        href: "",
        baseUrl: "https://www.tiktok.com/",
      },
    ]);
    const menuItems = [
      { title: "Home", path: "/", icon: "mdi-home" },
      { title: "About", path: "/about", icon: "mdi-information" },
      { title: "Vendors", path: "/vendors", icon: "mdi-store" },
      {
        title: "Become a Vendor",
        path: "/become-a-vendor",
        icon: "mdi-plus-box",
      },
      { title: "Contact", path: "/contact", icon: "mdi-email" },
    ];

    onMounted(async () => {
      try {
        const response = await strapiApi.get("/api/generals?populate=Logo");
        const data = response.data.data;

        console.log("Fetched general info from Strapi:", data);
        if (data.length > 0) {
          const general = data[0];
          console.log("General attributes:", general);
          if (general.Logo && general.Logo.url) {
            logoUrl.value = `${strapiApi.defaults.baseURL}${general.Logo.url}`;
          }
          socials.value[0].href = general.Facebook
            ? `${socials.value[0].baseUrl}${general.Facebook}`
            : "";
          socials.value[1].href = general.Instagram
            ? `${socials.value[1].baseUrl}${general.Instagram}`
            : "";
          socials.value[2].href = general.Tiktok
            ? `${socials.value[2].baseUrl}${general.Tiktok}`
            : "";
        }
      } catch (error) {
        console.error("Error fetching general info from Strapi:", error);
      }
    });

    return {
      drawer,
      hoverIcon,
      logoUrl,
      socials,
      menuItems,
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
