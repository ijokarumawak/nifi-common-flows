class Arrow extends SVGRenderable {
    constructor(id, from, to) {
        super(id);
        this.from = from;
        this.to = to;            
    }

    toId() {
        return `arrow_${this.id}`;
    }

    setupContainer(container) {
        container.append('path')
        .attr('marker-end', 'url(#head)')
        .attr('stroke-width', '5')
        .attr('fill', 'none')
        .attr('stroke', '#AEBAA7')
        .attr('d', d => {
            var b0 = d.from.bbox();
            var b1 = d.to.bbox();

            // Starting point
            var x0 = b0.cx;
            var y0 = b0.cy;

            // Calculate angle
            var dx = b1.cx - x0;
            var dy = (b1.cy - y0);
            var a = dy / dx;

            // Destination point, move a bit for the head
            var y1 = b1.y - 10;
            var x1 = x0 + Math.round((y1 - y0) / a);

            return `M${x0},${y0} ${x1},${y1}`
        })
        .classed('arrow', true);        
    }    
}
