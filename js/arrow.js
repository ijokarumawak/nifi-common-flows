let TWO_PI = 2 * Math.PI;



class Arrow extends SVGRenderable {
    constructor(id, from, to) {
        super(id);
        this.from = from;
        this.to = to;
    }

    toId() {
        return `arrow_${this.id}`;
    }

    createStroke(d) {
        var b0 = d.from.bbox();
        var b1 = d.to.bbox();

        // Starting point
        var x0 = b0.cx;
        var y0 = b0.cy;

        // Distination point
        var p2 = this.getPerimeterPoint({x: x0, y: y0}, b1);

        return `M${x0},${y0} ${p2.x},${p2.y}`
    }

    setupContainer(container) {
        container.append('path')
            .attr('marker-end', 'url(#head)')
            .attr('stroke-width', '5')
            .attr('fill', 'none')
            .attr('stroke', '#AEBAA7')
            .attr('d', d => this.createStroke(d))
            .classed('arrow', true);
    }

    renderContainer(container) {

        container.select('path')
            .datum(this)
            .attr('d', d => this.createStroke(d));
    }
}
