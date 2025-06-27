<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      :src="
        vendor?.CoverImage
          ? `https://cms.recollectivect.com${vendor.CoverImage.url}`
          : 'https://media.recollectivect.com/public/vendor_placeholder.jpg'
      "
      :height="$vuetify.display.smAndDown ? 300 : 500"
      scale="1.5"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-white text-center px-4"
      >
        <h1
          class="text-h3 font-weight-bold mb-4"
          :class="{ 'text-h4': $vuetify.display.smAndDown }"
        >
          {{ vendor?.BusinessName || 'Vendor' }}
        </h1>
      </div>
    </v-parallax>

    <!-- Main Content -->
    <v-container class="py-8 py-md-12">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <!-- Description Section -->
          <v-card elevation="2" class="pa-6 pa-md-8 mb-8" rounded="lg" v-if="vendor">
            <h2 class="text-h4 font-weight-bold mb-4 text-black">
              About {{ vendor.BusinessName }}
            </h2>
            <p class="text-body-1 text-justify text-black">
              {{ extractDescription(vendor.Description) }}
            </p>
          </v-card>

          <!-- Photo Gallery -->
          <v-card elevation="2" class="pa-6 pa-md-8 mb-8" rounded="lg" v-if="vendor?.Photos?.length">
            <h2 class="text-h4 font-weight-bold mb-6 text-black">Gallery</h2>
            <v-row>
              <v-col
                v-for="(photo, index) in vendor.Photos"
                :key="index"
                cols="12"
                sm="6"
                md="4"
              >
                <v-img
                  :src="`https://cms.recollectivect.com${photo.url}`"
                  :alt="`${vendor.BusinessName} Photo ${index + 1}`"
                  class="rounded-lg transition-transform hover:scale-105 cursor-pointer"
                  aspect-ratio="1.5"
                  cover
                  @click="openGallery(index)"
                ></v-img>
              </v-col>
            </v-row>
          </v-card>
          <v-card elevation="2" class="pa-6 pa-md-8 mb-8" rounded="lg" v-else-if="!loading && !error">
            <p class="text-body-1 text-black">No photos available for this vendor.</p>
          </v-card>

          <!-- Full-Screen Gallery Dialog -->
          <v-dialog v-model="galleryDialog" max-width="90vw">
            <v-card>
              <v-btn
                icon
                color="primary"
                class="close-btn"
                @click="galleryDialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-carousel
                v-model="selectedPhotoIndex"
                hide-delimiters
                :show-arrows="vendor?.Photos && vendor.Photos.length > 1"
                height="80vh"
              >
                <v-carousel-item
                  v-for="(photo, index) in vendor?.Photos"
                  :key="index"
                  :src="`https://cms.recollectivect.com${photo.url}`"
                  :alt="`${vendor?.BusinessName} Photo ${index + 1}`"
                  cover
                ></v-carousel-item>
              </v-carousel>
            </v-card>
          </v-dialog>

          <!-- Contact Section -->
          <v-card elevation="2" class="pa-6 pa-md-8 mb-8" rounded="lg" v-if="vendor">
            <h2 class="text-h4 font-weight-bold mb-6 text-black">Contact</h2>
            <v-list bg-color="transparent">
              <v-list-item v-if="vendor.Email" class="mb-4">
                <template v-slot:prepend>
                  <v-icon icon="mdi-email" color="primary" class="mr-3"></v-icon>
                </template>
                <v-list-item-title class="font-weight-bold">Email</v-list-item-title>
                <v-list-item-subtitle>
                  <a :href="`mailto:${vendor.Email}`" class="text-decoration-none">
                    {{ vendor.Email }}
                  </a>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="vendor.IGHandle" class="mb-4">
                <template v-slot:prepend>
                  <v-icon icon="mdi-instagram" color="primary" class="mr-3"></v-icon>
                </template>
                <v-list-item-title class="font-weight-bold">Instagram</v-list-item-title>
                <v-list-item-subtitle>
                  <a
                    :href="`https://www.instagram.com/${vendor.IGHandle.replace('@', '')}`"
                    target="_blank"
                    class="text-decoration-none"
                  >
                    @{{ vendor.IGHandle }}
                  </a>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>

          <!-- Share Section -->
          <v-card elevation="2" class="pa-6 pa-md-8 mb-8" rounded="lg" v-if="vendor">
            <h2 class="text-h4 font-weight-bold mb-6 text-black">Share</h2>
            <div class="d-flex flex-wrap gap-2 justify-center">
              <!-- Facebook Share -->
              <v-btn
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                icon
                variant="outlined"
                color="primary"
                class="social-btn mx-2"
              >
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <!-- X Share -->
              <v-btn
                :href="`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`"
                target="_blank"
                icon
                variant="outlined"
                color="primary"
                class="social-btn mx-2"
              >
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <!-- Instagram Share (Link to Profile or Disabled) -->
              <v-btn
                v-if="vendor.IGHandle"
                :href="`https://www.instagram.com/${vendor.IGHandle.replace('@', '')}`"
                target="_blank"
                icon
                variant="outlined"
                color="primary"
                class="social-btn mx-2"
              >
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                variant="outlined"
                color="grey"
                class="social-btn mx-2"
                disabled
                title="Instagram sharing unavailable"
              >
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
            </div>
          </v-card>

          <!-- Back to Vendors -->
          <div class="text-center mt-8">
            <v-btn
              color="primary"
              variant="outlined"
              to="/vendors"
              class="text-uppercase"
            >
              Back to All Vendors
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading or Error State -->
    <v-container v-if="loading" class="py-8 text-center">
      <p class="text-body-1 text-black">Loading vendor details...</p>
    </v-container>
    <v-container v-if="error" class="py-8 text-center">
      <p class="text-body-1 text-red">{{ error }}</p>
      <v-btn
        color="primary"
        variant="outlined"
        to="/vendors"
        class="mt-4 text-uppercase"
      >
        View All Vendors
      </v-btn>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import axios from 'axios';

