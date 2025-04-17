<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onBeforeUnmount,
  watchEffect,
  watch,
  Ref,
  nextTick,
} from "vue";
import axios from "axios";
import { throttle } from '../util/index.ts'

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  // 用户自行处理 request, url、响应结构等
  customRequest: {
    type: Function,
  },
  resultAdapter: {
    type: Function,
  },
});
const emit = defineEmits(["notice"]);
const isObject = (obj: unknown) => {
  return (
    obj !== null && Object.prototype.toString.call(obj) === "[object Object]"
  );
};
const handleSendError = (data: unknown) => {
  emit("notice", data);
};
const updating = ref(false);

const latitude = ref("");
const longitude = ref("");


const updateLocation = throttle(function (position: GeolocationPosition) {
  if (
    latitude.value != position.coords.latitude ||
    longitude.value != position.coords.longitude
  ) {
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
  }
}, 1000);


if (typeof window !== "undefined" && window.navigator.geolocation) {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 10,
  };
  window.navigator.geolocation.getCurrentPosition(
    updateLocation,
    (error) => {
      handleGetWeather();
      switch (error.code) {
        case 0:
          handleSendError({
            type: "warning",
            from: "window.navigator.geolocation",
            msg: "获取位置信息出错！",
          });
          break;
        case 1:
          handleSendError({
            type: "warning",
            from: "window.navigator.geolocation",
            msg: "阻止该页面获取位置信息！",
          });
          break;
        case 2:
          handleSendError({
            type: "warning",
            from: "window.navigator.geolocation",
            msg: "浏览器无法确定您的位置！",
          });
          break;
        case 3:
          handleSendError({
            type: "warning",
            from: "window.navigator.geolocation",
            msg: "获取位置信息超时！",
          });
          break;
      }
    },
    options
  );
} else {
  handleSendError({
    type: "warning",
    from: "window.navigator.geolocation",
    msg: "浏览器不支持 HTML5 的定位功能！",
  });
}

const weatherData: Ref<unknown> = ref(null);
const weathercode = ref("d00");
const timer: Ref<number | null> = ref(null);

const handleUpdate = () => {
  if (!updating.value) {
    updating.value = true;
    timer.value && clearInterval(timer.value);
    handleGetWeather();
    timer.value = setInterval(() => {
      handleGetWeather();
    }, 30 * 60 * 1000);
  }
};
const handleGetWeather = throttle(async () => {
  const defaultQuery = latitude.value && longitude.value
    ? `location_type=1&lat=${latitude.value}&lng=${longitude.value}&from=vmweather`
    : `location_type=0&from=vmweather`

  const url = props.url?.includes("?")
    ? `${props.url}&${defaultQuery}`
    : `${props.url}?${defaultQuery}`;

  try {
    let response;
    if (props.customRequest) {
      response = await props.customRequest(url, {
        defaultQuery,
        latitude: latitude.value,
        longitude: longitude.value,
      });
    } else {
      response = await axios.get(url);
    }
    if (response?.status === 200) {
      const { data: result } = response;
      if (
        isObject(result) &&
        "code" in result &&
        "data" in result &&
        result.code === 0
      ) {
        if (
          isObject(result.data) &&
          "location" in result.data &&
          isObject(result.data.location) &&
          "error_msg" in result.data.location
        ) {
          console.log(
            `获取定位信息失败; status: 200; error: ${result.data.location.error_msg}`
          );
          handleSendError({
            type: "warning",
            from: "server",
            msg: result.data.location.error_msg,
          });
        }
        weatherData.value = result.data.weather;
        weathercode.value = result.data.weather.weathercode;
        updating.value = false;
      }
      else {
        // 请求成功，但数据格式不符合预期
        updating.value = false;
        console.warn("获取天气请求成功: 数据格式不符合预期，请提供适配器 【resultAdapter】");

        if (props.resultAdapter) {
          const adapterResult = props.resultAdapter(result);
          console.log('adapterResult: ', adapterResult)
          if (adapterResult) {
            weatherData.value = adapterResult?.weather;
            weathercode.value = adapterResult?.weather?.weathercode;
            return;
          }
        }
        else if (isObject(result) && "msg" in result) {
          console.log(`获取天气请求失败; status: 200; error: ${result.msg}`);
          handleSendError({
            type: "error",
            from: "server",
            msg: result.msg,
          });
        } else {
          console.log("获取天气请求失败; status: 200; error: 服务器异常");
          handleSendError({
            type: "error",
            from: "server",
            msg: "服务器异常",
          });
        }
      }
    } else {
      updating.value = false;
      console.log(`获取天气请求失败; status: ${response?.status};`);
      handleSendError({
        type: "error",
        from: "axios.error",
        msg: "网络请求失败",
      });
    }
  } catch (err: any) {
    console.log(err);
    updating.value = false;
    console.log(`获取天气请求失败; status: ${err.response.status};`);
    handleSendError({
      type: "error",
      from: "axios.error",
      msg: "网络请求失败",
    });
  }
}, 1000)

watch([latitude, longitude], (values, old) => {
  handleGetWeather();
});

onBeforeUnmount(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<template>
  <div class="v-weather" @click="handleUpdate" :style="`cursor: ${updating ? 'not-allowed' : 'pointer'
    }; user-select: none;`">
    <span v-if="updating">更新中...</span>
    <slot v-if="!updating" :weather="weatherData" :icon="weathercode"></slot>
  </div>
</template>
