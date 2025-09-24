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
                v-model="name"
                :rules="nameRules"
                label="Full Name"
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
                v-model="position"
                :items="positionOptions"
                :rules="positionRules"
                label="Position Applied For"
                required
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="message"
                :rules="messageRules"
                label="Tell us about yourself and why you're a good fit for this position"
                required
                variant="outlined"
                rows="4"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="attachment"
                :rules="attachmentRules"
                label="Upload Resume or Cover Letter (PDF, DOC, DOCX)"
                accept=".pdf,.doc,.docx"
                show-size
                variant="outlined"
                hint="Maximum file size: 5MB"
                persistent-hint
              ></v-file-input>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-btn
                color="primary"
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
              <h2 class="text-h5 font-weight-bold mb-4">Application Submitted!</h2>
              <p class="text-body-1 text-grey-darken-1 mb-6">
                Thank you for applying to join Recollective. We'll review your application and reach out soon.
              </p>
              <v-btn
                color="primary"
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
  import {api} from '@/plugins/axios'
  
  export default defineComponent({
    name: 'JobApplicationForm',
    setup() {
      const valid = ref(false)
      const loading = ref(false)
      const submitted = ref(false)
      const name = ref('')
      const email = ref('')
      const phone = ref('')
      const position = ref('')
      const message = ref('')
      const attachment = ref<File[]>([])
      const snackbar = ref({
        show: false,
        message: '',
        color: 'success'
      })
  
      const positionOptions = [
        'Program Coordinator - Workforce Development',
        'Culinary Arts Instructor (Part-Time)',
        'Development Associate',
        'Administrative Assistant'
      ]
  
      const nameRules = [
        (v: string) => !!v || 'Name is required'
      ]
  
      const emailRules = [
        (v: string) => !!v || 'Email is required',
        (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
      ]
  
      const phoneRules = [
        (v: string) => !v || /^\+?1?\d{10,15}$/.test(v.replace(/\D/g, '')) || 'Phone number must be valid'
      ]
  
      const positionRules = [
        (v: string) => !!v || 'Please select a position'
      ]
  
      const messageRules = [
        (v: string) => !!v || 'Message is required',
        (v: string) => v.length >= 20 || 'Message must be at least 20 characters'
      ]
  
      const attachmentRules = [
        (files: File[]) => !files.length || files[0].size <= 5 * 1024 * 1024 || 'File size must be less than 5MB',
        (files: File[]) => !files.length || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0].type) || 'File must be PDF, DOC, or DOCX'
      ]
  
      const submitForm = async () => {
        loading.value = true
        try {
          // Create FormData for multipart form submission
          const formData = new FormData()
          formData.append('subject', `Job Application for ${position.value} from ${name.value}`)
          formData.append('body', `
            Job Application
            Name: ${name.value}
            Email: ${email.value}
            Phone: ${phone.value || 'Not provided'}
            Position: ${position.value}
            
            Message:
            ${message.value}
          `)
          if (attachment.value.length) {
            formData.append('attachment', attachment.value[0])
          }
  
          await api.post('/send-email', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
  
          // Reset form and show success
          name.value = ''
          email.value = ''
          phone.value = ''
          position.value = ''
          message.value = ''
          attachment.value = []
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
        name.value = ''
        email.value = ''
        phone.value = ''
        position.value = ''
        message.value = ''
        attachment.value = []
        valid.value = false
      }
  
      return {
        valid,
        loading,
        submitted,
        name,
        email,
        phone,
        position,
        message,
        attachment,
        positionOptions,
        nameRules,
        emailRules,
        phoneRules,
        positionRules,
        messageRules,
        attachmentRules,
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