declare module 'vue3-mini-weather' {
  import type { DefineComponent, App } from 'vue'
  const install: (Vue:App) => void
  const vMiniWeather: DefineComponent
  const vMiniWeatherIcon: DefineComponent
  export {
    vMiniWeather,
    vMiniWeatherIcon
  }
  export default install
}
