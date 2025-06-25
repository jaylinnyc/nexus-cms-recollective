<template>
  <div>
    <!-- About Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/about.jpg"
      height="400"
      scale="1.5"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-white"
      >
        <h1 class="text-h3 font-weight-bold">About Us</h1>
      </div>
    </v-parallax>

    <!-- Our Story -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Our Mission</h2>
          <p class="text-body-1 text-justify mb-4 text-black">
            At The Recollective, our mission is to preserve the beauty of the
            past while inspiring creativity in the present. We curate vintage,
            antique, and salvaged goods with soul. A space where history,
            design, and community come together. By supporting local vendors and
            sustainable shopping, we aim to give forgotten pieces new life and
            purpose in modern spaces.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Our Vendors -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Our Vendors</h2>
          <p class="text-body-1 mb-4 text-justify text-black">
            The Recollective is home to a thoughtfully curated group of vendors,
            each with a deep appreciation for history, craftsmanship and design.
            From antique collectors and vintage curators to salvage specialists
            and creative makers, our vendors bring years of experience with a
            trained eye for the extraordinary. Their collections tell stories,
            spark nostalgia and offer one-of-a-kind pieces you won't find
            anywhere else.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Our Space -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Our Space</h2>
          <p class="text-body-1 text-justify mb-4 text-black">
            The Recollective is a multi-vendor vintage and antique marketplace
            located in the heart of Bridgeport, Connecticut. Housed in a
            beautifully restored, 50,000 sq ft historic printing press building
            we offer a thoughtfully curated mix of vintage furniture,
            architectural salvage, home decor, antiques, art and found objects.
            Every item has a story, and we're here to help it find a new one.
          </p>
          <p class="text-body-1 text-justify text-black">
            Whether you're sourcing a standout piece for your home, hunting for
            rare treasures or simply exploring, The Recollective is a
            destination built on discovery, sustainability and storytelling.
            Come connect with Bridgeport's creative community.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AboutView",
});
</script>
