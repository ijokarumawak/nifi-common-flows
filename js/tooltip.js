class Tooltip extends HTMLRenderable {
    constructor(id) {
        super(id);
    }

    toId() {
        return `tooltip_${this.id}`;
    }

    setupContainer(container) {
        container.classed('tooltip', true);

        // Set position to avoid showing moving animation when it's created.
        container
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);
        
    }

    renderContainer(container) {

        // Update style.
        container.transition()
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);

        // Render content.
        // TODO: Markdown
        var contentContainer = container
            .datum(this)
            .text(d => d.value);
    }

}
