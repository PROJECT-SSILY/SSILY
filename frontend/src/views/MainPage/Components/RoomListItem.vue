<template>
  <p class="wrap-item">
    <span id="num-members">{{ room.connections.numberOfElements }} / 4</span>
    <span id="tit-room">{{ room.title }}</span>
    <span class="ico-secret" :class="room.isSecret ? 'secret' : ''"><v-img src="@/assets/images/secret.svg" alt="secret"/></span>
  </p>
</template>
<script>
export default {
  props: {
    room: Object,
  },
  setup() {
    return {
    };
  },
};
</script>

<style scoped>
.wrap-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
#num-members {
  margin: 0 20px;
}
#tit-room {
  font-size: 15px;
  line-height: initial;
  font-weight: 600;
}
.ico-secret {
  margin: 0 20px;
  width: 20px;
  visibility: hidden;
}
.ico-secret.secret {
  visibility: visible;
}
</style>