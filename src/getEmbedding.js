async function getEmbedding({ openai, input }) {
    const result = await openai.embeddings.create({
        input: input,
        model: "text-embedding-3-small",
    });
    return result.data[0].embedding;
}

module.exports = {
    getEmbedding,
}