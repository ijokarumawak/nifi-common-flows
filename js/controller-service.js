class ControllerService extends HTMLRenderable {
    constructor(id, name) {
        super(id);
        this.name = name;
    }

    toId() {
        return `controller-service_${this.id}`;
    }

    getParentElementId() {
        return 'controller-services';
    }

    setupContainer(container) {
        container.classed('controller-service', true);

        container.append('div')
            .classed('controller-service-name', true)
            .text(d => d.name);

        // Create properties place-holder
        container.append('div').text('Properties').classed('data-label', true);
        var propertiesTable = container.append('table')
            .append('tbody')
            .classed('controller-service-properties', true);
        var propertyHeader = propertiesTable.append('tr');
        propertyHeader.append('th').text('name');
        propertyHeader.append('th').text('value');
    }

    renderContainer(container) {
        // Ensure the parent is shown.
        d3.select('#controller-services').style('display', 'block');

        // Highlight name.
        container.select('.controller-service-name')
            .classed('controller-service-name-highlight', d => d.highlight);

        // Render properties.
        var properties = container.select('.controller-service-properties')
            .style('display', d => d.properties && d.properties.length > 0 ? 'table-row-group' : 'none');

        var exProperties = properties
            .selectAll('.controller-service-property')
            .data(d => d.properties ? d.properties : [])
        var newProperties = exProperties.enter()
            .append('tr')
            .classed('controller-service-property', true);
        newProperties.append('td');
        newProperties.append('td');

        [exProperties, newProperties].forEach(property => {
            property.selectAll('td').data(d => [d.name, d.value]).text(d => d);
        });
    }
}
