export const NODE_TYPES = {
    // Triggers
    TRIGGER_MANUAL: 'trigger_manual',
    TRIGGER_SCHEDULE: 'trigger_schedule',
    TRIGGER_WEBHOOK: 'trigger_webhook',

    // Actions
    ACTION_LOG: 'action_log',
    ACTION_HTTP: 'action_http',
    ACTION_NOTIFICATION: 'action_notification',

    // Logic
    LOGIC_IF: 'logic_if',
    LOGIC_DELAY: 'logic_delay',

    // Agents
    AGENT_LLM: 'agent_llm'
};

export const EXECUTION_STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

export const DATA_TYPES = {
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    JSON: 'json',
    ANY: 'any'
};
