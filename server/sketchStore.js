class SketchStore { // Abstract class
    saveStrokes() {}
    getStrokes() {}
}

class InMemorySketchStore extends SketchStore {
    constructor() {
        super();
        this.strokes = [];
    }

    saveStrokes(stroke) {
        this.strokes.push(stroke);
    }

    getStrokes() {
        return this.strokes;
    }
}

module.exports = {
    InMemorySketchStore,
};
