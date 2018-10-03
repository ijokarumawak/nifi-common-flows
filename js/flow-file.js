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
            .text(d => `${d.id}.${d.seq}`)
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

        // Highlight name.
        container.select('.flow-file-id')
            .classed('flow-file-id-highlight', d => d.highlight);

        // Show data labels.
        container.selectAll('.data-label')
            .style('display', d => d.showData ? 'block' : 'none')

        // Render attributes.
        var attributes = container.select('.flow-file-attributes')
            .style('display', d => d.showAttributes ? 'table-row-group' : 'none');

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
        var contentContainer = container.select('.flow-file-content')
            .style('display', d => d.showContent ? 'block' : 'none');
        if (this.content) {
            switch (typeof this.content.value) {
                case 'string':
                    contentContainer.text(d => d.content.value);
                    break;
                case 'function':
                    this.content.value(contentContainer);
                    break;
                case 'object':
                    if (Array.isArray(this.content.value)) {
                        contentContainer.selectAll('div')
                            .data(this.content.value)
                            .text(d => d)
                            .enter()
                            .append('div')
                            .text(d => d);
                    }
                    break;
            }
        }
    }

    setHighlight(spec) {
        this.highlight = typeof spec !== undefined && spec != null;

        this.attributes.forEach(attribute => attribute.highlight
             = spec && spec.attributes && spec.attributes.includes(attribute.name));
    }
}
