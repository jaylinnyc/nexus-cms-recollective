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
                v-model="organizationName"
                :rules="organizationNameRules"
                label="Organization Name"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="contactName"
                :rules="contactNameRules"
                label="Contact Name"
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
              <v-select
                v-model="partnershipType"
                :items="partnershipTypeOptions"
                :rules="partnershipTypeRules"
                label="Partnership Type"
                required
                variant="outlined"
                multiple
                chips
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="message"
                :rules="messageRules"
                label="Tell us about your organization and partnership goals"
                required
                variant="outlined"
                rows="4"
              ></v-textarea>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn
                color="primary"
                size="large"
                type="submit"
                :disabled="!valid"
                :loading="loading"
              >
                Submit Partnership Inquiry
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
              <h2 class="text-h5 font-weight-bold mb-4">Inquiry Submitted!</h2>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                Thank you for your interest in partnering with Recollective. We'll reach out soon to discuss next steps.
              </p>
              <v-btn
                color="primary"
                variant="outlined"
                @click="resetForm"
              >
                Submit Another Inquiry
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
  import {api} from '@/plugins/axios'
  
  export default defineComponent({
    name: 'PartnerForm',
    setup() {
      const valid = ref(false)
      const loading = ref(false)
      const submitted = ref(false)
      const organizationName = ref('')
      const contactName = ref('')
      const email = ref('')
      const phone = ref('')
      const partnershipType = ref<string[]>([])
      const message = ref('')
      const snackbar = ref({
        show: false,
        message: '',
        color: 'success'
      })
  
      const partnershipTypeOptions = [
        'Corporate Partnership',
        'Educational Partnership',
        'Community Organization Partnership',
        'Government Partnership'
      ]
  
      const organizationNameRules = [
        (v: string) => !!v || 'Organization name is required'
      ]
  
      const contactNameRules = [
        (v: string) => !!v || 'Contact name is required'
      ]
  
      const emailRules = [
        (v: string) => !!v || 'Email is required',
        (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
  
      const phoneRules = [
        (v: string) => !v || /^\+?1?\d{10,15}$/.test(v.replace(/\D/g, '')) || 'Phone number must be valid'
      ]
  
      const partnershipTypeRules = [
        (v: string[]) => v.length > 0 || 'Please select at least one partnership type'
      ]
  
      const messageRules = [
        (v: string) => !!v || 'Message is required',
        (v: string) => v.length >= 20 || 'Message must be at least 20 characters'
      ]
  
      const submitForm = async () => {
        loading.value = true
        try {
          // Format the email body to include all form data
          const emailBody = `
            Partnership Inquiry
            Organization: ${organizationName.value}
            Contact Name: ${contactName.value}
            Email: ${email.value}
            Phone: ${phone.value || 'Not provided'}
            Partnership Type: ${partnershipType.value.join(', ')}
            
            Message:
            ${message.value}
          `
  
          await api.post(`/send-email`, {
            subject: `Partnership Inquiry from ${organizationName.value}`,
            body: emailBody
          })
  
          // Reset form and show success
          organizationName.value = ''
          contactName.value = ''
          email.value = ''
          phone.value = ''
          partnershipType.value = []
          message.value = ''
          submitted.value = true
        } catch (error) {
          // Type the error as AxiosError
          const axiosError = error as AxiosError<{ error?: string }>
          // Show error message
          const errorMessage = axiosError.response?.data?.error || 'Failed to submit inquiry'
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
        organizationName.value = ''
        contactName.value = ''
        email.value = ''
        phone.value = ''
        partnershipType.value = []
        message.value = ''
        valid.value = false
      }
  
      return {
        valid,
        loading,
        submitted,
        organizationName,
        contactName,
        email,
        phone,
        partnershipType,
        message,
        partnershipTypeOptions,
        organizationNameRules,
        contactNameRules,
        emailRules,
        phoneRules,
        partnershipTypeRules,
        messageRules,
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