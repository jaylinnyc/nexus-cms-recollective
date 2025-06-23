<template>
  <div>
    <!-- Vendors Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/web%2Fantiques–800w.png"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-medium-emphasis">
        <h1 class="text-h3 font-weight-bold text-white">Our Vendors</h1>
      </div>
    </v-parallax>

    <!-- Vendors Overview -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <p class="text-body-1 mb-6 text-black">
            The Recollective is home to a vibrant community of vendors, each bringing unique stories, styles, and treasures to our historic marketplace in Bridgeport. From seasoned antique dealers to emerging artists, discover the passion behind every booth.
          </p>
          <!-- Search and Sort Controls -->
          <v-row class="mb-6">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="searchQuery"
                label="Search vendors by name or description"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
                @input="filterVendors"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="sortOption"
                :items="sortOptions"
                label="Sort by"
                variant="outlined"
                @update:modelValue="sortVendors"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dynamic Vendor List -->
    <template v-for="(vendor, index) in filteredVendors" :key="vendor.id">
      <v-container :class="['py-8', index % 2 === 0 ? 'bg-grey-lighten-4' : '']">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-row>
              <v-col cols="12" md="6" :order="index % 2 === 0 ? 2 : 1" :order-md="index % 2 === 0 ? 1 : 2">
                <h2 class="text-h4 mb-4 text-black">{{ vendor.business_name }}</h2>
                <p class="text-body-1 mb-4 text-justify text-black">
                  {{ vendor.description }}
                </p>
                <h3 class="text-h6 mb-2 text-black">Contact:</h3>
                <v-list>
                  <v-list-item v-if="vendor.email">
                    <v-list-item-title>Email: {{ vendor.email }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="vendor.ig_handle">
                    <v-list-item-title>Instagram: {{ vendor.ig_handle }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" :order="index % 2 === 0 ? 1 : 2" :order-md="index % 2 === 0 ? 2 : 1" class="d-flex align-center">
                <v-img
                  :src="vendor.photos ? `https://media.recollectivect.com/public/${vendor.photos}.jpg` : 'https://media.recollectivect.com/public/vendor_placeholder.jpg'"
                  :alt="vendor.business_name"
                  class="rounded-lg"
                  height="300"
                ></v-img>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <!-- Loading or Error State -->
    <v-container v-if="!filteredVendors.length && !error" class="py-8 text-center">
      <p class="text-body-1 text-black">Loading vendors...</p>
    </v-container>
    <v-container v-if="error" class="py-8 text-center">
      <p class="text-body-1 text-red">{{ error }}</p>
    </v-container>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import vendorsData from '@/assets/vendors.json'; // Import JSON for development

export default defineComponent({
  name: 'VendorsView',
  data() {
    return {
      vendors: [] as any[],
      filteredVendors: [] as any[],
      searchQuery: '',
      sortOption: 'name-asc',
      sortOptions: [
        { title: 'Name (A-Z)', value: 'name-asc' },
        { title: 'Name (Z-A)', value: 'name-desc' },
      ],
      error: null as string | null,
    };
  },
  async created() {
    await this.loadVendors();
  },
  methods: {
    async loadVendors() {
      try {
        // Production: Fetch from Strapi
        if (process.env.NODE_ENV === 'production') {
          const response = await axios.get(`${process.env.VUE_APP_STRAPI_API_URL}/vendors`, {
            headers: {
              Authorization: `Bearer ${process.env.VUE_APP_STRAPI_API_TOKEN}`,
            },
          });
          this.vendors = response.data.map((vendor: any) => ({
            id: vendor.id,
            business_name: vendor.business_name,
            ig_handle: vendor.ig_handle,
            description: vendor.description,
            photos: vendor.photos,
            email: vendor.email,
          }));
        } else {
          // Development: Use JSON file
          this.vendors = vendorsData.map((vendor: any, index: number) => ({
            id: index + 1, // Assign a fake ID for development
            business_name: vendor['BUSINESS NAME'],
            ig_handle: vendor['IG HANDLE'],
            description: vendor.DESCRIPTION,
            photos: vendor.PHOTOS,
            email: vendor.EMAIL,
          }));
        }
        this.filterVendors();
      } catch (err) {
        this.error = 'Failed to load vendors. Please try again later.';
        console.error('Error fetching vendors:', err);
      }
    },
    filterVendors() {
      let filtered = [...this.vendors];
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (vendor) =>
            vendor.business_name.toLowerCase().includes(query) ||
            vendor.description.toLowerCase().includes(query)
        );
      }
      this.sortVendors(filtered);
    },
    sortVendors(filtered = this.filteredVendors) {
      if (this.sortOption === 'name-asc') {
        filtered.sort((a, b) => a.business_name.localeCompare(b.business_name));
      } else if (this.sortOption === 'name-desc') {
        filtered.sort((a, b) => b.business_name.localeCompare(a.business_name));
      }
      this.filteredVendors = filtered;
    },
  },
});
</script>