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

        // Highlihgt objects.
        // Find highlight spec, if not defined at the current action, seek backward.
        var highlightSpec;
        for (var i = this.index; i >= 0 && typeof highlightSpec === 'undefined'; i--) {
            highlightSpec = this.actions[i].highlight;
        }

        if (typeof highlightSpec === 'undefined') {
            // Use empty spec to clear all highlights.
            highlightSpec = {};
        }
        this.highlightObjects(highlightSpec.flowFiles, 'FlowFile');
        this.highlightObjects(highlightSpec.processors, 'Processor');
        this.highlightObjects(highlightSpec.controllerServices, 'ControllerService');

        // Finally update the diagram.
        // Find render spec, if not defined at the current action, seek backward.
        var renderSpec;
        for (var i = this.index; i >= 0 && typeof renderSpec === 'undefined'; i--) {
            renderSpec = this.actions[i].render;
        }

        // Remove unspecified ones.
        var ids = renderSpec.map(d => d.toId());
        for (var k in renderedObjects) {
            var o = renderedObjects[k];
            if (!ids.includes(o.toId())) {
                o.hide();
            }
        }                

        // Render specific objects.
        renderSpec.forEach(o => o.render());

    }

    highlightObjects(_targets, className) {
        // Convert array to object so that targets can be found by its id.
        var targets = {};
        if (typeof _targets !== 'undefined') {
            _targets.forEach(t => targets[t.d.toId()] = t);
        }

        for (var k in renderedObjects) {
            var o = renderedObjects[k];
            if (o.constructor.name === className) {
                var spec = targets[o.toId()];
                o.setHighlight(spec);
            }
        }
    }

}
