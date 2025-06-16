<template>
  <div>
    <!-- About Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/web%2Fantiques–800w.png"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h3 font-weight-bold">About Us</h1>
      </div>
    </v-parallax>

    <!-- Our Story -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Where the Past is Present</h2>
          <p class="text-body-1 text-justify mb-4 text-black">
            The Recollective is more than just a market—it’s a shared vision. A home for hand-picked antiques, vintage finds, original artwork, and timeless design, all brought together by a passionate group of independent vendors.
          </p>
          <p class="text-body-1 text-justify mb-4 text-black">
            Founded on the idea that the best things in life are discovered—not mass-produced—The Recollective was created as a space where collectors, makers, and treasure-hunters could come together under one roof. Our name reflects our purpose: to gather, to remember, to pass on.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Our Vendors -->
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
                <h2 class="text-h4 mb-4 text-black">Our Vendors</h2>
                <p class="text-body-1 mb-4 text-justify text-black">
                  Every vendor at The Recollective brings their own eye, taste, and history. Some have been in the antique world for decades, others are emerging local artists or collectors of the beautifully unusual. But they all have one thing in common: a deep appreciation for the pieces they offer and the people they meet.
                </p>
                <p class="text-body-1 text-justify text-black">
                  From seasoned dealers to fresh talents, our vendors create a living tapestry of heritage and creativity, offering everything from rare antiques to original artwork.
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Our Space -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Our Space</h2>
          <p class="text-body-1 text-justify mb-4 text-black">
            Our market is housed in a spacious, welcoming environment designed for wandering, wondering, and finding what you didn’t even know you were looking for. Whether you’re furnishing a home, finding the perfect accent piece, or just browsing for inspiration, The Recollective invites you to slow down, explore, and connect—with the items, with their stories, and with the community around you.
          </p>
          <p class="text-body-1 text-justify text-black">
            We believe that good things come with age—and the best are meant to be shared.
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