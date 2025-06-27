<template>
  <div>
    <!-- Become a Vendor Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/become_vendor.jpg"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
      </div>
    </v-parallax>

    <!-- Introduction -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1>
            JOIN OUR COMMUNITY
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <!-- Application Details -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h2 class="text-h4 mb-6 text-black">Application Process</h2>
          <p class="text-body-1 mb-4 text-black">
            We aim to make becoming a vendor at The Recollective a straightforward process. We seek vendors offering unique, high-quality items with a story to ensure a cohesive market experience.
          </p>
          <v-list>
            <v-list-item>
              <v-list-item-title><b>Step 1:</b> Submit online application.</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><b>Step 2:</b> Review and approval.</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><b>Step 3:</b> Booth assignment and onboarding.</v-list-item-title>
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