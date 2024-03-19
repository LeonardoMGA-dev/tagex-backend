async function contextualizate({ openai, expenses }) {
    // get last 50 expenses and create a summary about people, places, and things
    const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `create a list about things and their relationship with their categories.
                The last 50 expenses are: ${expenses.slice(0, 50).map((expense) => expense.expense).join(", ")}.
                e.g, Lulu = girlfriend, Gabriel = friend, car = transport, fuel = car, etc.`
            }
        ],
        temperature: 0,
    });
    return result.choices[0].message.content;
}

module.exports = {
    contextualizate,
}