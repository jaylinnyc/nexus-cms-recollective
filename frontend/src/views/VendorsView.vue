<template>
  <div>
    <!-- Vendors Hero -->
    <v-parallax
      src="https://media.recollectivect.com/public/vendors.jpg"
      height="400"
      scale="1.5"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-medium-emphasis">
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
                @update:modelValue="handleSortChange"
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
                <h2 class="text-h4 mb-4 text-black">
                  <router-link
                    :to="`/vendors/${vendor.documentId}`"
                    class="text-decoration-none text-black hover:text-primary"
                  >
                    {{ vendor.BusinessName }}
                  </router-link>
                </h2>
                <p class="text-body-1 mb-4 text-justify text-black">
                  {{ extractDescription(vendor.Description) }}
                </p>
                <h3 class="text-h6 mb-2 text-black">Contact:</h3>
                <v-list>
                  <v-list-item v-if="vendor.Email">
                    <v-list-item-title>Email: {{ vendor.Email }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="vendor.IGHandle">
                    <v-list-item-title>
                      Instagram:
                      <a
                        :href="`https://www.instagram.com/${vendor.IGHandle.replace('@', '')}`"
                        target="_blank"
                        class="text-decoration-none"
                      >
                        {{ vendor.IGHandle }}
                      </a>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" :order="index % 2 === 0 ? 1 : 2" :order-md="index % 2 === 0 ? 2 : 1" class="d-flex align-center">
                <v-img
                  :src="vendor.CoverImage ? `https://cms.recollectivect.com${vendor.CoverImage.url}` : 'https://media.recollectivect.com/public/vendor_placeholder.jpg'"
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
    <v-container v-if="!filteredVendors.length && !error && !loading" class="py-8 text-center">
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
import { defineComponent } from 'vue';
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
  name: 'VendorsView',
  data(): {
    vendors: Vendor[];
    filteredVendors: Vendor[];
    searchQuery: string;
    sortOption: string;
    sortOptions: SortOption[];
    error: string | null;
    loading: boolean;
    currentPage: number;
    pageSize: number;
    pageCount: number;
    total: number;
  } {
    return {
      vendors: [],
      filteredVendors: [],
      searchQuery: '',
      sortOption: 'name-asc',
      sortOptions: [
        { title: 'Name (A-Z)', value: 'name-asc' },
        { title: 'Name (Z-A)', value: 'name-desc' },
      ],
      error: null,
      loading: false,
      currentPage: 1,
      pageSize: 10, // Default page size
      pageCount: 1,
      total: 0,
    };
  },
  created() {
    this.loadVendors();
  },
  methods: {
    async loadVendors() {
      this.loading = true;
      try {
        let query = `pagination[page]=${this.currentPage}&pagination[pageSize]=${this.pageSize}&populate[0]=CoverImage&filters[Active][$eq]=true`;

        // Add search filters
        if (this.searchQuery) {
          const search = encodeURIComponent(this.searchQuery);
          query += `&filters[$or][0][BusinessName][$containsi]=${search}&filters[$or][1][Description][$containsi]=${search}`;
        }

        // Add sort parameter
        if (this.sortOption === 'name-asc') {
          query += `&sort[0]=BusinessName:asc`;
        } else if (this.sortOption === 'name-desc') {
          query += `&sort[0]=BusinessName:desc`;
        }

        const response = await axios.get(
          `https://cms.recollectivect.com/api/vendors?${query}`,
          {
            headers: {
              Authorization: `Bearer ffd1ecc6d7e6412700902194d78a066135b008d66ee965c713a2fb7199e8b70b6c2e2b361672f452fceb5ec1829a5b94f94084eca3489879be0df6354ec871e8e9c644456c04ce9e7811ae8878981ec85cc1873cf1176f642fcb1ee729a41ab7c127bf6367625e04e9af8e7194913a94974f291021c5780c161c830f8f346e0b`,
            },
          }
        );

        this.vendors = response.data.data;
        this.filteredVendors = [...this.vendors];
        this.pageCount = response.data.meta.pagination.pageCount;
        this.total = response.data.meta.pagination.total;
      } catch (err: any) {
        this.error = 'Failed to load vendors from CMS. Please try again later.';
        console.error('Error loading vendors:', err);
        this.vendors = [];
        this.filteredVendors = [];
        this.pageCount = 1;
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },
    extractDescription(description: DescriptionNode[]): string {
      if (!description || !Array.isArray(description)) return '';
      return description
        .map((node) =>
          node.children
            .filter((child) => child.type === 'text')
            .map((child) => child.text)
            .join('')
        )
        .join(' ');
    },
    filterVendors() {
      this.currentPage = 1; // Reset to first page on new search
      this.loadVendors();
    },
    handleSortChange() {
      this.currentPage = 1; // Reset to first page on sort change
      this.loadVendors();
    },
  },
});
</script>
