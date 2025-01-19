<template>
    <div>
        <button @click="addBlock">Добавить блок</button>
        <button @click="removeBlock">Удалить блок</button>
        <div class="canvas">
            <BlockComponent />
            <ConnectionComponent />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import BlockComponent from "./components/BlockComponent.vue";
import ConnectionComponent from "./components/ConnectionComponent.vue";

export default defineComponent({
    components: {
        BlockComponent,
        ConnectionComponent,
    },
    setup() {
        const store = useStore();

        // Функция для добавления блока
        const addBlock = () => {
            const newBlock = {
                id: `block${store.state.blocks.length + 1}`,
                x: 50,
                y: 50,
            };
            store.commit("addBlock", newBlock);
        };

        // Функция для удаления блока
        const removeBlock = () => {
            const blockId = prompt("Введите ID блока для удаления:");
            if (blockId) {
                store.commit("removeBlock", blockId);
            }
        };

        return {
            addBlock,
            removeBlock,
        };
    },
});
</script>

<style scoped>
.canvas {
    position: relative;
    width: 100%;
    height: 500px;
    border: 1px solid #ccc;
}
</style>