interface DescriptionNode {
  type: string;
  children: { text: string; type: string }[];
}

interface Media {
  id: number;
  name: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    [key: string]: any;
  };
}

interface Vendor {
  id: number;
  documentId: string;
  BusinessName: string;
  Email: string | null;
  IGHandle: string | null;
  Description: DescriptionNode[];
  Active: boolean;
  StartDate: string;
  Phone: string | null;
  CoverImage: Media | null;
  Photos: Media[] | null;
}

export default defineComponent({
  name: 'VendorView',
  data(): {
    vendor: Vendor | null;
    loading: boolean;
    error: string | null;
    galleryDialog: boolean;
    selectedPhotoIndex: number;
  } {
    return {
      vendor: null,
      loading: true,
      error: null,
      galleryDialog: false,
      selectedPhotoIndex: 0,
    };
  },
  computed: {
    shareUrl(): string {
      return window.location.href;
    },
    shareText(): string {
      return `Check out ${this.vendor?.BusinessName || 'this vendor'} at The Recollective in Bridgeport, CT!`;
    },
  },
  created() {
    this.loadVendor();
  },
  methods: {
    async loadVendor() {
      this.loading = true;
      try {
        const documentId = this.$route.params.documentId;
        const response = await axios.get(
          `https://cms.recollectivect.com/api/vendors/${documentId}?populate[0]=CoverImage&populate[1]=Photos`,
          {
            headers: {
              Authorization: `Bearer ffd1ecc6d7e6412700902194d78a066135b008d66ee965c713a2fb7199e8b70b6c2e2b361672f452fceb5ec1829a5b94f94084eca3489879be0df6354ec871e8e9c644456c04ce9e7811ae8878981ec85cc1873cf1176f642fcb1ee729a41ab7c127bf6367625e04e9af8e7194913a94974f291021c5780c161c830f8f346e0b`,
            },
          }
        );
        this.vendor = response.data.data;
        if (!this.vendor) {
          throw new Error('Vendor not found');
        }
        if (!this.vendor.Active) {
          this.error = 'This vendor is not active.';
          this.vendor = null;
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          this.error = `Vendor with ID ${this.$route.params.documentId} not found.`;
        } else {
          this.error = 'Failed to load vendor details. Please try again later.';
        }
        console.error('Error loading vendor:', err);
        this.vendor = null;
      } finally {
        this.loading = false;
      }
    },
    extractDescription(description: DescriptionNode[] | undefined): string {
      if (!description || !Array.isArray(description)) return 'No description available.';
      return description
        .map((node) =>
          node.children
            .filter((child) => child.type === 'text')
            .map((child) => child.text)
            .join('')
        )
        .join(' ');
    },
    openGallery(index: number) {
      this.selectedPhotoIndex = index;
      this.galleryDialog = true;
    },
  },
});
</script>

<style scoped>
.v-parallax {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

.v-img {
  transition: transform 0.3s ease;
}

.v-img:hover {
  transform: scale(1.05);
}

.text-justify {
  text-align: justify;
}

.v-btn {
  letter-spacing: 0.1em;
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.v-carousel {
  background: #000; /* Dark background for full-screen images */
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 2rem !important;
  }
  .text-h4 {
    font-size: 1.5rem !important;
  }
  .text-body-1 {
    font-size: 0.875rem !important;
  }
  .v-container {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
</style>
