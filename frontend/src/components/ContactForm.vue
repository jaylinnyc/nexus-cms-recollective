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
              label="Name"
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
              v-model="subject"
              :rules="subjectRules"
              label="Subject"
              required
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="message"
              :rules="messageRules"
              label="Message"
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
              Send Message
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
            <h2 class="text-h5 font-weight-bold mb-4">Message Sent!</h2>
            <p class="text-body-1 text-grey-darken-1 mb-6">
              Thank you for contacting us. We'll get back to you soon.
            </p>
            <v-btn
              color="primary"
              variant="outlined"
              @click="resetForm"
            >
              Send Another Message
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
  name: 'ContactForm',
  setup() {
    const valid = ref(false)
    const loading = ref(false)
    const submitted = ref(false)
    const name = ref('')
    const email = ref('')
    const subject = ref('')
    const message = ref('')
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    const nameRules = [
      (v: string) => !!v || 'Name is required'
    ]

    const emailRules = [
      (v: string) => !!v || 'Email is required',
      (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
    ]

    const subjectRules = [
      (v: string) => !!v || 'Subject is required'
    ]

    const messageRules = [
      (v: string) => !!v || 'Message is required',
      (v: string) => v.length >= 10 || 'Message must be at least 10 characters'
    ]

    const submitForm = async () => {
      loading.value = true
      try {
        // Format the email body to include the sender's name and email
        const emailBody = `From: ${name.value} <${email.value}>\n\n${message.value}`

        await api.post(`/send-email`, {
          subject: subject.value,
          body: emailBody
        })

        // Reset form and show success
        name.value = ''
        email.value = ''
        subject.value = ''
        message.value = ''
        submitted.value = true
      } catch (error) {
        // Type the error as AxiosError
        const axiosError = error as AxiosError<{ error?: string }>
        // Show error message
        const errorMessage = axiosError.response?.data?.error || 'Failed to send email'
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
      subject.value = ''
      message.value = ''
      valid.value = false
    }

    return {
      valid,
      loading,
      submitted,
      name,
      email,
      subject,
      message,
      nameRules,
      emailRules,
      subjectRules,
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