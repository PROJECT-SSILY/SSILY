<template>
    <p class="wrap-item"
    v-for="p in paginatedData" :key="p.no">
    <span id="num-members">{{ p.connections.numberOfElements }} / 4</span>
    <span id="tit-room">{{ p.title }}</span>
    <span class="ico-secret" :class="p.isSecret ? 'secret' : ''"><v-img src="@/assets/images/secret.svg" alt="secret"/></span>
    </p>
    <div class="btn-paging">
          <button @click="prevPage">PREV</button>
          <button @click="nextPage">NEXT</button>
    </div>
</template>
<script>
// import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import { computed } from "vue";
import { reactive } from "vue";
export default {
    name: 'paginationItem',
    props: {
        rooms: Object,
    },
    setup(props) {
        const state = reactive({
            pageNum: 0
        })
        const pageList = computed(() => {
            let listLeng = props.rooms.length;
            let listSize = 5;
            let page = Math.floor(listLeng / listSize);
            if (listLeng % listSize > 0) {
                page += 1
            }
            return page
            });
        const paginatedData = computed(() => {
            const start = state.pageNum * 5;
            const end = start + 5;
            return props.rooms.slice(start, end);
            })
        const nextPage = function() {
            state.pageNum += 1
        }
        const prevPage = function() {
            state.pageNum -= 1
        }
        return {
            state,
            pageList,
            paginatedData,
            nextPage,
            prevPage
        };
    }
}
</script>

<style>
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