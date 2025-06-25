<template>
  <div>
    <!-- Hero Section -->
    <transition name="hero-fade" @after-leave="onHeroRemoved">
      <div class="hero-container full-screen-hero" v-if="showHero">
        <div class="hero-background">
          <img
            src="https://media.recollectivect.com/public/home.jpg"
            alt="Home page Background"
            class="background-image"
          />
          <div class="overlay"></div>
          <div class="logo-container">
            <img
              src="/rc-transparent.png"
              alt="The Recollective Logo"
              class="animated-logo"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content Wrapper -->
    <transition name="content-fade" appear>
      <div v-if="!showHero" class="main-content-wrapper">
        <div class="main-content">
          <!-- Mission Statement -->
          <v-container class="py-12">
            <v-row justify="center">
              <v-col cols="12" md="10" lg="8">
                <div class="pa-8 text-center elevation-4 rounded-lg bg-white">
                  <h2 class="text-h3 font-weight-bold mb-6 text-black">
                    Welcome to The Recollective
                  </h2>
                  <p class="text-body-1 text-black opacity-90 mb-4">
                    Step into a space where every object tells a story. Housed
                    in a historic printing press in the heart of Bridgeport, The
                    Recollective is a curated multivendor marketplace
                    celebrating the beauty of past vintage, antique, salvaged
                    and storied goods deserving of a second life. From timeless
                    furniture and rare finds to eclectic art and soulful pieces,
                    our market brings together collectors, makers and seekers
                    under one unforgettable roof. Come get lost in the charm of
                    yesterday and leave with something that feels just right for
                    today.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>

          <!-- Featured Vendors -->
          <v-container class="py-12 bg-grey-lighten-5">
            <h2 class="text-h3 font-weight-bold text-center mb-10 text-black">
              Featured
            </h2>
            <v-row align="center" justify="center">
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="vendor in vendors"
                :key="vendor.title"
              >
                <vendor-card
                  :title="vendor.title"
                  :description="vendor.description"
                  :image-url="vendor.imageUrl"
                  :link="vendor.link"
                />
              </v-col>
            </v-row>
            <div class="text-center mt-10">
              <v-btn
                color="black"
                variant="outlined"
                to="/vendors"
                size="large"
                class="rounded-pill px-8"
                >Meet Our Vendors</v-btn
              >
            </div>
          </v-container>

        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import VendorCard from "../components/VendorCard.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    VendorCard,
  },
  setup() {
    const vendors = [
      {
        title: "Vintage Décor & European Finds",
        description: "Over 20 years curating...",
        imageUrl:
          "https://media.recollectivect.com/public/web%2Fvendor1–800w.png",
        link: "/vendors",
      },
      {
        title: "Modern Art & Local Originals",
        description: "Original works and prints...",
        imageUrl:
          "https://media.recollectivect.com/public/web%2Fvendor2–800w.png",
        link: "/vendors",
      },
      {
        title: "Curiosities & Rare Treasures",
        description: "Vintage signage and forgotten...",
        imageUrl:
          "https://media.recollectivect.com/public/web%2Fvendor3–800w.png",
        link: "/vendors",
      },
    ];

    const showHero = ref(true);

    onMounted(() => {
      const overlay = document.querySelector(".overlay") as HTMLElement;
      if (overlay) {
        overlay.style.background = "rgba(255, 255, 255, 0)";
        setTimeout(() => {
          overlay.style.background = "rgba(255, 255, 255, 1)";
          overlay.addEventListener(
            "transitionend",
            () => {
              console.log("Overlay transition ended, hiding hero");
              showHero.value = false;
            },
            { once: true }
          );
        }, 100);
      }
    });

    const onHeroRemoved = () => {
      console.log("Hero removed, scrolling to top");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return { vendors, showHero, onHeroRemoved };
  },
});
</script>

<style scoped>
/* Hero Fade Transition */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

/* Content Fade Transition */
.content-fade-enter-active {
  transition: opacity 1s ease-in-out 1s;
}
.content-fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}
.content-fade-enter-to {
  opacity: 1;
}

/* Hero Layout */
.hero-container.full-screen-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 100vh;
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
  transition: background 2s ease-out;
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

/* Content Styling */
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

/* Responsive Adjustments */
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

  .background-image,
  .overlay {
    height: auto;
    min-height: 100vh;
  }
}
</style>
