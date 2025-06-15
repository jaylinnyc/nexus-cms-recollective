<template>
  <div>
    <!-- Vendors Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/web%2Fantiques–800w.png"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-medium-emphasis">
        <h1 class="text-h3 font-weight-bold text-white">Our Vendors</h1>
      </div>
    </v-parallax>
    
    <!-- Vendors Overview -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <p class="text-body-1 mb-6 text-black">
            The Recollective is home to a vibrant community of vendors, each bringing unique stories, styles, and treasures to our historic marketplace in Bridgeport. From seasoned antique dealers to emerging artists, discover the passion behind every booth.
          </p>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Vendor: Vintage Décor & European Finds -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-row>
            <v-col cols="12" md="6" order="2" order-md="1">
              <h2 class="text-h4 mb-4 text-black">Vintage Décor & European Finds</h2>
              <p class="text-body-1 mb-4 text-justify text-black">
                With over 20 years of experience, this vendor curates French country antiques and decorative pieces with soul and character, offering a touch of old-world charm.
              </p>
              <h3 class="text-h6 mb-2 text-black">Specialties:</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title>French Country Antiques</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Decorative Pieces</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6" order="1" order-md="2" class="d-flex align-center">
              <v-img
                src="https://media.recollectivect.com/public/vendor_european.jpg"
                alt="Vintage Décor & European Finds"
                class="rounded-lg"
                height="300"
              ></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Vendor: Modern Art & Local Originals -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-row>
            <v-col cols="12" md="6" class="d-flex align-center">
              <v-img
                src="https://media.recollectivect.com/public/vendor_art.jpg"
                alt="Modern Art & Local Originals"
                class="rounded-lg"
                height="300"
              ></v-img>
            </v-col>
            <v-col cols="12" md="6">
              <h2 class="text-h4 mb-4 text-black">Modern Art & Local Originals</h2>
              <p class="text-body-1 mb-4 text-justify text-black">
                A local artist showcases original works, prints, and seasonal collections by regional makers, supporting emerging creatives with a dynamic booth.
              </p>
              <h3 class="text-h6 mb-2 text-black">Specialties:</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Original Artwork</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Seasonal Prints</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Vendor: Curiosities & Rare Treasures -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-row>
            <v-col cols="12" md="6" order="2" order-md="1">
              <h2 class="text-h4 mb-4 text-black">Curiosities & Rare Treasures</h2>
              <p class="text-body-1 mb-4 text-justify text-black">
                This vendor’s booth is a cabinet of wonders, featuring vintage signage and forgotten oddities perfect for designers and collectors seeking conversation pieces.
              </p>
              <h3 class="text-h6 mb-2 text-black">Specialties:</h3>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Vintage Signage</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Rare Oddities</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6" order="1" order-md="2" class="d-flex align-center">
              <v-img
                src="https://media.recollectivect.com/public/vendor_curiosities.jpg"
                alt="Curiosities & Rare Treasures"
                class="rounded-lg"
                height="300"
              ></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- Call to Action -->
    <v-container class="py-8 text-center">
      <h2 class="text-h4 mb-4 text-black">Discover More Vendors</h2>
      <p class="text-body-1 mb-6 mx-auto text-black" style="max-width: 800px">
        Explore the full range of talented vendors at The Recollective. Visit us or apply to join our community.
      </p>
      <v-btn color="black" variant="outlined" size="large" to="/vendors" class="rounded-pill px-8">Meet All Vendors</v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VendorsView'
})
</script>