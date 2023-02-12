<template>
  <div class="wrap-dialog">
    <div class="pop">
      <iframe
        width="500"
        height="300"
        src="https://www.youtube.com/embed/zuoSn3ObMz4"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "TutorialDialog",
};
</script>

<style scoped>
.pop {
  z-index: 3;
}
</style>
