<template>
  <div>
    <!-- Visit Us Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/visit_us_banner.jpg"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h3 font-weight-bold">Visit Us</h1>
      </div>
    </v-parallax>

    <!-- Introduction -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <p class="text-body-1 mb-6 text-black">
            Discover The Recollective, a historic 50,000-square-foot marketplace in Bridgeport, where antiques, vintage goods, and artwork come to life. Plan your visit to explore our unique offerings and connect with our vibrant vendor community.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Location Details -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Location</h2>
          <p class="text-body-1 mb-4 text-black">
            <strong>Address:</strong> 588 State Street, Bridgeport, CT 06604
          </p>
          <div class="mb-6">
            <v-img
              src="https://maps.googleapis.com/maps/api/staticmap?center=41.1798,-73.1902&zoom=14&size=600x300&key=YOUR_API_KEY"
              alt="Map of The Recollective Location"
              class="rounded-lg"
              height="300"
            ></v-img>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Hours and Parking -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Hours & Parking</h2>
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="text-h6 mb-2 text-black">Hours of Operation</h3>
              <p class="text-body-1 mb-4 text-black">
                Monday - Saturday: 10:00 AM - 6:00 PM<br>
                Sunday: 12:00 PM - 5:00 PM<br>
                (Closed on major holidays)
              </p>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="text-h6 mb-2 text-black">Parking Information</h3>
              <p class="text-body-1 mb-4 text-black">
                Free parking is available on-site with over 200 spaces. Additional street parking is available within a short walk. Please follow signage for designated areas.
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Accessibility -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Accessibility</h2>
          <p class="text-body-1 mb-4 text-black">
            The Recollective is committed to being accessible to all visitors. The venue features:
          </p>
          <v-list>
            <v-list-item>
              <v-list-item-title>Wheelchair-accessible entrances and restrooms</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Elevators to all levels</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Assistive listening devices upon request</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-container class="py-8 text-center">
      <h2 class="text-h4 mb-4 text-black">Plan Your Visit</h2>
      <p class="text-body-1 mb-6 mx-auto text-black" style="max-width: 800px">
        Come explore The Recollective today. Check our events calendar for special market days or contact us for more information.
      </p>
      <v-btn color="black" variant="outlined" size="large" to="/events" class="rounded-pill px-8">View Events Calendar</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VisitUsView'
})
</script>