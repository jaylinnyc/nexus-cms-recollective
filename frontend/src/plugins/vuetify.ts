import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'recollectiveTheme',
    themes: {
      recollectiveTheme: {
        dark: false,
        colors: {
          primary: '#000000',   // Black for text and primary elements
          secondary: '#FFFFFF', // White for backgrounds and accents
          accent: '#000000',    // Black for emphasis
          error: '#000000',     // Black for consistency
          info: '#FFFFFF',      // White for contrast
          success: '#000000',   // Black for uniformity
          warning: '#000000',   // Black for simplicity
          background: '#FFFFFF' // White background
        }
      }
    }
  }
})