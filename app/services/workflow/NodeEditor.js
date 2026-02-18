import { NodeRegistry } from './nodes.js';
import { NODE_TYPES } from './types.js';

export class NodeEditor {
    constructor(containerId, workflowEngine) {
        this.container = document.getElementById(containerId);
        this.engine = workflowEngine;
        this.nodes = [];
        this.connections = [];
        this.scale = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.isPanning = false;
        this.draggedNode = null;
        this.activeConnection = null; // { sourceNodeId, sourceHandle }

        this.init();
    }

    init() {
        if (!this.container) return;

        // 1. Setup DOM Structure
        this.container.innerHTML = `
            <div class="node-palette">
                <div class="palette-header">PROTOCOL LAB</div>
                <div class="palette-section">
                    <div class="palette-section-title">Triggers</div>
                    <div class="palette-node" draggable="true" data-type="${NODE_TYPES.TRIGGER_MANUAL}">
                        <span class="palette-icon">⚡</span> Manual Trigger
                    </div>
                    <div class="palette-node" draggable="true" data-type="${NODE_TYPES.TRIGGER_SCHEDULE}">
                        <span class="palette-icon">⏰</span> Schedule
                    </div>
                </div>
                <div class="palette-section">
                    <div class="palette-section-title">Agents & Logic</div>
                    <div class="palette-node" draggable="true" data-type="${NODE_TYPES.AGENT_LLM}">
                        <span class="palette-icon">🤖</span> AI Agent
                    </div>
                    <div class="palette-node" draggable="true" data-type="${NODE_TYPES.ACTION_LOG}">
                        <span class="palette-icon">📝</span> Log Output
                    </div>
                    <div class="palette-node" draggable="true" data-type="${NODE_TYPES.ACTION_HTTP}">
                        <span class="palette-icon">🌐</span> HTTP Request
                    </div>
                </div>
                <button id="run-workflow-btn" class="btn btn-outline" style="margin-top:auto">▶ RUN PROTOCOL</button>
            </div>
            <div class="workflow-canvas" id="wf-canvas">
                <svg class="connections-layer" id="wf-connections"></svg>
                <div class="nodes-layer" id="wf-nodes"></div>
            </div>
            <div class="canvas-controls">
                <button class="control-btn" id="zoom-in">+</button>
                <button class="control-btn" id="zoom-out">-</button>
                <button class="control-btn" id="fit-view">⤢</button>
            </div>
        `;

        this.canvas = this.container.querySelector('#wf-canvas');
        this.nodesLayer = this.container.querySelector('#wf-nodes');
        this.connectionsLayer = this.container.querySelector('#wf-connections');

        // 2. Event Listeners
        this.bindEvents();
    }

