<template>
  <div>
    <!-- Contact Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/contact_us_banner.jpg"
      :height="$vuetify.display.smAndDown ? 250 : 400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white text-center px-4">
        <h1 class="text-h4 font-weight-bold mb-2" :class="{ 'text-h5': $vuetify.display.xs }">
          Contact Us
        </h1>
        <p class="text-body-1 text-white-70" :class="{ 'text-body-2': $vuetify.display.xs }">
          Connect with our community today
        </p>
      </div>
    </v-parallax>

    <!-- Contact Information -->
    <v-container class="py-6 py-md-10">
      <v-row justify="center">
        <v-col cols="12" md="11" lg="10">
          <h2 class="text-h4 font-weight-bold mb-6 text-center" :class="{ 'text-h5': $vuetify.display.xs }">
            Get In Touch
          </h2>
          <p class="text-body-1 text-grey-darken-2 mb-8 text-center px-2" :class="{ 'text-body-2': $vuetify.display.xs }">
            Questions about our programs or services? Use the form below or our contact details to reach out.
          </p>

          <v-row>
            <!-- Contact Form -->
            <v-col cols="12" md="6">
              <v-card elevation="2" class="pa-4 pa-md-6" rounded="lg">
                <h3 class="text-h5 font-weight-bold mb-4" :class="{ 'text-h6': $vuetify.display.xs }">
                  Send Us a Message
                </h3>
                <contact-form />
              </v-card>
            </v-col>

            <!-- Contact Details -->
            <v-col cols="12" md="6">
              <v-card elevation="2" class="pa-4 pa-md-6" rounded="lg">
                <v-list bg-color="transparent">
                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-map-marker" color="primary" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Address</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap">
                      588 State Street, Bridgeport, CT 06604
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-phone" color="primary" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Phone</v-list-item-title>
                    <v-list-item-subtitle>
                      <a href="tel:+5551234567" class="text-decoration-none">(212) 470-2207</a>
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item class="mb-2">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-email" color="primary" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Email</v-list-item-title>
                    <v-list-item-subtitle class="text-wrap">
                      <a href="mailto:info@recollectivect.com" class="text-decoration-none">
                        info@recollectivect.com
                      </a>
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-clock" color="primary" class="mr-3"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold">Hours</v-list-item-title>
                    <v-list-item-subtitle>Monday - Friday: 9:00 AM - 5:00 PM</v-list-item-subtitle>
                    <v-list-item-subtitle>Saturday: 10:00 AM - 2:00 PM (By appointment)</v-list-item-subtitle>
                    <v-list-item-subtitle>Sunday: (By appointment)</v-list-item-subtitle>
                  </v-list-item>
                </v-list>

                <div class="mt-4">
                  <h3 class="text-h6 font-weight-bold mb-3">Follow Us</h3>
                  <div class="d-flex flex-wrap gap-2">
                    <v-btn
                      v-for="social in socialLinks"
                      :key="social.icon"
                      :href="social.href"
                      target="_blank"
                      icon
                      variant="outlined"
                      color="primary"
                      size="small"
                      class="social-btn"
                    >
                      <v-icon>{{ social.icon }}</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Map -->
    <v-container fluid class="pa-0">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.776219737246!2d-73.19139168458916!3d41.17918997928424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e80e2b1f7c7b8b%3A0x6e8e6c8f8e8e6c8f!2s588%20State%20St%2C%20Bridgeport%2C%20CT%2006604!5e0!3m2!1sen!2us!4v1660000000000"
        width="100%"
        :height="$vuetify.display.smAndDown ? 250 : 350"
        style="border:0;"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ContactForm from '../components/ContactForm.vue'
import { AxiosError } from 'axios'
import api from '@/plugins/axios'

export default defineComponent({
  name: 'ContactView',
  components: {
    ContactForm
  },
  setup() {
    const newsletterValid = ref(false)
    const newsletterLoading = ref(false)
    const newsletterEmail = ref('')
    const hoveredCard = ref<string | null>(null)
    const newsletterSnackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    const socialLinks = [
      { icon: 'mdi-facebook', href: 'https://facebook.com' },
      { icon: 'mdi-twitter', href: 'https://twitter.com' },
      { icon: 'mdi-instagram', href: 'https://instagram.com' },
      { icon: 'mdi-linkedin', href: 'https://linkedin.com' }
    ]

    const departments = [
      {
        title: 'Program Inquiries',
        icon: 'mdi-school',
        email: 'programs@recollectivect.com',
        phone: '(555) 123-4568'
      },
      {
        title: 'Volunteer Services',
        icon: 'mdi-hand-heart',
        email: 'volunteer@recollectivect.com',
        phone: '(555) 123-4569'
      },
      {
        title: 'Housing Services',
        icon: 'mdi-home',
        email: 'housing@recollectivect.com',
        phone: '(555) 123-4570'
      },
      {
        title: 'Donations',
        icon: 'mdi-cash-multiple',
        email: 'donate@recollectivect.com',
        phone: '(555) 123-4571'
      }
    ]

    const emailRules = [
      (v: string) => !!v || 'Email is required',
      (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
    ]

    const hoverCard = (title: string) => {
      hoveredCard.value = title
    }

    const resetHover = () => {
      hoveredCard.value = null
    }

    const subscribe = async () => {
      newsletterLoading.value = true
      try {
        await api.post('/newsletter-subscribe', {
          email: newsletterEmail.value
        })
        newsletterEmail.value = ''
        newsletterSnackbar.value = {
          show: true,
          message: 'Subscribed successfully!',
          color: 'success'
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>
        const errorMessage = axiosError.response?.data?.error || 'Failed to subscribe'
        newsletterSnackbar.value = {
          show: true,
          message: `Error: ${errorMessage}`,
          color: 'error'
        }
      } finally {
        newsletterLoading.value = false
      }
    }

    return {
      newsletterValid,
      newsletterLoading,
      newsletterEmail,
      newsletterSnackbar,
      socialLinks,
      departments,
      emailRules,
      hoveredCard,
      hoverCard,
      resetHover,
      subscribe
    }
  }
})
</script>

<style scoped>
.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.v-card:hover {
  transform: translateY(-4px);
}

.v-list-item-subtitle {
  white-space: normal;
  word-break: break-word;
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
  .text-h5 {
    font-size: 1.25rem !important;
  }
  .text-body-1 {
    font-size: 0.875rem !important;
  }
  .text-body-2 {
    font-size: 0.75rem !important;
  }
  .v-container {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

.v-btn, .v-card {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.v-list-item {
  padding: 6px 0;
}
</style>