<template>
    <div
        v-for="block in blocks"
        :key="block.id"
        class="block"
        :style="{ left: block.x + 'px', top: block.y + 'px' }"
        @mousedown="startDrag(block)"
    >
        {{ block.id }}
    </div>
</template>

<script>
export default {
    computed: {
        blocks() {
            return this.$store.state.blocks;
        },
    },
    methods: {
        startDrag(block) {
            const mouseMoveHandler = (e) => {
                const x = e.clientX - 50; // Adjust offset for centering
                const y = e.clientY - 50; // Adjust offset for centering
                this.$store.dispatch("moveBlock", { id: block.id, x, y });
            };

            const mouseUpHandler = () => {
                document.removeEventListener("mousemove", mouseMoveHandler);
                document.removeEventListener("mouseup", mouseUpHandler);
            };

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        },
    },
};
</script>

<style scoped>
.block {
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
}
</style>