var common = {
    toTransform: d => {
        return `translate(${d.transform.x}, ${d.transform.y}) rotate(${d.transform.r})`;
    }
}
