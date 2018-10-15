class Processor extends HTMLRenderable {
    constructor(id, name) {
        super(id);
        this.name = name;
        this.properties = [];
        this.iconClass = 'fa-play';
    }

    toId() {
        return `processor_${this.id}`;
    }

    setupContainer(container) {
        this.setDraggable(container);

        container.classed('processor', true)
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);

        var processorName = container.append('div')
            .classed('processor-name', true);
        
        processorName.append('i')
            .classed('fa', true)
            .classed(this.iconClass, true);

        processorName.append('span').text(d => d.name);

        // Create properties place-holder
        var propertiesContainer = container.append('div')
            .classed('processor-properties-container', true);
        propertiesContainer.append('div').text('Properties').classed('data-label', true);
        var propertiesTable = propertiesContainer.append('table')
            .append('tbody')
            .classed('processor-properties', true);
        var propertiesHeader = propertiesTable.append('tr');
        propertiesHeader.append('th').text('name');
        propertiesHeader.append('th').text('value');
    }

    renderContainer(container) {
        // Update positions.
        container
            .transition()
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);

        // Highlight name.
        container.select('.processor-name')
            .classed('processor-name-highlight', d => d.highlight);

        // Show data labels.
        container.selectAll('.data-label')
            .style('display', d => d.showDetails ? 'block' : 'none')

        // Render properties.
        container.select('.processor-properties-container')
            .style('display', d => d.showProperties ? 'block' : 'none');

        if (this.showProperties) {
            var properties = container.select('.processor-properties')

            var exProperties = properties
                .selectAll('.processor-property')
                .data(d => d.properties)
            var newProperties = exProperties.enter()
                .append('tr')
                .classed('processor-property', true);
            newProperties.append('td');
            newProperties.append('td');
    
            var propertyRows = properties.selectAll('.processor-property');
            propertyRows.classed('highlighted', d => d.highlight);
            propertyRows.selectAll('td').data(d => [d.name, d.value]).text(d => d);
        }
    }

    setHighlight(spec) {
        this.highlight = typeof spec !== undefined && spec;

        this.properties.forEach(property => property.highlight
             = spec && spec.properties && spec.properties.includes(property.name));
    }
}
