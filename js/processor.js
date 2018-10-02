class Processor extends HTMLRenderable {
    constructor(id, name) {
        super(id);
        this.name = name;
    }

    toId() {
        return `processor_${this.id}`;
    }

    setupContainer(container) {
        container.classed('processor', true);

        container.append('div')
            .classed('processor-name', true)
            .text(d => d.name)
            .on('click', d => {
                d.showDetails = d.showDetails === true ? false : true;
                console.log(d);
                processor.render(processors);
            });

        // Create properties place-holder
        container.append('div').text('Properties').classed('data-label', true);
        var propertiesTable = container.append('table')
            .append('tbody')
            .classed('processor-properties', true);
        var propertyHeader = propertiesTable.append('tr');
        propertyHeader.append('th').text('name');
        propertyHeader.append('th').text('value');
    }

    renderContainer(container) {
        // Update positions.
        container
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);

        // Show data labels.
        container.selectAll('.data-label')
            .style('display', d => d.showDetails ? 'block' : 'none')

        // Render properties.
        var properties = container.select('.processor-properties')
            .style('display', d => d.properties && d.properties.length > 0 && d.showDetails ? 'block' : 'none');

        var exProperties = properties
            .selectAll('.processor-property')
            .data(d => d.properties ? d.properties : [])
        var newProperties = exProperties.enter()
            .append('tr')
            .classed('processor-property', true);
        newProperties.append('td');
        newProperties.append('td');

        [exProperties, newProperties].forEach(property => {
            property.selectAll('td').data(d => [d.name, d.value]).text(d => d);
        });
    }
}
