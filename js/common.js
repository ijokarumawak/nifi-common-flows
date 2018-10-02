var common = {
    toTransform: d => {
        return `translate(${d.transform.x}, ${d.transform.y}) rotate(${d.transform.r})`;
    },

    bbox: (d) => {
        var container = document.getElementById(d.toId());
        var style = window.getComputedStyle(container);
        var height = container.scrollHeight
            + Number.parseInt(style.borderTopWidth)
            + Number.parseInt(style.borderBottomWidth);
        var width = container.scrollWidth
            + Number.parseInt(style.borderLeftWidth)
            + Number.parseInt(style.borderRightWidth);
        var box = {
                x: d.position.x,
                y: d.position.y,
                h: height,
                w: width,
                cx: d.position.x + (width / 2),
                cy: d.position.y + (height / 2)
            }
        return box;
    }
}
