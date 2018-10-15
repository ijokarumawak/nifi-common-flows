class ControllerServices extends RenderableContainer {

    constructor(children) {
        super('controller-services', children);
    }

    toId() {
        return `controller-services`;
    }

    setupContainer(container) {
        this.setDraggable(container);
        
        container
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`)
            .append('div')
            .classed('controller-services-title', true)
            .text('Controller Services');
    }

    renderContainer(container) {
        container.transition()
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);
    }

}

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
        var propertiesContainer = container.append('div')
            .classed('controller-service-properties-container', true);
        propertiesContainer.append('div').text('Properties').classed('data-label', true);
        var propertiesTable = propertiesContainer.append('table')
            .append('tbody')
            .classed('controller-service-properties', true);
        var propertiesHeader = propertiesTable.append('tr');
        propertiesHeader.append('th').text('name');
        propertiesHeader.append('th').text('value');
    }

    renderContainer(container) {
        // Ensure the parent is shown.
        d3.select('#controller-services').style('display', 'block');

        // Highlight name.
        container.select('.controller-service-name')
            .classed('controller-service-name-highlight', d => d.highlight);

        // Render properties.
        container.select('.controller-service-properties-container')
            .style('display', d => d.showProperties ? 'block' : 'none');

        if (this.showProperties) {
            var properties = container.select('.controller-service-properties')

            var exProperties = properties
                .selectAll('.controller-service-property')
                .data(d => d.properties)
            var newProperties = exProperties.enter()
                .append('tr')
                .classed('controller-service-property', true);
            newProperties.append('td');
            newProperties.append('td');
    
            var propertyRows = properties.selectAll('.controller-service-property');
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
