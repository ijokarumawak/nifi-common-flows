class Tooltip extends HTMLRenderable {
    constructor(id) {
        super(id);
    }

    toId() {
        return `tooltip_${this.id}`;
    }

    setupContainer(container) {
        this.setDraggable(container);
        
        container.classed('tooltip', true);

        // Set position to avoid showing moving animation when it's created.
        container
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);
        
        container
            .append('div')
            .classed('tooltipContent', true);
    }

    renderContainer(container) {

        // Update style.
        container.transition()
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);

        // Render content as Markdown.
        container
            .selectAll('.tooltipContent')
            .html(this.mdConverter.makeHtml(this.content));
    }

}
