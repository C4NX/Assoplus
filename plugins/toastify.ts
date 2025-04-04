import Vue3Toastify, { toast, type ToastContainerOptions } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 3000,
    style: {
      zIndex: 1000,
    },
    position: toast.POSITION.BOTTOM_RIGHT,
    clearOnUrlChange: false,
  } as ToastContainerOptions)
})
