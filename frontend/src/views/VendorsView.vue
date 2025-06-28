<template>
  <div>
    <!-- Vendors Hero -->
    <v-parallax
      :src="vendorPageCoverImageUrl"
      height="400"
      scale="1.5"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-medium-emphasis"
      ></div>
    </v-parallax>

    <!-- Vendors Overview -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <p class="text-body-1 mb-6 text-black">
            {{ vendorPage.Introduction || 'The Recollective is home to a vibrant community of vendors, each bringing unique stories, styles, and treasures to our historic marketplace in Bridgeport. From seasoned antique dealers to emerging artists, discover the passion behind every booth.' }}
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
                @input="debouncedFilterVendors"
                @click:clear="clearSearch"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="sortOption"
                :items="sortOptions"
                label="Sort by"
                variant="outlined"
                @update:modelValue="handleSortChange"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dynamic Vendor List -->
    <template v-for="(vendor, index) in filteredVendors" :key="vendor.id">
      <v-container
        :class="['py-8', index % 2 === 0 ? 'bg-grey-lighten-4' : '']"
      >
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-row>
              <v-col
                cols="12"
                md="6"
                :order="index % 2 === 0 ? 2 : 1"
                :order-md="index % 2 === 0 ? 1 : 2"
              >
                <h2 class="text-h4 mb-4 text-black">
                  <router-link
                    v-if="vendorPage.Enable_Vendor_Link"
                    :to="`/vendors/${vendor.documentId}`"
                    class="text-decoration-none text-black hover:text-primary"
                  >
                    {{ vendor.BusinessName }}
                  </router-link>
                  <span v-else>{{ vendor.BusinessName }}</span>
                </h2>
                <p class="text-body-1 mb-4 text-justify text-black">
                  {{ extractDescription(vendor.Description) }}
                </p>
                <h3 class="text-h6 mb-2 text-black">Contact:</h3>
                <v-list>
                  <v-list-item v-if="vendor.Email">
                    <v-list-item-title
                      >Email: {{ vendor.Email }}</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item v-if="vendor.IGHandle">
                    <v-list-item-title>
                      Instagram:
                      <a
                        :href="`https://www.instagram.com/${vendor.IGHandle.replace(
                          '@',
                          ''
                        )}`"
                        target="_blank"
                        class="text-decoration-none"
                      >
                        {{ vendor.IGHandle }}
                      </a>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col
                cols="12"
                md="6"
                :order="index % 2 === 0 ? 1 : 2"
                :order-md="index % 2 === 0 ? 2 : 1"
                class="d-flex align-center"
              >
                <v-img
                  :src="getVendorCoverImageUrl(vendor)"
                  :alt="vendor.BusinessName"
                  class="rounded-lg"
                  height="300"
                ></v-img>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <!-- Pagination Controls -->
    <v-container class="py-8 text-center" v-if="pageCount > 1">
      <v-pagination
        v-model="currentPage"
        :length="pageCount"
        :total-visible="7"
        rounded="circle"
        color="primary"
        @update:modelValue="loadVendors"
      ></v-pagination>
    </v-container>

    <!-- Loading or Error State -->
    <v-container
      v-if="!filteredVendors.length && !error && !loading"
      class="py-8 text-center"
    >
      <p class="text-body-1 text-black">No vendors found.</p>
    </v-container>
    <v-container v-if="loading" class="py-8 text-center">
      <p class="text-body-1 text-black">Loading vendors...</p>
    </v-container>
    <v-container v-if="error" class="py-8 text-center">
      <p class="text-body-1 text-red">{{ error }}</p>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import axios from "axios";
import { debounce } from "lodash";

interface DescriptionNode {
  type: string;
  children: { text: string; type: string }[];
}

interface Media {
  id: number;
  documentId: string;
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
}

interface VendorPage {
  CoverImage: Media | null;
  Introduction: string | null;
  Enable_Vendor_Link: boolean;
}

interface SortOption {
  title: string;
  value: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export default defineComponent({
  name: "VendorsView",
  data(): {
    vendors: Vendor[];
    filteredVendors: Vendor[];
    vendorPage: VendorPage;
    searchQuery: string;
    sortOption: string;
    sortOptions: SortOption[];
    error: string | null;
    loading: boolean;
    currentPage: number;
    pageSize: number;
    pageCount: number;
    total: number;
    apiUrl: string;
  } {
    return {
      vendors: [],
      filteredVendors: [],
      vendorPage: {
        CoverImage: null,
        Introduction: null,
        Enable_Vendor_Link: false,
      },
      searchQuery: "",
      sortOption: "name-asc",
      sortOptions: [
        { title: "Name (A-Z)", value: "name-asc" },
        { title: "Name (Z-A)", value: "name-desc" },
      ],
      error: null,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      pageCount: 1,
      total: 0,
      apiUrl: import.meta.env.VITE_APP_STRAPI_API_URL || "https://cms.recollectivect.com",
    };
  },
  computed: {
    vendorPageCoverImageUrl(): string {
      return this.vendorPage.CoverImage
        ? `${this.apiUrl}${this.vendorPage.CoverImage.url}`
        : "https://media.recollectivect.com/public/vendors.jpg";
    },
  },
  created() {
    console.log("VendorsView created: Initiating API calls");
    this.loadVendorPage();
    this.loadVendors();
  },
  methods: {
    getVendorCoverImageUrl(vendor: Vendor): string {
      return vendor.CoverImage
        ? `${this.apiUrl}${vendor.CoverImage.url}`
        : "https://media.recollectivect.com/public/vendor_placeholder.jpg";
    },
    debouncedFilterVendors: debounce(function (this: any) {
      this.filterVendors();
    }, 300),
    async loadVendorPage() {
      try {
        const token = import.meta.env.VITE_APP_STRAPI_API_TOKEN;
        if (!token) {
          this.error = "Strapi API token is missing. Please check your .env file.";
          console.warn("Skipping VendorPage API call due to missing token.");
          return;
        }

        const response = await axios.get(
          `${this.apiUrl}/api/vendor-page?populate=CoverImage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data || !response.data.data) {
          throw new Error("Invalid response format: VendorPage data is missing");
        }
        this.vendorPage = {
          CoverImage: response.data.data.CoverImage || null,
          Introduction: response.data.data.Introduction || null,
          Enable_Vendor_Link: response.data.data.Enable_Vendor_Link || false,
        };

      } catch (err: any) {
        console.error("Error loading VendorPage:", err);
        console.log("Full error:", err.response?.data || err.message);
        console.log("Error status:", err.response?.status);
        console.log("Error headers:", err.response?.headers);
        this.error = err.message || "Failed to load vendor page data. Using defaults.";
      }
    },
    async loadVendors() {
      this.loading = true;
      this.error = null;
      this.vendors = [];
      this.filteredVendors = [];

      try {
        const token = import.meta.env.VITE_APP_STRAPI_API_TOKEN;
        if (!token) {
          this.error = "Strapi API token is missing. Please check your .env file.";
          console.warn("Skipping Vendors API call due to missing token.");
          this.loading = false;
          return;
        }

        let query = `pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}&populate[0]=CoverImage&filters[Active][$eq]=true`;

        if (this.searchQuery) {
          const search = encodeURIComponent(this.searchQuery);
          query += `&filters[$or][0][BusinessName][$containsi]=${search}&filters[$or][1][Description][$containsi]=${search}`;
        }

        if (this.sortOption === "name-asc") {
          query += `&sort[0]=BusinessName:asc`;
        } else if (this.sortOption === "name-desc") {
          query += `&sort[0]=BusinessName:desc`;
        }

        const vendorUrl = `${this.apiUrl}/api/vendors?${query}`;
        const response = await axios.get(vendorUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid response format: data is missing or not an array");
        }
        if (!response.data.meta || !response.data.meta.pagination) {
          throw new Error("Invalid response format: pagination metadata is missing");
        }

        this.vendors = response.data.data;
        this.filteredVendors = [...this.vendors];
        this.pageCount = response.data.meta.pagination.pageCount || 1;
        this.total = response.data.meta.pagination.total || 0;

      } catch (err: any) {
        console.error("Error loading vendors:", err);
        console.log("Full error:", err.response?.data || err.message);
        console.log("Error status:", err.response?.status);
        console.log("Error headers:", err.response?.headers);
        this.error = err.message || "Failed to load vendors from CMS. Please try again later.";
        this.vendors = [];
        this.filteredVendors = [];
        this.pageCount = 1;
        this.total = 0;
      } finally {
        this.loading = false;
        console.log("Loading state:", this.loading);
      }
    },
    extractDescription(description: DescriptionNode[]): string {
      if (!description || !Array.isArray(description)) return "";
      return description
        .map((node) =>
          node.children
            .filter((child) => child.type === "text")
            .map((child) => child.text)
            .join("")
        )
        .join(" ");
    },
    filterVendors() {
      this.currentPage = 1;
      this.loadVendors();
    },
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
      this.loadVendors();
    },
    handleSortChange() {
      this.currentPage = 1;
      this.loadVendors();
    },
  },
});
</script>