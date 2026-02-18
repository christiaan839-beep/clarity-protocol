import { NodeRegistry } from './nodes.js';
import { EXECUTION_STATUS } from './types.js';

export class WorkflowEngine {
    constructor() {
        this.workflows = new Map();
        this.activeExecutions = new Map();
    }

    /**
     * Load a workflow definition into the engine
     * @param {Object} workflowSchema - The JSON definition of the workflow
     */
    loadWorkflow(workflowSchema) {
        this.workflows.set(workflowSchema.id, workflowSchema);
        console.log(`[WorkflowEngine] Loaded workflow: ${workflowSchema.name} (${workflowSchema.id})`);
    }

    /**
     * Start execution of a workflow from a specific trigger node
     * @param {string} workflowId 
     * @param {string} triggerNodeId 
     * @param {Object} initialPayload 
     */
    async __executeWorkflow(workflowId, triggerNodeId, initialPayload = {}) {
        const schema = this.workflows.get(workflowId);
        if (!schema) throw new Error(`Workflow ${workflowId} not found`);

        const executionId = `exec_${Date.now()}`;
        console.log(`[WorkflowEngine] Starting execution ${executionId} for workflow ${workflowId}`);

        // 1. Instantiate Nodes based on Schema
        const nodeInstances = new Map();
        schema.nodes.forEach(nodeData => {
            const node = NodeRegistry.create(nodeData);
            nodeInstances.set(node.id, node);
        });

        // 2. Map Connections (Adjacency List)
        const outgoingConnections = new Map(); // nodeId -> [targetNodeId]
        schema.connections.forEach(conn => {
            if (!outgoingConnections.has(conn.source)) {
                outgoingConnections.set(conn.source, []);
            }
            outgoingConnections.get(conn.source).push(conn.target);
        });

        // 3. Execution Queue (BFS)
        const queue = [`${triggerNodeId}:${JSON.stringify(initialPayload)}`]; // store queue as "id:payload" (simplified for now, ideally objects)
        // Actually, let's just queue objects: { nodeId, inputData }
        const taskQueue = [{ nodeId: triggerNodeId, inputData: initialPayload }];

        const context = { executionId, startTime: Date.now() };

        while (taskQueue.length > 0) {
            const { nodeId, inputData } = taskQueue.shift();
            const node = nodeInstances.get(nodeId);

            if (!node) {
                console.error(`[WorkflowEngine] Node ${nodeId} definition not found during execution.`);
                continue;
            }

            try {
                // Execute Node
                node.status = EXECUTION_STATUS.RUNNING;
                // Notify UI listener here if needed

                const outputData = await node.execute(inputData, context);

                node.status = EXECUTION_STATUS.COMPLETED;
                node.result = outputData;

                // Find Next Nodes
                const nextNodeIds = outgoingConnections.get(nodeId) || [];
                nextNodeIds.forEach(nextId => {
                    taskQueue.push({ nodeId: nextId, inputData: outputData });
                });

            } catch (error) {
                console.error(`[WorkflowEngine] Error executing node ${nodeId}:`, error);
                node.status = EXECUTION_STATUS.FAILED;
                node.error = error.message;
                // Stop branch execution on error? Or continue other branches?
                // For now, we just stop this branch.
            }
        }

        console.log(`[WorkflowEngine] Execution ${executionId} finished.`);
        return context;
    }

    /**
     * Public method to run a workflow manually
     */
    async triggerWorkflow(workflowId, triggerId = null, payload = {}) {
        const schema = this.workflows.get(workflowId);
        if (!schema) throw new Error("Workflow not found");

        let startNodeId = triggerId;

        // If no specific trigger ID provided, find the first manual trigger
        if (!startNodeId) {
            const manualTrigger = schema.nodes.find(n => n.type === 'trigger_manual');
            if (manualTrigger) startNodeId = manualTrigger.id;
        }

        if (!startNodeId) throw new Error("No trigger node found to start workflow.");

        return this.__executeWorkflow(workflowId, startNodeId, payload);
    }
}

// Singleton Instance
export const workflowEngine = new WorkflowEngine();
