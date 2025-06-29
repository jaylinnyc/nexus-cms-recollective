<template>
  <div class="vendor-page">
    <!-- Hero Section -->
    <v-parallax
      :src="vendorCoverImageUrl"
      :height="$vuetify.display.smAndDown ? 350 : 600"
      class="hero-parallax"
    >
      <div class="hero-overlay d-flex flex-column justify-center align-center text-center">
        <h1 class="hero-title mb-4">
          {{ vendor?.BusinessName || "Vendor" }}
        </h1>
        <div class="share-container mt-4">
          <v-btn
            color="white"
            variant="outlined"
            class="share-btn"
            @click="copyShareLink"
          >
            <v-icon left>mdi-share-variant</v-icon>
            Share
          </v-btn>
          <v-btn
            :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`"
            target="_blank"
            icon
            color="white"
            variant="outlined"
            class="social-btn"
          >
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
          <v-btn
            :href="`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`"
            target="_blank"
            icon
            color="white"
            variant="outlined"
            class="social-btn"
          >
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn
            v-if="vendor?.IGHandle"
            :href="`https://www.instagram.com/${vendor.IGHandle.replace('@', '')}`"
            target="_blank"
            icon
            color="white"
            variant="outlined"
            class="social-btn"
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <v-btn
            v-else
            icon
            color="grey"
            variant="outlined"
            class="social-btn"
            disabled
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
        </div>
      </div>
    </v-parallax>

    <!-- Main Content -->
    <v-container class="main-content py-12">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <!-- About Section -->
          <section class="about-section mb-12" v-if="vendor">
            <h2 class="section-title mb-6">About {{ vendor.BusinessName }}</h2>
            <p class="section-text">
              {{ extractDescription(vendor.Description) }}
            </p>
          </section>

          <!-- Photo Collage -->
          <section class="collage-section mb-12" v-if="vendor?.Photos?.length">
            <h2 class="section-title mb-6">Moments Captured</h2>
            <div class="photo-collage">
              <v-row dense>
                <v-col
                  v-for="(photo, index) in vendor.Photos"
                  :key="index"
                  :cols="getCollageCols(vendor.Photos.length, index)"
                  class="collage-item"
                >
                  <v-img
                    :src="`${apiUrl}${photo.url}`"
                    :alt="`${vendor.BusinessName} Photo ${index + 1}`"
                    class="collage-img"
                    aspect-ratio="1.2"
                    cover
                    @click="openFullImage(index)"
                  />
                </v-col>
              </v-row>
            </div>
          </section>
          <section class="no-photos mb-12" v-else-if="!loading && !error">
            <p class="section-text text-center">
              No photos available at this time.
            </p>
          </section>

          <!-- Full-Screen Image Dialog -->
          <v-dialog v-model="imageDialog" max-width="90vw" content-class="image-dialog">
            <v-card class="dialog-card">
              <v-btn
                icon
                color="white"
                class="dialog-close-btn"
                @click="imageDialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-img
                :src="selectedImageUrl"
                :alt="`${vendor?.BusinessName} Photo`"
                class="dialog-img"
                contain
              />
            </v-card>
          </v-dialog>

          <!-- Contact Section -->
          <section class="contact-section mb-12" v-if="vendor">
            <h2 class="section-title mb-6">Get in Touch</h2>
            <v-row justify="center" align="center" class="contact-row">
              <v-col cols="12" sm="5" v-if="vendor.Email" class="contact-item-col">
                <v-card flat class="contact-card pa-4">
                  <v-icon icon="mdi-email" color="primary" class="contact-icon" />
                  <div class="contact-details">
                    <span class="contact-label">Email</span>
                    <a :href="`mailto:${vendor.Email}`" class="contact-link" :title="vendor.Email">
                      {{ truncateText(vendor.Email, 20) }}
                    </a>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="5" v-if="vendor.IGHandle" class="contact-item-col">
                <v-card flat class="contact-card pa-4">
                  <v-icon icon="mdi-instagram" color="primary" class="contact-icon" />
                  <div class="contact-details">
                    <span class="contact-label">Instagram</span>
                    <a
                      :href="`https://www.instagram.com/${vendor.IGHandle.replace('@', '')}`"
                      target="_blank"
                      class="contact-link"
                      :title="vendor.IGHandle"
                    >
                      {{ truncateText(vendor.IGHandle, 20) }}
                    </a>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </section>

          <!-- Back Button -->
          <div class="text-center">
            <v-btn
              color="primary"
              variant="outlined"
              to="/vendors"
            >
              Explore All Vendors
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading/Error States -->
    <v-container v-if="loading" class="py-12 text-center">
      <v-progress-circular indeterminate color="primary" />
      <p class="mt-4 section-text">Loading vendor details...</p>
    </v-container>
    <v-container v-if="error" class="py-12 text-center">
      <p class="error-text">{{ error }}</p>
      <v-btn
        color="primary"
        variant="outlined"
        to="/vendors"
        class="mt-4"
      >
        View All Vendors
      </v-btn>
    </v-container>

    <!-- Snackbar for Share Link -->
    <v-snackbar v-model="snackbar" color="success" timeout="2000">
      Link copied to clipboard!
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import axios from "axios";

interface DescriptionNode {
  type: string;
  children: { text: string; type: string }[];
}

