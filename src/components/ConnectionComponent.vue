<template>
    <svg class="connections">
        <line
            v-for="(connection, index) in connections"
            :key="index"
            :x1="getBlockById(connection.from).x + 50"
            :y1="getBlockById(connection.from).y + 50"
            :x2="getBlockById(connection.to).x + 50"
            :y2="getBlockById(connection.to).y + 50"
            stroke="black"
            stroke-width="2"
        />
    </svg>
</template>

<script>
export default {
    computed: {
        connections() {
            return this.$store.state.connections;
        },
    },
    methods: {
        getBlockById(id) {
            return this.$store.state.blocks.find(block => block.id === id);
        },
    },
};
</script>

<style scoped>
.connections {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Prevent SVG from blocking interaction */
}
</style>