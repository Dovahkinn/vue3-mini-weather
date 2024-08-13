declare module '@dovak/vue3-mini-weather-next' {
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

