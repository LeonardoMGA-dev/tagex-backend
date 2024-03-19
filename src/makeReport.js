async function makeReport({openai, expenses }) {
   const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are a financial assistant.",
            },
            {
                role: "user",
                content: "Give me suggestions about my unnecessary expenses:" + JSON.stringify(expenses.slice(0, 30)) + "use only plain text.",
            },
        ],
    });
    return completion.choices[0].message.content;
}

module.exports = {
    makeReport,
}