    bindEvents() {
        // Drag & Drop from Palette
        const paletteNodes = this.container.querySelectorAll('.palette-node');
        paletteNodes.forEach(pn => {
            pn.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', pn.dataset.type);
            });
        });

        this.canvas.addEventListener('dragover', (e) => e.preventDefault());
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));

        // Pan & Zoom
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));

        // Run Button
        this.container.querySelector('#run-workflow-btn').addEventListener('click', () => {
            this.runWorkflow();
        });
    }

    handleDrop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panX) / this.scale;
        const y = (e.clientY - rect.top - this.panY) / this.scale;

        this.addNode(type, x, y);
    }

    addNode(type, x, y) {
        const id = `node_${Date.now()}`;
        const node = { id, type, x, y, data: {} };
        this.nodes.push(node);
        this.renderNode(node);
    }

    renderNode(node) {
        const el = document.createElement('div');
        el.className = 'canvas-node';
        el.id = node.id;
        el.style.transform = `translate(${node.x}px, ${node.y}px)`;

        let icon = '⚡';
        if (node.type.includes('agent')) icon = '🤖';
        if (node.type.includes('log')) icon = '📝';
        if (node.type.includes('http')) icon = '🌐';

        el.innerHTML = `
            <div class="node-header">
                <span class="node-icon">${icon}</span>
                <span class="node-title">${node.type.replace('trigger_', '').replace('action_', '').replace('agent_', '').toUpperCase()}</span>
            </div>
            <div class="node-body">
                ${node.data.label || 'Configure...'}
            </div>
            <!-- Ports -->
            ${!node.type.includes('trigger') ? '<div class="node-handle handle-input" data-id="' + node.id + '" data-type="input"></div>' : ''}
            <div class="node-handle handle-output" data-id="${node.id}" data-type="output"></div>
        `;

        this.nodesLayer.appendChild(el);

        // Bind Node Events
        const header = el.querySelector('.node-header');
        header.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.isDragging = true;
            this.draggedNode = node;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            el.classList.add('selected');
        });

        // Bind Handle Events
        el.querySelectorAll('.node-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => this.startConnection(e, node, handle.dataset.type));
        });
    }

    startConnection(e, node, type) {
        e.stopPropagation();
        if (type === 'output') {
            this.activeConnection = { source: node.id, startX: e.clientX, startY: e.clientY };
        }
    }

    handleMouseDown(e) {
        if (e.target === this.canvas || e.target === this.connectionsLayer) {
            this.isPanning = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.canvas.classList.add('panning');
        }
    }

    handleMouseMove(e) {
        if (this.isDragging && this.draggedNode) {
            const dx = (e.clientX - this.lastMouseX) / this.scale;
            const dy = (e.clientY - this.lastMouseY) / this.scale;

            this.draggedNode.x += dx;
            this.draggedNode.y += dy;

            const el = document.getElementById(this.draggedNode.id);
            if (el) el.style.transform = `translate(${this.draggedNode.x}px, ${this.draggedNode.y}px)`;

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;

            this.updateConnections();
        }

        if (this.isPanning) {
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;

            this.panX += dx;
            this.panY += dy;

            this.updateTransform();

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }

        if (this.activeConnection) {
            // Draw temp line (optional, for now just logic)
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
        this.draggedNode = null;
        this.isPanning = false;
        this.canvas.classList.remove('panning');

        if (this.activeConnection) {
            const target = e.target.closest('.node-handle');
            if (target && target.dataset.type === 'input') {
                const targetId = target.dataset.id;
                this.addConnection(this.activeConnection.source, targetId);
            }
            this.activeConnection = null;
        }
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.scale = Math.min(Math.max(0.5, this.scale * delta), 2);
        this.updateTransform();
    }

    updateTransform() {
        this.nodesLayer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
        this.connectionsLayer.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }

    addConnection(sourceId, targetId) {
        // Prevent duplicates
        if (this.connections.some(c => c.source === sourceId && c.target === targetId)) return;

        this.connections.push({ source: sourceId, target: targetId });
        this.renderConnections();
    }

    renderConnections() {
        this.connectionsLayer.innerHTML = '';
        this.connections.forEach(conn => {
            const sourceNode = this.nodes.find(n => n.id === conn.source);
            const targetNode = this.nodes.find(n => n.id === conn.target);

            if (!sourceNode || !targetNode) return;

            // Simple anchor calculation (right side of source, left side of target)
            const sx = sourceNode.x + 200; // Node width
            const sy = sourceNode.y + 40; // Approx handle height
            const tx = targetNode.x;
            const ty = targetNode.y + 40;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            // Bezier Curve
            const cx1 = sx + 50;
            const cx2 = tx - 50;
            const d = `M ${sx} ${sy} C ${cx1} ${sy}, ${cx2} ${ty}, ${tx} ${ty}`;

            path.setAttribute("d", d);
            path.setAttribute("class", "connection-path");

            this.connectionsLayer.appendChild(path);
        });
    }

    updateConnections() {
        this.renderConnections(); // Re-render for simplicity
    }

    runWorkflow() {
        // 1. Serialize Graph to Schema
        const schema = {
            id: 'temp_workflow',
            name: 'Manual Run',
            nodes: this.nodes,
            connections: this.connections
        };

        // 2. Load into Engine
        this.engine.loadWorkflow(schema);

        // 3. Trigger
        this.engine.triggerWorkflow(schema.id)
            .then(ctx => {
                alert('Protocol Executed! Check Console.');
                console.log(ctx);
            })
            .catch(err => {
                alert('Error: ' + err.message);
            });
    }
}
