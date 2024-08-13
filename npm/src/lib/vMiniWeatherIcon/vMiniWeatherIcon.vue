<template>
  <div v-show="icon" :id="id" class="v-mini-weather-icon">
    <img v-if="!isSvg" class="icon__png" :src="pngSrc" alt="" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, Ref, onBeforeMount, watch, } from "vue";
import Lottie, { AnimationItem } from "lottie-web";
import weatherIcon from "./icon";

/* eslint-disable-next-line */
const props = defineProps({
  icon: {
    type: String,
    default: "d00",
  },
  type: {
    type: String,
    default: "fill",
  },
});
const id = ref("");
const weatherIconAnimation: Ref<AnimationItem | null> = ref(null);
const isSvg = ref(true);
const pngSrc = ref("");

function getImageUrl(name: string) {
  return new URL(`./black/${name}.png`, import.meta.url).href;
}

const handleShowIcon = () => {
  let icon: string = "";
  if (weatherIconAnimation.value) {
    weatherIconAnimation.value.destroy();
  }
  // console.log("icon: ", props.icon);

  if (props.icon in weatherIcon) {
    icon = props.icon;
  } else {
    if (/^\d+$/.test(props.icon)) {
      icon = "d" + props.icon;
    } else if (/^[dn]\d+$/.test(props.icon)) {
      icon = props.icon.slice(1);
    } else if (props.icon.startsWith("x")) {
      isSvg.value = false;
      // 图片路径：
      const code = props.icon.replace("x", "");
      const imgName = `${code}@2x`;
      pngSrc.value = getImageUrl(imgName);
    }
  }

  if (isSvg.value) {
    if (!(icon in weatherIcon)) {
      icon = "99";
    }
    weatherIconAnimation.value = Lottie.loadAnimation({
      container: document.getElementById(id.value) as Element,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: weatherIcon[icon]({ type: props.type }),
    });
  }
};
onBeforeMount(() => {
  const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const strArr = str.split("");
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += strArr[Math.round(Math.random() * strArr.length)];
  }
  id.value = `v-mini-weather-icon-${result}`;
});
onMounted(() => {
  handleShowIcon();
});
onBeforeUnmount(() => {
  if (weatherIconAnimation.value) {
    weatherIconAnimation.value.destroy();
  }
});

watch(() => props.icon, () => {
  handleShowIcon()
})
</script>
<style scoped>
.icon__png {
  height: 100%;
  scale: 0.7;
}
</style>
