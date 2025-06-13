<template>
  <div>
    <!-- Show form if not successfully submitted -->
    <v-form
      v-if="!submitted"
      ref="form"
      v-model="valid"
      @submit.prevent="submitForm"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="businessName"
              :rules="businessNameRules"
              label="Business Name"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="contactName"
              :rules="nameRules"
              label="Contact Full Name"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="phone"
              :rules="phoneRules"
              label="Phone Number"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="inventoryDescription"
              :rules="inventoryRules"
              label="Describe Your Inventory (Antiques, Vintage, Artwork, etc.)"
              required
              variant="outlined"
              rows="3"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="experience"
              :rules="experienceRules"
              label="Tell Us About Your Experience and Background"
              required
              variant="outlined"
              rows="4"
            ></v-textarea>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-btn
              color="black"
              size="large"
              type="submit"
              :disabled="!valid"
              :loading="loading"
            >
              Submit Application
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <!-- Show success message after submission -->
    <v-container v-else>
      <v-row justify="center">
        <v-col cols="12">
          <v-card elevation="2" class="pa-6 text-center">
            <v-icon size="48" color="success" class="mb-4">mdi-check-circle</v-icon>
            <h2 class="text-h5 font-weight-bold mb-4 text-black">Application Submitted!</h2>
            <p class="text-body-1 text-grey-darken-1 mb-6">
              Thank you for applying to become a vendor at The Recollective. We'll review your application and reach out soon to discuss next steps.
            </p>
            <v-btn
              color="black"
              variant="outlined"
              @click="resetForm"
            >
              Submit Another Application
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar for error messages -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AxiosError } from 'axios'
import api from '@/plugins/axios'

export default defineComponent({
  name: 'VendorForm',
  setup() {
    const valid = ref(false)
    const loading = ref(false)
    const submitted = ref(false)
    const businessName = ref('')
    const contactName = ref('')
    const email = ref('')
    const phone = ref('')
    const inventoryDescription = ref('')
    const experience = ref('')
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    const businessNameRules = [
      (v: string) => !!v || 'Business name is required'
    ]

    const nameRules = [
      (v: string) => !!v || 'Contact name is required'
    ]

    const emailRules = [
      (v: string) => !!v || 'Email is required',
      (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
    ]

    const phoneRules = [
      (v: string) => !v || /^\+?1?\d{10,15}$/.test(v.replace(/\D/g, '')) || 'Phone number must be valid'
    ]

    const inventoryRules = [
      (v: string) => !!v || 'Inventory description is required',
      (v: string) => v.length >= 20 || 'Description must be at least 20 characters'
    ]

    const experienceRules = [
      (v: string) => !!v || 'Experience is required',
      (v: string) => v.length >= 20 || 'Experience must be at least 20 characters'
    ]

    const submitForm = async () => {
      loading.value = true
      try {
        // Format the email body to include all form data
        const emailBody = `
          Vendor Application
          Business Name: ${businessName.value}
          Contact Name: ${contactName.value}
          Email: ${email.value}
          Phone: ${phone.value || 'Not provided'}
          Inventory Description: ${inventoryDescription.value}
          Experience: ${experience.value}
        `

        await api.post(`/send-email`, {
          subject: `Vendor Application from ${contactName.value}`,
          body: emailBody
        })

        // Reset form and show success
        businessName.value = ''
        contactName.value = ''
        email.value = ''
        phone.value = ''
        inventoryDescription.value = ''
        experience.value = ''
        submitted.value = true
      } catch (error) {
        // Type the error as AxiosError
        const axiosError = error as AxiosError<{ error?: string }>
        // Show error message
        const errorMessage = axiosError.response?.data?.error || 'Failed to submit application'
        snackbar.value = {
          show: true,
          message: `Error: ${errorMessage}`,
          color: 'error'
        }
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      submitted.value = false
      businessName.value = ''
      contactName.value = ''
      email.value = ''
      phone.value = ''
      inventoryDescription.value = ''
      experience.value = ''
      valid.value = false
    }

    return {
      valid,
      loading,
      submitted,
      businessName,
      contactName,
      email,
      phone,
      inventoryDescription,
      experience,
      businessNameRules,
      nameRules,
      emailRules,
      phoneRules,
      inventoryRules,
      experienceRules,
      submitForm,
      resetForm,
      snackbar
    }
  }
})
</script>

<style scoped>
/* Ensure the success card is responsive */
.v-card {
  transition: all 0.3s ease;
}

/* Improve touch interaction on mobile */
.v-btn {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>