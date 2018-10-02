class Renderable {
    constructor(id) {
        this.id = id;
    }

    bbox() {
        return common.bbox(this);
    }
    
    render() {
        // Select existing ones
        var exContainer = this.selectContainer();

        // Create new ones
        var newContainer = this.createNewContainer(exContainer);
        this.setupContainer(newContainer);

        // Common rendering logic for existing and new ones.
        [exContainer, newContainer].forEach(container => this.renderContainer(container));

    }

    hide() {
        // Delete existing ones
        var diagram = d3.select('#diagram-container');
        var exContainer = diagram
            .selectAll(`#${this.toId()}`)
            .remove();
    }


    /**
     * Subclasses should implement this method.
     * Setup new container created by d3 enter() by appending required objects.
     * @param {*} container 
     */
    setupContainer(container) {        
    }

    /**
     * Subclasses should implement this method.
     * Render container. This method is called to render both brand-new and existing container.
     * @param {*} container 
     */
    renderContainer(container) {
    }
}

class HTMLRenderable extends Renderable {
    selectContainer() {
        var parent = d3.select('#diagram-container');

        // Select existing ones
        var exContainer = parent
            .selectAll(`#${this.toId()}`)
            .data([this]);

        return exContainer;
    }

    createNewContainer(exContainer) {
        return exContainer.enter()
            .append('div')
            .attr('id', this.toId());
    }
}

class SVGRenderable extends Renderable {
    selectContainer() {
        var parent = d3.select('#diagram-svg');

        // Select existing ones
        var exContainer = parent
            .selectAll(`#${this.toId()}`)
            .data([this]);

        return exContainer;
    }

    createNewContainer(exContainer) {
        return exContainer.enter()
            .append('g')
            .attr('id', this.toId());
    }
}
