<template>
  <div>
    <!-- Become a Vendor Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/web%2Fantiques–800w.png"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h3 font-weight-bold">Become a Vendor</h1>
      </div>
    </v-parallax>

    <!-- Introduction -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <p class="text-body-1 mb-6 text-black">
            Join the vibrant community at The Recollective, a historic 50,000-square-foot marketplace in Bridgeport. We welcome antique dealers, vintage collectors, and local artists to share their passion and treasures with our visitors.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Booth Options -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Booth Options</h2>
          <v-row>
            <v-col cols="12" md="6">
              <v-card height="100%" class="pa-6 text-center">
                <v-icon icon="mdi-store" size="64" color="black" class="mb-4"></v-icon>
                <v-card-title class="text-h5 text-black">Standard Booth</v-card-title>
                <v-card-text class="text-black">
                  <p class="mb-4">
                    Ideal for individual vendors. Includes 10x10 ft space with basic shelving and lighting.
                  </p>
                  <p><strong>Price:</strong> Contact us for rates</p>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card height="100%" class="pa-6 text-center">
                <v-icon icon="mdi-storefront" size="64" color="black" class="mb-4"></v-icon>
                <v-card-title class="text-h5 text-black">Premium Booth</v-card-title>
                <v-card-text class="text-black">
                  <p class="mb-4">
                    Perfect for larger displays. Includes 10x20 ft space with custom shelving and enhanced lighting.
                  </p>
                  <p><strong>Price:</strong> Contact us for rates</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Application Details -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Application Process</h2>
          <p class="text-body-1 mb-4 text-black">
            Becoming a vendor at The Recollective is a straightforward process. We seek vendors who align with our mission of offering unique, high-quality items with a story.
          </p>
          <v-list>
            <v-list-item>
              <v-list-item-title>Submit an online application with details about your inventory and experience.</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Review by our vendor committee to ensure a diverse and cohesive market.</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Approval and booth assignment, with support for setup and marketing.</v-list-item-title>
            </v-list-item>
          </v-list>
          <div class="text-center mt-6">
            <v-btn
              color="black"
              variant="outlined"
              size="large"
              @click="showVendorForm = true"
              class="rounded-pill px-8"
            >
              Apply Now
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Vendor Expectations -->
    <v-container class="py-8 bg-grey-lighten-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Vendor Expectations</h2>
          <p class="text-body-1 mb-4 text-black">
            We value a collaborative and professional environment. Vendors are expected to:
          </p>
          <v-list>
            <v-list-item>
              <v-list-item-title>Maintain high-quality, curated inventory.</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Adhere to market hours and setup guidelines.</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Participate in at least one community event per year.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-container class="py-8 text-center">
      <h2 class="text-h4 mb-4 text-black">Join Our Community</h2>
      <p class="text-body-1 mb-6 mx-auto text-black" style="max-width: 800px">
        Become part of The Recollective’s unique marketplace. Apply today and start sharing your treasures with our visitors.
      </p>
      <v-btn color="black" variant="outlined" size="large" to="/become-a-vendor" class="rounded-pill px-8">Apply Now</v-btn>
    </v-container>

    <!-- Vendor Form Dialog -->
    <v-dialog
      v-model="showVendorForm"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 text-black">
          Vendor Application
        </v-card-title>
        <v-card-text>
          <VendorForm />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="showVendorForm = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import VendorForm from '@/components/VendorForm.vue'

export default defineComponent({
  name: 'BecomeVendorView',
  components: {
    VendorForm
  },
  setup() {
    const showVendorForm = ref(false)

    return {
      showVendorForm
    }
  }
})
</script>