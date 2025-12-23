// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/apollo', '@nuxtjs/tailwindcss'],
  
  apollo: {
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
        httpLinkOptions: {
          credentials: 'include',
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      graphqlUrl: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
    },
  },
  
  ssr: false, // Disable SSR for simplicity
});

