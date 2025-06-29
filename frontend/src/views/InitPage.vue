<template>
  <div class="init-page">
    <h2>Initialize The Recollective</h2>
    <div v-if="isLoading">
      <p>Loading initialization status...</p>
    </div>
    <div v-else-if="isInitialized">
      <p class="error">Error: The website is already initialized. Re-initialization is not allowed.</p>
    </div>
    <div v-else>
      <p>Click below to initialize the website with Google OAuth2. This requires authentication with the designated account ({{ allowedEmail }}).</p>
      <button @click="initWithGoogle">Login with Google to Initialize</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AxiosError } from 'axios'
import {api} from '@/plugins/axios'

export default defineComponent({
  name: 'InitPage',
  data() {
    return {
      isLoading: true,
      isInitialized: false,
      allowedEmail: 'info@recollectivect.com',
    };
  },
  async created() {
    try {
      const response = await api.get(`/init-status`);
      this.isInitialized = response.data.initialized;
    } catch (error) {
      console.error('Failed to check initialization status:', error);
      alert('Failed to check initialization status. Please try again.');
    } finally {
      this.isLoading = false;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('code')) {
      try {
        await api.get(`/auth/google/callback`, {
          params: { code: params.get('code') },
        });
        this.isInitialized = true;
        alert('Website initialized successfully!');
        window.history.replaceState({}, document.title, window.location.pathname);
        this.$router.push('/');
      } catch (error: any) {
        console.error('Initialization failed:', error);
        if (error.response && error.response.status === 403) {
          alert(error.response.data.detail);
          this.isInitialized = true;
        } else {
          alert('Initialization failed. Please try again.');
        }
      }
    }
  },
  methods: {
    async initWithGoogle() {
      try {
        const response = await api.get(`/auth/google`);
        window.location.href = response.data.authorization_url;
      } catch (error: any) {
        console.error('Failed to get auth URL:', error);
        if (error.response && error.response.status === 403) {
          this.isInitialized = true;
          alert(error.response.data.detail);
        } else {
          alert('Failed to initiate initialization. Please try again.');
        }
      }
    },
  },
});
</script>

<style scoped>
.init-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

.error {
  color: red;
  font-weight: bold;
}

button {
  background-color: #4285f4;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #357ae8;
}
</style>