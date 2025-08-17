import { createApp } from 'vue'
import App from './App.vue'
import { store } from './stores'

createApp(App).use(store).mount('#app')
