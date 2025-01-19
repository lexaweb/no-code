<template>
    <div
        class="container"
        v-for="block in blocks"
        :key="block.id"
        :style="{ left: block.x + 'px', top: block.y + 'px' }"
    >
        <div
            class="block"
            @mousedown="startDrag(block)"
        >
        </div>
        <div
            v-for="(node, index) in block.nodes"
            :key="index"
            class="node"
            :style="{ left: node.x + 'px', top: node.y + 'px' }"
            @click.stop="handleNodeClick(block.id, node.id)"
        ></div>
        {{ block.id }}
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

interface Node {
    id: string;
    x: number;
    y: number;
}

interface Block {
    id: string;
    x: number;
    y: number;
    nodes: Node[];
}

export default defineComponent({
    setup() {
        const store = useStore();

        // Функция для получения блоков из хранилища
        const blocks = computed(() => store.state.blocks || []);

        // Функция для начала перетаскивания блока
        const startDrag = (block: Block) => {
            const mouseMoveHandler = (e: MouseEvent) => {
                const x = e.clientX;
                const y = e.clientY;
                store.dispatch("moveBlock", { id: block.id, x, y });
            };

            const mouseUpHandler = () => {
                document.removeEventListener("mousemove", mouseMoveHandler);
                document.removeEventListener("mouseup", mouseUpHandler);
            };

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        };

        // Обработчик клика по блоку
        const handleBlockClick = (block: Block) => {
            store.dispatch("handleNodeClick", block.id);
        };

        // Обработчик клика по узлу
        const handleNodeClick = (blockId: string, nodeId: string) => {
            store.dispatch("handleNodeClick", { blockId, nodeId });
        };

        return {
            blocks,
            startDrag,
            handleBlockClick,
            handleNodeClick,
        };
    },
});
</script>

<style scoped>
.container {
    width: 100px;
    height: 100px;
    background-color: blue;
    color: white;
    position: absolute;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
.block {
    position: absolute;
    width: 100%;
    height: 100%;
}

.node {
    z-index: 1;
    width: 30px;
    height: 30px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    cursor: pointer;
}

.node:first-child {
    left: -5px;
    top: -5px;
}

.node:nth-child(2) {
    left: 90px;
    top: -5px;
}

.node:nth-child(3) {
    left: -5px;
    top: 90px;
}

.node:nth-child(4) {
    left: 90px;
    top: 90px;
}
</style>