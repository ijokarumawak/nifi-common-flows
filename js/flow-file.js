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

        container.append('div')
            .classed('flow-file-id', true)
            .text(d => d.id)
            .on('click', d => {
                if (d.showData === true) {
                    d.showData = false;
                    d.showAttributes = false;
                    d.showContent = false;
                } else {
                    d.showData = true;
                }
                
                flowFile.render(flowFiles);
            });

        // Create attribute place-holder
        container.append('div').text('Attributes').classed('data-label', true)
            .on('click', d => {
                d.showAttributes = d.showAttributes === true ? false : true;
                flowFile.render(flowFiles);
            });
        var attributeTable = container.append('table')
            .append('tbody')
            .classed('flow-file-attributes', true);
        var attributeHeader = attributeTable.append('tr');
        attributeHeader.append('th').text('name');
        attributeHeader.append('th').text('value');

        // Create content place-holder
        container.append('div').text('Content').classed('data-label', true)
            .on('click', d => {
                d.showContent = d.showContent === true ? false : true;
                flowFile.render(flowFiles);
            });
        container.append('div')
            .classed('flow-file-content', true);

    }

    renderContainer(container) {
        // Update positions.
        container
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);

        // Show data labels.
        container.selectAll('.data-label')
            .style('display', d => d.showData ? 'block' : 'none')

        // Render attributes.
        var attributes = container.select('.flow-file-attributes')
            .style('display', d => d.showAttributes ? 'block' : 'none');

        var exAttributes = attributes
            .selectAll('.flow-file-attribute')
            .data(d => d.attributes)
        var newAttributes = exAttributes.enter()
            .append('tr')
            .classed('flow-file-attribute', true);
        newAttributes.append('td');
        newAttributes.append('td');

        [exAttributes, newAttributes].forEach(attribute => {
            attribute.transition().style('background-color', d => d.highlight ? '#E1DC88' : 'white');
            attribute.selectAll('td').data(d => [d.name, d.value]).text(d => d);
        });

        // Render content.
        container.select('.flow-file-content')
            .style('display', d => d.showContent ? 'block' : 'none')
            .text(d => d.content.value);
    }
}
