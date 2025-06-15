<template>
  <div>
    <!-- Events Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/web%2Fantiques–800w.png"
      :height="$vuetify.display.smAndDown ? 300 : 400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-white text-center px-4">
        <h1 class="text-h4 font-weight-bold mb-2" :class="{ 'text-h5': $vuetify.display.xs }">
          Upcoming Events
        </h1>
        <p class="text-body-1 text-white-70" :class="{ 'text-body-2': $vuetify.display.xs }">
          Join our community events and stay connected with The Recollective.
        </p>
      </div>
    </v-parallax>

    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="11" lg="10">
          <v-row v-if="loading">
            <v-col cols="12">
              <v-progress-linear indeterminate color="primary" class="mb-4"></v-progress-linear>
            </v-col>
          </v-row>
          <v-row v-else-if="events.length === 0 && !error">
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4 text-center">
                <v-card-text>
                  <v-icon size="48" color="grey" class="mb-2">mdi-calendar-remove</v-icon>
                  <p class="text-h6">No events found</p>
                  <p class="text-body-1 text-grey-darken-1">
                    Check back later for upcoming events.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-else-if="error">
            <v-col cols="12">
              <v-alert type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col
              v-for="event in events"
              :key="event.id"
              cols="12"
              sm="12"
              md="6"
            >
              <v-card
                class="event-card"
                elevation="4"
                rounded="lg"
                :style="{ transition: 'transform 0.2s' }"
                @mouseover="hoverCard(event.id)"
                @mouseleave="resetHover"
              >
                <v-img
                  :src="event.attachments?.find(att => att.mimeType.startsWith('image/'))?.fileUrl || 'https://placehold.co/400x200?text=Event+Banner'"
                  :height="$vuetify.display.smAndDown ? 150 : 200"
                  cover
                  class="rounded-t-lg"
                  :alt="event.summary || 'Event Image'"
                ></v-img>
                <v-card-title class="text-h6 font-weight-bold text-wrap">
                  {{ event.summary || 'Untitled Event' }}
                </v-card-title>
                <v-card-text>
                  <div v-if="event.description" class="mb-2">
                    <v-icon small color="primary" class="mr-1">mdi-text</v-icon>
                    <span class="text-body-2">
                      <strong>Description:</strong> {{ truncateDescription(event.description) }}
                    </span>
                  </div>
                  <div class="mb-2">
                    <v-icon small color="primary" class="mr-1">mdi-calendar-start</v-icon>
                    <span class="text-body-2">
                      <strong>Start:</strong> {{ formatDate(event.start) }}
                    </span>
                  </div>
                  <div class="mb-2">
                    <v-icon small color="primary" class="mr-1">mdi-calendar-end</v-icon>
                    <span class="text-body-2">
                      <strong>End:</strong> {{ formatDate(event.end) }}
                    </span>
                  </div>
                  <div v-if="event.location" class="mb-2">
                    <v-icon small color="primary" class="mr-1">mdi-map-marker</v-icon>
                    <span class="text-body-2">
                      <strong>Location:</strong> {{ event.location }}
                    </span>
                  </div>
                  <div v-if="event.webConference" class="mb-2">
                    <v-icon small color="primary" class="mr-1">mdi-video</v-icon>
                    <span class="text-body-2">
                      <strong>Online:</strong>
                      <a
                        :href="event.webConference"
                        target="_blank"
                        rel="noopener"
                        class="text-primary text-decoration-none"
                      >
                        Join Google Meet
                      </a>
                    </span>
                  </div>
                  <div v-if="event.attachments && event.attachments.length > 0">
                    <span class="text-body-2 font-weight-medium">Attachments:</span>
                    <ul class="attachment-list">
                      <li
                        v-for="attachment in event.attachments"
                        :key="attachment.fileId"
                        class="text-body-2"
                      >
                        <v-icon
                          small
                          color="primary"
                          class="mr-1"
                          v-if="attachment.mimeType === 'application/pdf'"
                        >mdi-file-pdf-box</v-icon>
                        <v-icon
                          small
                          color="primary"
                          class="mr-1"
                          v-else
                        >mdi-file</v-icon>
                        <a
                          :href="attachment.fileUrl"
                          target="_blank"
                          rel="noopener"
                          class="text-primary text-decoration-none"
                        >
                          {{ attachment.title }}
                        </a>
                        <span class="text-grey-darken-1">
                          ({{ attachment.mimeType === 'application/pdf' ? 'PDF' : attachment.mimeType }})
                        </span>
                      </li>
                    </ul>
                  </div>
                </v-card-text>
                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    class="text-capitalize"
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { AxiosError } from 'axios'
import api from '@/plugins/axios'

interface CalendarEvent {
  id: string
  summary: string
  description: string
  location: string
  webConference: string
  start: string
  end: string
  attachments: Array<{
    fileId: string
    title: string
    mimeType: string
    fileUrl: string
  }>
}

export default defineComponent({
  name: 'Events',
  setup() {
    const loading = ref(false)
    const events = ref<CalendarEvent[]>([])
    const error = ref<string | null>(null)
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })
    const hoveredCard = ref<string | null>(null)

    // Format date for display
    const formatDate = (dateString: string): string => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    }

    // Truncate long descriptions
    const truncateDescription = (description: string): string => {
      const maxLength = 100
      return description.length > maxLength
        ? `${description.substring(0, maxLength)}...`
        : description
    }

    // Handle card hover
    const hoverCard = (id: string) => {
      hoveredCard.value = id
    }

    const resetHover = () => {
      hoveredCard.value = null
    }

    // Fetch events from backend
    const fetchEvents = async () => {
      loading.value = true
      error.value = null
      events.value = []
      try {
        // Set date range: current date to one year from now
        const timeMin = new Date().toISOString()
        const timeMax = new Date()
        timeMax.setFullYear(timeMax.getFullYear() + 1)

        const params: Record<string, string> = {
          calendar_name: 'The Recollective',
          time_min: timeMin,
          time_max: timeMax.toISOString(),
          max_results: '10'
        }

        const response = await api.get(`/calendar-events`, { params })

        events.value = response.data
        if (events.value.length === 0) {
          snackbar.value = {
            show: true,
            message: 'No events found for the selected calendar.',
            color: 'info'
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ error?: string }>
        const errorMessage = axiosError.response?.data?.error || 'Failed to fetch events'
        error.value = errorMessage
        snackbar.value = {
          show: true,
          message: `Error: ${errorMessage}`,
          color: 'error'
        }
      } finally {
        loading.value = false
      }
    }

    // Fetch events on component mount
    onMounted(() => {
      fetchEvents()
    })

    return {
      loading,
      events,
      error,
      snackbar,
      hoveredCard,
      formatDate,
      truncateDescription,
      hoverCard,
      resetHover,
      fetchEvents
    }
  }
})
</script>

<style scoped>
.event-card:hover {
  transform: translateY(-4px);
}

.attachment-list {
  list-style-type: none;
  padding: 0;
  margin-top: 8px;
}

.attachment-list li {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

/* Ensure cards are touch-friendly on mobile */
.event-card {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Improve text readability on smaller screens */
@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.1rem !important;
  }
  .text-body-2 {
    font-size: 0.85rem !important;
  }
}
</style>
