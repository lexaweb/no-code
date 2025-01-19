import { createStore } from 'vuex';

export default createStore({
    state: {
        blocks: [
            { id: "block1", x: 100, y: 100 },
            { id: "block2", x: 300, y: 300 },
        ],
        connections: [],
        selectedNode: null,
    },
    mutations: {
        addBlock(state, block) {
            state.blocks.push(block);
        },
        removeBlock(state, blockId) {
            state.blocks = state.blocks.filter(block => block.id !== blockId);
            state.connections = state.connections.filter(
                conn => conn.from !== blockId && conn.to !== blockId
            );
        },
        updateBlockPosition(state, { id, x, y }) {
            const block = state.blocks.find(b => b.id === id);
            if (block) {
                block.x = x;
                block.y = y;
            }
        },
        addConnection(state, connection) {
            state.connections.push(connection);
        },
        removeConnection(state, connection) {
            state.connections = state.connections.filter(
                conn => conn !== connection
            );
        },
        setSelectedNode(state, nodeId) {
            state.selectedNode = nodeId;
        },
    },
    actions: {
        handleNodeClick({ state, commit }, blockId) {
            if (!state.selectedNode) {
                commit('setSelectedNode', blockId);
            } else {
                const connection = { from: state.selectedNode, to: blockId };
                commit('addConnection', connection);
                commit('setSelectedNode', null);
            }
        },
        moveBlock({ commit }, { id, x, y }) {
            commit('updateBlockPosition', { id, x, y });
        },
    },
});