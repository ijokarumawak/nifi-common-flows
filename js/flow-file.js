class FlowFile extends HTMLRenderable {
    constructor(id, seq) {
        super(id);
        this.seq = seq;
    }

    toId() {
        return `flow-file_${this.id}_${this.seq}`;
    }

    setupContainer(container) {
        container.classed('flow-file', true);

        // Set position to avoid showing moving animation when it's created.
        container
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`)
            .style('opacity', 0);
            
        container.append('div')
            .classed('flow-file-id', true)
            .text(d => `${d.id}.${d.seq}`);

        // Create attribute place-holder
        var attributeContainer = container.append('div')
            .classed('flow-file-attributes-container', true);
        attributeContainer.append('div').text('Attributes').classed('data-label', true);
        var attributeTable = attributeContainer.append('table')
            .append('tbody')
            .classed('flow-file-attributes', true);
        var attributeHeader = attributeTable.append('tr');
        attributeHeader.append('th').text('name');
        attributeHeader.append('th').text('value');

        // Create content place-holder
        var contentContainer = container.append('div')
            .classed('flow-file-content-container', true);
        contentContainer.append('div').text('Content').classed('data-label', true);
        contentContainer.append('div')
            .classed('flow-file-content', true);

        container.append('div')
            .classed('flow-file-footer', true);
    }

    renderContainer(container) {

        // Update style.
        container.transition()
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`)
            .style('opacity', 1);

        // Highlight name.
        container.select('.flow-file-id')
            .classed('flow-file-id-highlight', d => d.highlight);
        container.select('.flow-file-footer')
            .classed('flow-file-id-highlight', d => d.highlight);

        // Render attributes.
        container.select('.flow-file-attributes-container')
            .style('display', d => d.showAttributes ? 'block' : 'none');

        if (this.showAttributes) {
            var attributes = container.select('.flow-file-attributes')

            var exAttributes = attributes
                .selectAll('.flow-file-attribute')
                .data(d => d.attributes)
            var newAttributes = exAttributes.enter()
                .append('tr')
                .classed('flow-file-attribute', true);
            newAttributes.append('td');
            newAttributes.append('td');
    
            var attributeRows = attributes.selectAll('.flow-file-attribute');
            attributeRows.transition().style('background-color', d => d.highlight ? '#E1DC88' : null);
            attributeRows.selectAll('td').data(d => [d.name, d.value]).text(d => d);
        }

        // Render content.
        var contentContainer = container.select('.flow-file-content-container')
            .style('display', d => d.showContent ? 'block' : 'none');

        if (this.showContent && this.content) {
            contentContainer.select('.flow-file-content')
                .html(this.mdConverter.makeHtml(this.content));
        }

    }

    setHighlight(spec) {
        this.highlight = typeof spec !== undefined && spec;

        this.attributes.forEach(attribute => attribute.highlight
             = spec && spec.attributes && spec.attributes.includes(attribute.name));
    }
}
