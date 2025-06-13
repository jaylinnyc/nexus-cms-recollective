<template>
  <div>
    <!-- About Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/about_recollective_banner.jpg"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h3 font-weight-bold">About Us</h1>
      </div>
    </v-parallax>

    <!-- Our History -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Our Story</h2>
          <p class="text-body-1 text-justify mb-4 text-black">
            The Recollective was born from a vision to breathe new life into the historic Connecticut Post press hall at 588 State Street, Bridgeport. Once a cavernous space thundering with newspaper presses, it fell silent until a collective of antique enthusiasts, artists, and community leaders transformed it into a 50,000-square-foot marketplace in 2015. What began as a modest gathering of local vendors has grown into a thriving hub where heritage meets creativity, drawing visitors from across the region to explore curated treasures and connect with passionate sellers.
          </p>
          <p class="text-body-1 text-justify mb-4 text-black">
            Our mission remains rooted in preserving the past while fostering a vibrant community. Each booth tells a story, and every item carries a piece of history, reflecting the dedication of our independent vendors—some with decades of experience, others emerging talents—who share a love for timeless pieces and the joy of passing them forward.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Our Space and Vendors -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="pa-6">
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <v-img
                  src="https://media.recollectivect.com/public/recollective_interior.jpg"
                  alt="The Recollective Interior"
                  class="rounded-lg"
                  height="250"
                ></v-img>
              </v-col>
              <v-col cols="12" md="8">
                <h2 class="text-h4 mb-4 text-black">Our Space & Vendors</h2>
                <p class="text-body-1 mb-4 text-justify text-black">
                  Housed in a restored industrial cathedral, The Recollective blends character with community. Skylights illuminate hand-picked antiques, vintage curiosities, and original artwork, staged by a diverse group of vendors. From seasoned dealers tracking down French armoires to artists showcasing freshly varnished canvases, our market is a living tapestry of heritage and creativity.
                </p>
                <p class="text-body-1 text-justify text-black">
                  This shared vision supports sustainability by reviving a historic building and rescuing beautiful pieces from obscurity, fostering authentic human connections in an era of mass production.
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Founder's Message -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="pa-6">
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <v-avatar size="200" class="mb-4">
                  <v-img
                    src="https://media.recollectivect.com/public/founder_photo.jpg"
                    alt="Founder of The Recollective"
                  ></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="12" md="8">
                <h2 class="text-h4 mb-4 text-black">A Message from Our Founder</h2>
                <h3 class="text-h6 mb-2 text-black">Jane Doe</h3> <!-- Replace with actual founder name -->
                <p class="text-body-1 mb-4 text-justify text-black">
                  The Recollective is more than a marketplace—it’s a celebration of history and human connection. As its founder, I’ve watched this space evolve from a forgotten press hall into a sanctuary for stories and craftsmanship. My vision was to create a place where every item has a past and every vendor a passion, uniting collectors and creators under one roof.
                </p>
                <p class="text-body-1 text-justify text-black">
                  I’m grateful to our community of vendors and visitors who make this vision a reality. Together, we’re preserving the past while building a future where beauty and heritage thrive. Thank you for being part of this journey.
                </p>
                <img src="https://media.recollectivect.com/public/founder_signature.png" alt="Founder Signature" style="height: 40px; margin: 16px;" /> <!-- Replace with actual signature image -->
              </v-col>
            </v-row>
          </v-card>
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