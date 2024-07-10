# [vue-mini-weather 的 fork](https://github.com/hjiachuang/vue3-mini-weather)

> 作者不维护了，因此单独拉个分支出来

#### 📦 安装

```bash
npm i @dovak/vue3-mini-weather-next --save
```

```javascript
// 1. 全局引入

//main.js 项目入口文件
import { createApp } from 'vue'
import App from './App.vue'
import weather from 'vue3-mini-weather'

createApp(App).use(weather).mount('#app')


//app.vue 项目文件
<template>
  <v-mini-weather>
    <template #default="{weather, icon}">
      <!--插入图标-->
      <v-mini-weather-icon :icon="icon"></v-mini-weather-icon>
      <!--DIY内容-->
      <span>{{weather.cityname}}/{{weather.weather}}/{{weather.temp}}</span>
    </template>
  </v-mini-weather>
</template>

// 2. 局部引入 
//app.vue 项目文件
<template>
  <v-mini-weather>
    <template #default="{weather, icon}">
      <!--插入图标-->
      <v-mini-weather-icon :icon="icon"></v-mini-weather-icon>
      <!--DIY内容-->
      <span>{{weather.cityname}}/{{weather.weather}}/{{weather.temp}}</span>
    </template>
  </v-mini-weather>
</template>

<script setup>
import { vMiniWeather, vMiniWeatherIcon } from '@dovak/vue3-mini-weather-next'
</script>

```

#### 📝 参数说明
```javascript
// v-mini-weather参数

url: {     // 天气小组件调用的天气查询API
  type: String,
  default: 'https://apia.aidioute.cn/weather/'
},

// 自定义请求，可用于模拟数据、格式化接口参数等
// 返回 示例： Promise.resolve({ status: 200, data: {...} }), 与默认 api 一致 
customRequest: {
  type: (url) => Promise<any>
}

// v-mini-weather-icon参数

icon: {     // 天气图标编号
  type: String,
  default: 'd00' // 默认白天-晴
}
type: {     // 天气图标类型 -- fill / line
  type: String,
  default: 'fill'
}
```

#### CHANGELOG
* **v0.0.1**
1. 增加自定义请求属性 `customRequest`
