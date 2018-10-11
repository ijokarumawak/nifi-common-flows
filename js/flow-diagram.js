class FlowDiagram {

    constructor({title, flowFiles, processors, controllerServices, arrows, tooltips, actions}) {
        this.title = title;
        this.index = 0;
        this.flowFiles = flowFiles;
        this.processors = processors;
        this.controllerServices = controllerServices;
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
            this.flowFiles.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false),
                    highlight: orPrevious(action, prevFrame, id, 'highlight', false),
                    showAttributes: orPrevious(action, prevFrame, id, 'showAttributes', false),
                    showContent: orPrevious(action, prevFrame, id, 'showContent', false),
                    x: orPrevious(action, prevFrame, id, 'x', 0),
                    y: orPrevious(action, prevFrame, id, 'y', 0)
                };
            });

            this.processors.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false),
                    highlight: orPrevious(action, prevFrame, id, 'highlight', false),
                    x: orPrevious(action, prevFrame, id, 'x', 0),
                    y: orPrevious(action, prevFrame, id, 'y', 0)
                };
            });

            frame['controller-services'] = {
                x: orPrevious(action, prevFrame, 'controller-services', 'x', 0),
                y: orPrevious(action, prevFrame, 'controller-services', 'y', 0)
            }

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

            this.tooltips.forEach(d => {
                var id = d.toId();
                frame[id] = {
                    render: orPrevious(action, prevFrame, id, 'render', false),
                    content: orPrevious(action, prevFrame, id, 'content', false),
                    x: orPrevious(action, prevFrame, id, 'x', 0),
                    y: orPrevious(action, prevFrame, id, 'y', 0)
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

        // Render FlowFiles.
        this.flowFiles.forEach(d => {
            var fa = frame[d.toId()];
            d.position = {x: fa.x, y: fa.y};
            d.showAttributes = fa.showAttributes;
            d.showContent = fa.showContent;
            d.setHighlight(fa.highlight);
            if (fa.render) {
                d.render();
                captureBBoxForNode(d);
            } else {
                d.hide();
            }
        });

        // Render Processors.
        this.processors.forEach(d => {
            var fa = frame[d.toId()];
            d.position = {x: fa.x, y: fa.y};
            d.setHighlight(fa.highlight);
            if (fa.render) {
                d.render();
                captureBBoxForNode(d);
            } else {
                d.hide();
            }
        });

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

        // Render ControllerServices.
        var isAnyCSShown = typeof this.controllerServices.find(d => frame[d.toId()].render) !== 'undefined';
        if (isAnyCSShown) {
            // Create CS container if not exist.
            var container = d3.select('#diagram-container');
            container.selectAll('#controller-services')
                .data([frame['controller-services']])
                .enter()
                .append('div')
                .attr('id', 'controller-services')
                .style('left', d => `${d.x}px`)
                .style('top', d => `${d.y}px`)
                .append('div')
                .classed('controller-services-title', true)
                .text('Controller Services');
            
            // Update CS container position.
            container.select('#controller-services')
                .transition()
                .style('left', d => `${d.x}px`)
                .style('top', d => `${d.y}px`);

        } else {
            // Delete CS container.
            d3.select('#controller-services').remove();
        }

        this.controllerServices.forEach(d => {
            var fa = frame[d.toId()];
            d.setHighlight(fa.highlight);
            if (fa.render) {
                d.render();
                isAnyCSShown = true;
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
        
        // Render Tooltips.
        this.tooltips.forEach(d => {
            var fa = frame[d.toId()];
            d.position = {x: fa.x, y: fa.y};
            d.content = fa.content;
            if (fa.render) {
                d.render();
            } else {
                d.hide();
            }
        });

        // Highlight code blocks.
        var codeBlocks = document.getElementsByTagName('code');
        for (var i = 0; i < codeBlocks.length; i++) {
            hljs.highlightBlock(codeBlocks[i]);
        }
    }

}
