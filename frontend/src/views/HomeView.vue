<template>
  <div class="hero-container full-screen-hero">
    <!-- Animated Hero Section -->
    <div class="hero-background">
      <img src="/home-bg.png" alt="Hero Background" class="background-image" />
      <div class="overlay"></div>
      <div class="logo-container">
        <img src="/rc-transparent.png" alt="The Recollective Logo" class="animated-logo" />
      </div>
    </div>
  </div>

  <!-- Mission Statement -->
  <v-container class="py-12">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="pa-8 text-center elevation-4 rounded-lg bg-white">
          <h2 class="text-h3 font-weight-bold mb-6 text-black">Our Mission</h2>
          <p class="text-body-1 text-black opacity-90">
            The Recollective is a curated marketplace where heritage meets creativity. Housed in a historic 50,000-square-foot former press hall in Bridgeport, we bring together a vibrant community of vendors offering antiques, vintage décor, and original artwork. Our mission is to preserve the past, foster authentic connections, and provide a space where every piece tells a story and every visitor finds inspiration.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- Featured Vendors -->
  <v-container class="py-12 bg-grey-lighten-5">
    <h2 class="text-h3 font-weight-bold text-center mb-10 text-black">Featured Vendors</h2>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4" v-for="vendor in vendors" :key="vendor.title">
        <vendor-card
          :title="vendor.title"
          :description="vendor.description"
          :image-url="vendor.imageUrl"
          :link="vendor.link"
        />
      </v-col>
    </v-row>
    <div class="text-center mt-10">
      <v-btn color="black" variant="outlined" to="/vendors" size="large" class="rounded-pill px-8">Meet All Vendors</v-btn>
    </div>
  </v-container>

  <!-- Call to Action -->
  <v-container class="py-12 text-center bg-black text-white">
    <h2 class="text-h3 font-weight-bold mb-6">Explore Today</h2>
    <p class="text-body-1 mb-8 mx-auto" style="max-width: 800px">
      Discover timeless treasures and connect with our community. Visit us, become a vendor, or browse our unique offerings.
    </p>
    <v-btn color="white" variant="outlined" size="large" to="/visit-us" class="rounded-pill px-8">Plan Your Visit</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import VendorCard from '../components/VendorCard.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    VendorCard
  },
  setup() {
    const vendors = [
      { title: 'Vintage Décor & European Finds', description: 'Over 20 years curating French country antiques with soul and character.', imageUrl: '/vendor-european.jpg', link: '/vendors' },
      { title: 'Modern Art & Local Originals', description: 'Original works and prints by regional artists, with evolving seasonal collections.', imageUrl: '/vendor-art.jpg', link: '/vendors' },
      { title: 'Curiosities & Rare Treasures', description: 'Vintage signage and forgotten oddities for designers and collectors alike.', imageUrl: '/vendor-curiosities.jpg', link: '/vendors' },
    ]

    onMounted(() => {
      const overlay = document.querySelector('.overlay') as HTMLElement
      if (overlay) {
        overlay.style.background = 'rgba(255, 255, 255, 0)'
        setTimeout(() => {
          overlay.style.background = 'rgba(255, 255, 255, 1)'
        }, 100)
      }
    })

    return { vendors }
  }
})
</script>

<style scoped>
.hero-container.full-screen-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.hero-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  transition: background 5s ease-out;
}

.logo-container {
  position: absolute;
  z-index: 3;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 50vw;
  height: auto;
}

.animated-logo {
  width: 100%;
  height: auto;
  max-height: 80vh;
}

.v-container {
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.elevation-4 {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.bg-grey-lighten-5 {
  background-color: #f5f5f5;
}

@media (max-width: 600px) {
  .v-col {
    padding: 0 1rem;
  }
  .animated-logo {
    max-height: 60vh;
  }
  .hero-background {
    height: auto;
    min-height: 100vh;
  }
  .background-image {
    height: auto;
  }
  .overlay {
    height: auto;
    min-height: 100vh;
  }
}
</style>