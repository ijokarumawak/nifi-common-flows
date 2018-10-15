class DataSet extends RenderableContainer {

    constructor(iconClass, id, name, children) {
        super(id, children);
        this.iconClass = iconClass;
        this.name = name;
        children.forEach(c => c.parentId = this.toId());
    }

    toId() {
        return `data-set_${this.id}`;
    }

    isVisible() {
        return typeof this.children.find(d => d.isVisible()) !== 'undefined';
    }

    setupContainer(container) {
        this.setDraggable(container);

        var dataSetName = container
            .classed('data-set', true)    
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`)
            .append('div')
            .classed('data-set-name', true);
        dataSetName.append('i')
            .classed('fa', true)
            .classed(this.iconClass, true);
        dataSetName.append('span')
            .text(d => d.name);        
    }

    renderContainer(container) {
        container.transition()
            .style('left', d => `${d.position.x}px`)
            .style('top', d => `${d.position.y}px`);
    }

}

class DataObject extends HTMLRenderable {
    constructor(iconClass, id, name) {
        super(id);
        this.name = name;
        this.iconClass = iconClass;
    }

    toId() {
        return `data-object_${this.id}`;
    }

    getPosition() {
        var parentDiv = document.getElementById(this.getParentElementId());
        var thisDiv = document.getElementById(this.toId());
        return {x: parentDiv.offsetLeft + thisDiv.offsetLeft, y: parentDiv.offsetLeft + thisDiv.offsetTop};
    }

    getParentElementId() {
        return this.parentId;
    }

    setupContainer(container) {
        container.classed('data-object', true).style('opacity', 0);

        var objectName = container.append('div')
            .classed('data-object-name', true);
        
        objectName.append('i')
            .classed('fa', true)
            .classed(this.iconClass, true);

        objectName.append('span')
            .text(d => d.name);

        // Create headers place-holder
        var headerContainer = container.append('div')
        .classed('data-object-headers-container', true);
        headerContainer.append('div').text('Headers').classed('data-label', true);
        var headerTable = headerContainer.append('table')
            .append('tbody')
            .classed('data-object-headers', true);
        var header = headerTable.append('tr');
        header.append('th').text('name');
        header.append('th').text('value');

        // Create content place-holder
        var contentContainer = container.append('div')
            .classed('data-object-content-container', true);
        contentContainer.append('div').text('Content').classed('data-label', true);
        contentContainer.append('div')
            .classed('data-object-content', true);

        container.append('div')
            .classed('data-object-footer', true);
    }

    renderContainer(container) {

        // Update style.
        container.transition()
            .style('opacity', 1);

        // Highlight name.
        container.select('.data-object-name')
            .classed('data-object-name-highlight', d => d.highlight);
        container.select('.data-object-footer')
            .classed('data-object-name-highlight', d => d.highlight);

        // Render headers.
        container.select('.data-object-headers-container')
            .style('display', d => d.showHeaders ? 'block' : 'none');

        if (this.showHeaders) {
            var headers = container.select('.data-object-headers')

            var exHeaders = headers
                .selectAll('.data-object-header')
                .data(d => d.headers)
            var newHeaders = exHeaders.enter()
                .append('tr')
                .classed('data-object-header', true);
            newHeaders.append('td');
            newHeaders.append('td');
    
            var headerRows = headers.selectAll('.data-object-header');
            headerRows.classed('highlighted', d => d.highlight);
            headerRows.selectAll('td').data(d => [d.name, d.value]).text(d => d);
        }

        // Render content.
        var contentContainer = container.select('.data-object-content-container')
            .style('display', d => d.showContent ? 'block' : 'none');

        if (this.showContent && this.content) {
            contentContainer.select('.data-object-content')
                .html(this.mdConverter.makeHtml(this.content));
        }

    }

    setHighlight(spec) {
        this.highlight = typeof spec !== undefined && spec;

        if (this.headers) {
            this.headers.forEach(header => header.highlight
                = spec && spec.headers && spec.headers.includes(header.name));
        }
    }
}
