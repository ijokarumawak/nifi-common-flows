var arrow = {
    render: arrows => {
        var svg = d3.select('#diagram-svg')

        // Select existing ones
        var exContainer = svg
            .selectAll('.arrow')
            .data(arrows);

        // Create new ones
        var newContainer = exContainer.enter()
            .append('path')
            .attr('marker-end', 'url(#head)')
            .attr('stroke-width', '5')
            .attr('fill', 'none')
            .attr('stroke', '#AEBAA7')
            .attr('d', d => {
                // Starting point
                var x0 = d.targets[0].cx;
                var y0 = d.targets[0].cy;

                // Calculate angle
                var dx = d.targets[1].cx - x0;
                var dy = (d.targets[1].cy - y0);
                var a = dy / dx;

                // Destination point, move a bit for the head
                var y1 = d.targets[1].y - 8;
                var x1 = x0 + Math.round((y1 - y0) / a) - 8;

                console.log(a, dx, dy, x1, y1);

                return `M${x0},${y0} ${x1},${y1}`
            })
            .classed('arrow', true);
        
        // Remove deleted ones
        exContainer.exit().remove();
    }
}
