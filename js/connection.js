class Connection extends RenderableContainer {

    constructor(id, name, pIn, pOut) {
        var arrow = new Arrow(id, pIn, pOut)
        arrow.visible = true;
        super(id, [arrow]);
        this.name = name;
        this.pIn = pIn;
        this.pOut = pOut;
        this.flowFiles = [];
        this.position = {x: 0, y: 0};
    }

    toId() {
        return `connection_${this.id}`;
    }

    isVisible() {
        return this.pIn.isVisible() && this.pOut.isVisible();
    }

    setupContainer(container) {
        container
            .classed('connection', true)
            .append('div')
            .classed('connection-name', true)
            .text(d => d.name);
    }

    renderContainer(container) {

        var b1 = this.pIn.bbox();
        var b2 = this.pOut.bbox();
        var b0 = this.bbox();
        var position = {
            x: ((b1.cx + b2.cx) / 2) - b0.cx,
            y: ((b1.cy + b2.cy) / 2) - b0.cy
        }

        container.transition()
            .style('left', `${position.x}px`)
            .style('top', `${position.y}px`);
    }

    addFlowFiles(...flowFiles) {
        var connectionId = this.toId();
        flowFiles.forEach(f => {
            f.queued = true;
            f.connectionId = connectionId;
        });
        this.flowFiles.concat(flowFiles);
    }
}
