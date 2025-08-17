import { createApp } from 'vue'
import App from './App.vue'
import { store } from './stores'
import './styles/tokens.css'

createApp(App).use(store).mount('#app')
