class FlowDiagram {

    constructor({title, flowFiles, processors, connections, controllerServices,
                 dataSets, arrows, tooltips, actions}) {
        this.title = title;
        this.index = 0;
        this.flowFiles = flowFiles;
        this.processors = processors;
        this.connections = connections;
        this.controllerServices = typeof controllerServices !== 'undefined' ? new ControllerServices(controllerServices) : undefined;
        this.dataSets = dataSets;
        this.arrows = arrows;
        this.tooltips = tooltips;
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
            if (this.flowFiles) {
                this.flowFiles.forEach(d => {
                    var id = d.toId();
                    frame[id] = {
                        visible: orPrevious(action, prevFrame, id, 'visible', false),
                        highlight: orPrevious(action, prevFrame, id, 'highlight', false),
                        showAttributes: orPrevious(action, prevFrame, id, 'showAttributes', false),
                        showContent: orPrevious(action, prevFrame, id, 'showContent', false),
                        x: orPrevious(action, prevFrame, id, 'x', 0),
                        y: orPrevious(action, prevFrame, id, 'y', 0),
                        content: orPrevious(action, prevFrame, id, 'content', undefined)
                    };
                });
            }

            if (this.processors) {
                this.processors.forEach(d => {
                    var id = d.toId();
                    frame[id] = {
                        visible: orPrevious(action, prevFrame, id, 'visible', false),
                        highlight: orPrevious(action, prevFrame, id, 'highlight', false),
                        showProperties: orPrevious(action, prevFrame, id, 'showProperties', false),
                        x: orPrevious(action, prevFrame, id, 'x', 0),
                        y: orPrevious(action, prevFrame, id, 'y', 0)
                    };
                });
            }

            frame['controller-services'] = {
                x: orPrevious(action, prevFrame, 'controller-services', 'x', 0),
                y: orPrevious(action, prevFrame, 'controller-services', 'y', 0)
            }

            if (this.controllerServices) {
                this.controllerServices.children.forEach(d => {
                    var id = d.toId();
                    frame[id] = {
                        showProperties: orPrevious(action, prevFrame, id, 'showProperties', false),
                        visible: orPrevious(action, prevFrame, id, 'visible', false),
                        highlight: orPrevious(action, prevFrame, id, 'highlight', false)
                    };
                });
            }

            if (this.dataSets) {
                this.dataSets.forEach(ds => {
                    var dsId = ds.toId();
                    frame[dsId] = {
                        x: orPrevious(action, prevFrame, dsId, 'x', 0),
                        y: orPrevious(action, prevFrame, dsId, 'y', 0)
                    };

                    ds.children.forEach(d => {
                        var id = d.toId();
                        frame[id] = {
                            visible: orPrevious(action, prevFrame, id, 'visible', false),
                            highlight: orPrevious(action, prevFrame, id, 'highlight', false),
                            showHeaders: orPrevious(action, prevFrame, id, 'showHeaders', false),
                            showContent: orPrevious(action, prevFrame, id, 'showContent', false),
                            content: orPrevious(action, prevFrame, id, 'content', undefined),
                        };
                    });
                });
            }

            if (this.arrows) {
                this.arrows.forEach(d => {
                    var id = d.toId();
                    frame[id] = {
                        visible: orPrevious(action, prevFrame, id, 'visible', false)
                    };
                });
            }

            if (this.tooltips) {
                this.tooltips.forEach(d => {
                    var id = d.toId();
                    frame[id] = {
                        visible: orPrevious(action, prevFrame, id, 'visible', false),
                        content: orPrevious(action, prevFrame, id, 'content', false),
                        x: orPrevious(action, prevFrame, id, 'x', 0),
                        y: orPrevious(action, prevFrame, id, 'y', 0)
                    };
                });
            }
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

        var renderNext = () => {
            this.index = Math.min(this.index + 1, this.actions.length - 1);
            this.render();
        };
        d3.select('#diagram-next').on('click', renderNext);
        d3.select('#diagram-container').on('click', renderNext);

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

        // Node boundaries.
        var bboxesForNode = {};
        var captureBBoxForNode = (d) => {
            if (d.node) {
                if (typeof bboxesForNode[d.node] === 'undefined') {
                    bboxesForNode[d.node] = [];
                }
                bboxesForNode[d.node].push(d.bbox());
            }
        }

        // Render Processors.
        if (this.processors) {
            this.processors.forEach(d => {
                var fa = frame[d.toId()];
                d.position = {x: fa.x, y: fa.y};
                d.setHighlight(fa.highlight);
                d.visible = fa.visible;
                d.showProperties = fa.showProperties;
                d.refresh();
                if (d.visible) {
                    captureBBoxForNode(d);
                }
            });
        }

        // Pre-render Connections to create divs so that queued FlowFiles can be added.
        if (this.connections) {
            this.connections.filter(d => d.isVisible()).forEach(d => d.ensureContainer());
        }

        // Render FlowFiles.
        if (this.flowFiles) {
            this.flowFiles.forEach(d => {
                var fa = frame[d.toId()];
                d.position = {x: fa.x, y: fa.y};
                d.showAttributes = fa.showAttributes;
                d.showContent = fa.showContent;
                d.setHighlight(fa.highlight);
                d.visible = fa.visible;
                d.content = fa.content;
                d.refresh();
                if (d.visible) {
                    captureBBoxForNode(d);
                }
            });
        }

        // Re-render Connections to update its position.
        if (this.connections) {
            this.connections.forEach(d => {
                d.refresh();
            });
        }

        // Render node boundary.
        var nodeBoundaries = [];
        for (var nodeId in bboxesForNode) {
            var bboxes = bboxesForNode[nodeId];
            var x0 = Math.min(...bboxes.map(b => b.x));
            var x1 = Math.max(...bboxes.map(b => b.x + b.w));
            var y0 = Math.min(...bboxes.map(b => b.y));
            var y1 = Math.max(...bboxes.map(b => b.y + b.h));
            nodeBoundaries.push({id: nodeId,
                x: x0 - 10, y: y0 - 20,
                w: x1 - x0 + 20, h: y1 - y0 + 30});
        }

        // Render node boundaries.
        var nodeBoundarySelection = d3.select('#diagram-container')
            .selectAll('.node-boundary')
            .data(nodeBoundaries);
        nodeBoundarySelection.exit().remove();
        nodeBoundarySelection.enter()
            .append('div')
            .classed('node-boundary', true)
            .text(d => `node: ${d.id}`);

        d3.select('#diagram-container')
            .selectAll('.node-boundary')
            .data(nodeBoundaries)
            .transition()
            .style('left', d => `${d.x}px`)
            .style('top', d => `${d.y}px`)
            .style('width', d => `${d.w}px`)
            .style('height', d => `${d.h}px`);


        if (this.controllerServices) {
            // Update ControllerService instances.
            this.controllerServices.children.forEach(d => {
                var fa = frame[d.toId()];
                d.showProperties = fa.showProperties;
                d.setHighlight(fa.highlight);
                d.visible = fa.visible;
            });
            // Then render ControllerServices.
            var csf = frame['controller-services'];
            this.controllerServices.position = {x: csf.x, y: csf.y};
            this.controllerServices.refresh();
        }

        if (this.dataSets) {
            this.dataSets.forEach(ds => {
                // Update DataObject instances.
                ds.children.forEach(d => {
                    var fa = frame[d.toId()];
                    d.setHighlight(fa.highlight);
                    d.visible = fa.visible;
                    d.showHeaders = fa.showHeaders;
                    d.showContent = fa.showContent;
                    d.content = fa.content;
                });
                // Then render DataSets.
                var dsf = frame[ds.toId()];
                ds.position = {x: dsf.x, y: dsf.y};
                ds.refresh();
            });
        }

        // Render Arrows.
        if (this.arrows) {
            this.arrows.forEach(d => {
                var fa = frame[d.toId()];
                d.visible = fa.visible;
                d.refresh();
            });
        }
        
        // Render Tooltips.
        if (this.tooltips) {
            this.tooltips.forEach(d => {
                var fa = frame[d.toId()];
                d.position = {x: fa.x, y: fa.y};
                d.content = fa.content;
                d.visible = fa.visible;
                d.refresh();
            });
        }

        // Highlight code blocks.
        var codeBlocks = document.getElementsByTagName('code');
        for (var i = 0; i < codeBlocks.length; i++) {
            hljs.highlightBlock(codeBlocks[i]);
        }
    }

}
