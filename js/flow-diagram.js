class FlowDiagram {

    constructor(title, index, actions) {
        this.title = title;
        this.index = index;
        this.actions = actions;
    }

    render() {
        d3.select('#diagram-title')
            .text(`${this.title}`);

        d3.select('#diagram-index')
            .text(`${this.index + 1} / ${this.actions.length}`);

        d3.select('#diagram-first')
            .on('click', () => {
                this.index = 0;
                this.render();
            })

        d3.select('#diagram-previous')
            .on('click', () => {
                this.index = Math.max(this.index - 1, 0);
                this.render();
            })

        d3.select('#diagram-next')
            .on('click', () => {
                this.index = Math.min(this.index + 1, this.actions.length - 1);
                this.render();
            })

        d3.select('#diagram-last')
            .on('click', () => {
                this.index = this.actions.length - 1;
                this.render();
            })

        var a = this.actions[this.index];
        // Execute custom action.
        if (typeof a.action === 'function') {
            a.action();
        }

        // Render new objects.
        if (typeof a.render !== 'undefined') {
            a.render.forEach(o => o.render());
        }

        // Highlihgt objects.
        if (typeof a.highlight !== 'undefined') {
            this.highlightObjects(a.highlight.flowFiles, 'FlowFile');
            this.highlightObjects(a.highlight.processors, 'Processor');
            this.highlightObjects(a.highlight.controllerServices, 'ControllerService');
        } else {
            this.clearHighlight();
        }

        // Refresh rendered objects.
        this.refresh();
    }

    clearHighlight() {
        for (var k in renderedObjects) {
            var o = renderedObjects[k];
            o.highlight = false;
        }
    }

    highlightObjects(targets, className) {
        var ids = typeof targets !== 'undefined' ? targets.map(t => t.toId()) : [];
        for (var k in renderedObjects) {
            var o = renderedObjects[k];
            if (o.constructor.name === className) {
                o.highlight = ids.includes(o.toId());
            }
        }
    }

    refresh() {
        for (var k in renderedObjects) {
            var o = renderedObjects[k];
            o.render();
        }
    }
}
