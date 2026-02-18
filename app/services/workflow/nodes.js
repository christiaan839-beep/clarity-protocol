import { NODE_TYPES, EXECUTION_STATUS } from './types.js';

/**
 * Base Node Class
 */
export class WorkflowNode {
    constructor(id, type, data = {}) {
        this.id = id;
        this.type = type;
        this.data = data;
        this.inputs = {};
        this.outputs = {};
        this.status = EXECUTION_STATUS.PENDING;
        this.result = null;
    }

    async execute(inputData, context) {
        throw new Error('Execute method must be implemented by subclass');
    }
}

/**
 * Registry Pattern for Node Instantiation
 */
export class NodeRegistry {
    static registry = {};

    static register(type, classRef) {
        this.registry[type] = classRef;
    }

    static create(nodeSchema) {
        const ClassRef = this.registry[nodeSchema.type];
        if (!ClassRef) {
            console.warn(`Node type ${nodeSchema.type} not found in registry.`);
            return new WorkflowNode(nodeSchema.id, nodeSchema.type, nodeSchema.data);
        }
        return new ClassRef(nodeSchema.id, nodeSchema.data);
    }
}

// ════════════ INDIVIDUAL NODES ════════════

export class ManualTriggerNode extends WorkflowNode {
    constructor(id, data) {
        super(id, NODE_TYPES.TRIGGER_MANUAL, data);
    }

    async execute(inputData, context) {
        console.log(`[${this.id}] Manual Trigger Fired.`, context);
        return {
            triggeredAt: new Date().toISOString(),
            ...this.data
        };
    }
}

export class LogNode extends WorkflowNode {
    constructor(id, data) {
        super(id, NODE_TYPES.ACTION_LOG, data);
    }

    async execute(inputData, context) {
        const message = this.data.message || "Log Node Output:";
        console.log(`%c [Workflow Log] ${message}`, 'background: #222; color: #bada55', inputData);
        return inputData; // Pass through
    }
}

export class HttpActionNode extends WorkflowNode {
    constructor(id, data) {
        super(id, NODE_TYPES.ACTION_HTTP, data);
    }

    async execute(inputData, context) {
        const url = this.data.url;
        const method = this.data.method || 'GET';
        const headers = this.data.headers || {};
        const body = method !== 'GET' ? JSON.stringify(this.data.body || inputData) : null;

        console.log(`[${this.id}] Making HTTP ${method} request to ${url}`);

        try {
            const response = await fetch(url, { method, headers, body });
            const json = await response.json();
            return { status: response.status, data: json };
        } catch (error) {
            console.error(`[${this.id}] HTTP Request Failed`, error);
            throw error;
        }
    }
}

export class LLMAgentNode extends WorkflowNode {
    constructor(id, data) {
        super(id, NODE_TYPES.AGENT_LLM, data);
    }

    async execute(inputData, context) {
        console.log(`[${this.id}] AI Agent Thinking...`, this.data.systemPrompt);

        // Mock LLM Response for now
        // TODO: Integrate actual LLM API (OpenAI/Gemini/Anthropic)
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency

        return {
            role: "assistant",
            content: `Mock analysis of inputs: ${JSON.stringify(inputData)}. \nBased on your protocol, I recommend increasing hydration.`,
            usage: { total_tokens: 150 }
        };
    }
}

// Register Nodes
NodeRegistry.register(NODE_TYPES.TRIGGER_MANUAL, ManualTriggerNode);
NodeRegistry.register(NODE_TYPES.ACTION_LOG, LogNode);
NodeRegistry.register(NODE_TYPES.ACTION_HTTP, HttpActionNode);
NodeRegistry.register(NODE_TYPES.AGENT_LLM, LLMAgentNode);
