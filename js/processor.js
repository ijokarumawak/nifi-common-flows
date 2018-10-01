var processor = {
    render: processors => {
        var diagram = d3.select('#diagram-container');

        // Select existing ones
        var exContainer = diagram
            .selectAll('.processor')
            .data(processors);

        // Create new ones
        var newContainer = exContainer.enter()
            .append('div')
            .classed('processor', true);

        newContainer.append('div')
            .classed('processor-name', true)
            .text(d => d.name)
            .on('click', d => {
                d.showDetails = d.showDetails === true ? false : true;
                console.log(d);
                processor.render(processors);
            });

        // Remove deleted ones
        exContainer.exit().remove();

        // Create properties place-holder
        newContainer.append('div').text('Properties').classed('data-label', true);
        var propertiesTable = newContainer.append('table')
            .append('tbody')
            .classed('processor-properties', true);
        var propertyHeader = propertiesTable.append('tr');
        propertyHeader.append('th').text('name');
        propertyHeader.append('th').text('value');

        // Common rendering logic for existing and new ones.
        [exContainer, newContainer].forEach(container => {
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
        });

        
    }
}
