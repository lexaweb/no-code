import { createStore } from "vuex";

// Типы для Node и Block
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

// Типы для состояния
interface State {
    blocks: Block[];
    connections: Connection[];
    selectedNode: SelectedNode | null;
}

interface Connection {
    from: SelectedNode;
    to: SelectedNode;
}

interface SelectedNode {
    blockId: string;
    nodeId: string;
    x: number;
    y: number;
}

export default createStore<State>({
    state: {
        blocks: [
            {
                id: "block1",
                x: 100,
                y: 100,
                nodes: [
                    { id: "node1", x: 0, y: 0 },
                    { id: "node2", x: 70, y: 0 },
                    { id: "node3", x: 0, y: 70 },
                    { id: "node4", x: 70, y: 70 },
                ],
            },
            {
                id: "block2",
                x: 250,
                y: 100,
                nodes: [
                    { id: "node1", x: 0, y: 0 },
                    { id: "node2", x: 70, y: 0 },
                    { id: "node3", x: 0, y: 70 },
                    { id: "node4", x: 70, y: 70 },
                ],
            },
        ],
        connections: [],
        selectedNode: null,
    },
    mutations: {
        addBlock(state, newBlock: Omit<Block, "nodes">) {
            state.blocks.push({
                ...newBlock,
                nodes: [
                    { id: "node1", x: 0, y: 0 },
                    { id: "node2", x: 70, y: 0 },
                    { id: "node3", x: 0, y: 70 },
                    { id: "node4", x: 70, y: 70 },
                ],
            });
        },
        removeBlock(state, blockId: string) {
            state.blocks = state.blocks.filter((block) => block.id !== blockId);
            state.connections = state.connections.filter(
                (conn) => conn.from.blockId !== blockId && conn.to.blockId !== blockId
            );
        },
        updateBlockPosition(state, { id, x, y }: { id: string; x: number; y: number }) {
            const block = state.blocks.find((b) => b.id === id);
            if (block) {
                block.x = x;
                block.y = y;

                state.connections.forEach((conn) => {
                    if (conn.from.blockId === id) {
                        const node = block.nodes.find((n) => n.id === conn.from.nodeId);
                        if (node) {
                            conn.from.x = x + node.x;
                            conn.from.y = y + node.y;
                        }
                    }
                    if (conn.to.blockId === id) {
                        const node = block.nodes.find((n) => n.id === conn.to.nodeId);
                        if (node) {
                            conn.to.x = x + node.x;
                            conn.to.y = y + node.y;
                        }
                    }
                });
            }
        },
        setSelectedNode(state, { blockId, nodeId }: { blockId: string; nodeId: string }) {
            const block = state.blocks.find((b) => b.id === blockId);
            if (block) {
                const node = block.nodes.find((n) => n.id === nodeId);
                if (node) {
                    state.selectedNode = {
                        blockId,
                        nodeId,
                        x: block.x + node.x,
                        y: block.y + node.y,
                    };
                }
            }
        },
        clearSelectedNode(state) {
            state.selectedNode = null;
        },
        addConnection(state, connection: Connection) {
            state.connections.push(connection);
        },
        removeConnection(state, connection: Connection) {
            state.connections = state.connections.filter(
                (conn) =>
                    !(
                        conn.from.blockId === connection.from.blockId &&
                        conn.from.nodeId === connection.from.nodeId &&
                        conn.to.blockId === connection.to.blockId &&
                        conn.to.nodeId === connection.to.nodeId
                    )
            );
        },
    },
    actions: {
        addBlock({ commit }, newBlock: Omit<Block, "nodes">) {
            commit("addBlock", newBlock);
        },
        removeBlock({ commit }, blockId: string) {
            commit("removeBlock", blockId);
        },
        handleNodeClick(
            { state, commit },
            { blockId, nodeId }: { blockId: string; nodeId: string }
        ) {
            const block = state.blocks.find((b) => b.id === blockId);
            const node = block?.nodes.find((n) => n.id === nodeId);

            if (!block || !node) return;

            if (!state.selectedNode) {
                commit("setSelectedNode", { blockId, nodeId });
            } else {
                const selectedBlockId = state.selectedNode.blockId;
                const selectedNodeId = state.selectedNode.nodeId;

                if (selectedBlockId === blockId) {
                    console.log("Связи внутри одного блока запрещены");
                    commit("clearSelectedNode");
                    return;
                }

                const existingConnection = state.connections.find(
                    (conn) =>
                        (conn.from.blockId === selectedBlockId &&
                            conn.to.blockId === blockId &&
                            conn.from.nodeId === selectedNodeId &&
                            conn.to.nodeId === nodeId) ||
                        (conn.from.blockId === blockId &&
                            conn.to.blockId === selectedBlockId &&
                            conn.from.nodeId === nodeId &&
                            conn.to.nodeId === selectedNodeId)
                );

                if (existingConnection) {
                    console.log("Удаляем существующую связь");
                    commit("removeConnection", existingConnection);
                } else {
                    const blocksAlreadyConnected = state.connections.some(
                        (conn) =>
                            (conn.from.blockId === selectedBlockId && conn.to.blockId === blockId) ||
                            (conn.from.blockId === blockId && conn.to.blockId === selectedBlockId)
                    );
                    if (blocksAlreadyConnected) {
                        commit("clearSelectedNode");
                        return;
                    }
                    const connection: Connection = {
                        from: state.selectedNode,
                        to: {
                            blockId,
                            nodeId,
                            x: block.x + node.x,
                            y: block.y + node.y,
                        },
                    };
                    commit("addConnection", connection);
                }

                commit("clearSelectedNode");
            }
        },
        moveBlock({ commit }, { id, x, y }: { id: string; x: number; y: number }) {
            commit("updateBlockPosition", { id, x, y });
        },
    },
});