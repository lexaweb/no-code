<template>
    <svg class="connections">
        <line
            v-for="(connection, index) in connections"
            :key="index"
            :x1="connection.from.x"
            :y1="connection.from.y"
            :x2="connection.to.x"
            :y2="connection.to.y"
            stroke="black"
            stroke-width="2"
        />
    </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";



export default defineComponent({
    setup() {
        const store = useStore();

        // Получаем все соединения из хранилища
        const connections = computed(() => store.state.connections || []);

        return {
            connections,
        };
    },
});
</script>

<style scoped>
.connections {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>