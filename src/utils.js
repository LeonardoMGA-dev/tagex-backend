function dotProduct(vector1, vector2) {
    return vector1.reduce((acc, value, index) => acc + value * vector2[index], 0);
}

function magnitude(vector) {
    return Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
}

function cosineSimilarity(vector1, vector2) {
    return dotProduct(vector1, vector2) / (magnitude(vector1) * magnitude(vector2));
}


module.exports = {
    cosineSimilarity,
}