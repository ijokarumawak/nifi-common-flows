class FlowDiagram {

    constructor({title, flowFiles, processors, controllerServices, arrows, actions}) {
        this.title = title;
        this.index = 0;
        this.flowFiles = flowFiles;
        this.processors = processors;
        this.controllerServices = controllerServices;
        this.arrows = arrows;
        this.actions = actions;
        // Analyze and expand animations.
        this.frames = new Array(actions.length);

        var orPrevious = (action, prevFrame, objectId, paramName, defaultValue) => {
            var a = action[objectId];
            return (typeof a !== 'undefined' && typeof a[paramName] !== 'undefined')
                // Return if the param is defined at the current action
                ? a[paramName]
                // If not, return previous value, or default value.
                : ((typeof prevFrame !== 'undefined')
                        ? prevFrame[objectId][paramName] : defaultValue);
        }

        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            var frame = {};
            var prevFrame = i == 0 ? undefined : this.frames[i - 1];
            this.frames[i] = frame;
            
            // Create each objects action
            this.flowFiles.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false),
                    highlight: orPrevious(action, prevFrame, id, 'highlight', false),
                    x: orPrevious(action, prevFrame, id, 'x', 0),
                    y: orPrevious(action, prevFrame, id, 'y', 0)
                };
            });

            this.processors.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false),
                    highlight: orPrevious(action, prevFrame, id, 'highlight', false)
                };
            });

            this.controllerServices.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false),
                    highlight: orPrevious(action, prevFrame, id, 'highlight', false)
                };
            });

            this.arrows.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false)
                };
            });
        }
        console.log('frames=', this.frames);
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

        var frame = this.frames[this.index];

        // Render FlowFiles.
        this.flowFiles.forEach(d => {
            var fa = frame[d.toId()];
            d.position = {x: fa.x, y: fa.y};
            d.setHighlight(fa.highlight);
            if (fa.render) {
                d.render();
            } else {
                d.hide();
            }
        });

        // Render Processors.
        this.processors.forEach(d => {
            var fa = frame[d.toId()];
            d.setHighlight(fa.highlight);
            if (fa.render) {
                d.render();
            } else {
                d.hide();
            }
        });

        // Render ControllerServices.
        this.controllerServices.forEach(d => {
            var fa = frame[d.toId()];
            d.setHighlight(fa.highlight);
            if (fa.render) {
                d.render();
            } else {
                d.hide();
            }
        });

        // Render Arrows.
        this.arrows.forEach(d => {
            var fa = frame[d.toId()];
            if (fa.render) {
                d.render();
            } else {
                d.hide();
            }
        });
        
    }

}