interface Media {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

interface Vendor {
  id: number;
  documentId: string;
  BusinessName: string;
  Email: string | null;
  IGHandle: string | null;
  Description: DescriptionNode[];
  Active: boolean;
  CoverImage: Media | null;
  Photos: Media[] | null;
}

export default defineComponent({
  name: "VendorView",
  data(): {
    vendor: Vendor | null;
    loading: boolean;
    error: string | null;
    imageDialog: boolean;
    selectedImageIndex: number;
    apiUrl: string;
    snackbar: boolean;
  } {
    return {
      vendor: null,
      loading: true,
      error: null,
      imageDialog: false,
      selectedImageIndex: 0,
      apiUrl: import.meta.env.VITE_APP_STRAPI_API_URL || "https://cms.recollectivect.com",
      snackbar: false,
    };
  },
  computed: {
    shareUrl(): string {
      return window.location.href;
    },
    shareText(): string {
      return `Discover ${this.vendor?.BusinessName || "this vendor"} at The Recollective in Bridgeport, CT!`;
    },
    vendorCoverImageUrl(): string {
      return this.vendor?.CoverImage
        ? `${this.apiUrl}${this.vendor.CoverImage.url}`
        : "https://media.recollectivect.com/public/vendor_placeholder.jpg";
    },
    selectedImageUrl(): string {
      return this.vendor?.Photos && this.selectedImageIndex < this.vendor.Photos.length
        ? `${this.apiUrl}${this.vendor.Photos[this.selectedImageIndex].url}`
        : "";
    },
  },
  created() {
    this.loadVendor();
  },
  methods: {
    async loadVendor() {
      this.loading = true;
      this.error = null;
      try {
        const token = import.meta.env.VITE_APP_STRAPI_API_TOKEN;
        if (!token) {
          throw new Error("Strapi API token is missing.");
        }

        const documentId = this.$route.params.documentId;
        const response = await axios.get(
          `${this.apiUrl}/api/vendors/${documentId}?populate[0]=CoverImage&populate[1]=Photos`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data?.data) {
          throw new Error("Invalid response format: Vendor data is missing");
        }
        this.vendor = response.data.data;
        if (!this.vendor.Active) {
          throw new Error("This vendor is not active.");
        }
      } catch (err: any) {
        this.error = err.response?.status === 404
          ? `Vendor with ID ${this.$route.params.documentId} not found.`
          : "Failed to load vendor details. Please try again later.";
        this.vendor = null;
      } finally {
        this.loading = false;
      }
    },
    extractDescription(description: DescriptionNode[] | undefined): string {
      if (!description || !Array.isArray(description)) {
        return "No description available.";
      }
      return description
        .map((node) =>
          node.children
            .filter((child) => child.type === "text")
            .map((child) => child.text)
            .join("")
        )
        .join(" ");
    },
    openFullImage(index: number) {
      this.selectedImageIndex = index;
      this.imageDialog = true;
    },
    async copyShareLink() {
      try {
        await navigator.clipboard.writeText(this.shareUrl);
        this.snackbar = true;
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    },
    getCollageCols(photoCount: number, index: number): number {
      if (photoCount === 1) return 12;
      if (photoCount === 2) return 6;
      if (photoCount === 3) return index === 0 ? 12 : 6;
      if (photoCount === 4) return 6;
      return 4; // Fallback for 5+ photos
    },
    truncateText(text: string, maxLength: number): string {
      if (!text) return "";
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    },
  },
});
</script>

<style scoped>
.vendor-page {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  min-height: 100vh;
}

/* Hero Section */
.hero-parallax {
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.share-container {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.share-btn {
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-width: 2px;
  height: 40px;
}

.social-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border-width: 2px;
  transition: transform 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

/* Main Content */
.main-content {
  max-width: 1200px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
}

.section-text {
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a4a4a;
}

/* Photo Collage */
.photo-collage {
  margin: 0 auto;
}

.collage-item {
  padding: 8px;
}

.collage-img {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.collage-img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Image Dialog */
.image-dialog {
  background: rgba(0, 0, 0, 0.9);
}

.dialog-card {
  position: relative;
  padding: 0;
  background: transparent;
}

.dialog-img {
  max-height: 80vh;
  object-fit: contain;
}

.dialog-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}

/* Contact Section */
.contact-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.contact-row {
  gap: 16px;
}

.contact-item-col {
  padding: 8px;
}

.contact-card {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  transition: background 0.3s ease;
}

.contact-card:hover {
  background: #e9ecef;
}

.contact-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.contact-details {
  flex: 1;
}

.contact-label {
  display: block;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.contact-link {
  font-size: 1.1rem;
  color: #1a1a1a;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.contact-link:hover {
  color: #1976d2;
}

/* Loading/Error */
.error-text {
  font-size: 1.1rem;
  color: #b91c1c;
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .share-container {
    gap: 6px;
  }
  .share-btn, .social-btn {
    margin: 2px;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .section-text {
    font-size: 1rem;
  }
  .contact-section {
    padding: 1.5rem;
  }
  .contact-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
  .contact-icon {
    margin-bottom: 0.5rem;
    margin-right: 0;
  }
  .share-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  .social-btn {
    width: 36px;
    height: 36px;
  }
  .contact-link {
    max-width: 150px;
  }
}
</style>