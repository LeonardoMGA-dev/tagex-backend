const { getEmbedding } = require("./getEmbedding");
const { cosineSimilarity } = require("./utils");

function formatCategories() {
    // create a openai function to convert the predictions to a array of strings
    return {
        name: "formatCategories",
        description: "Convert the input to an array of strings",
        parameters: {
            type: "object",
            properties: {
                categories: {
                    type: "array",
                    description: "the categories of the expense, for example: [\"food\", \"eating out\"]",
                    items: {
                        type: "string",
                    }
                },
            },
            required: ["categories"],
        },
    }
}

function convertExpenseToString(expense) {
    return `${expense.expense}= ${expense.category.join(", ")}`
}

async function buildMessageList({ openai, inputText, categories, expenses }) {
    const inputEmbedding = await getEmbedding({ openai, input: inputText });
    let previousExpenses = [];
    // use a for loop to avoid the async/await issue
    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        const categoryEmbedding = await getEmbedding({ openai, input: expense.expense });
        const similarity = cosineSimilarity(categoryEmbedding, inputEmbedding);
        if (similarity > 0.5) {
            let similarExpense = {
                expense: expense.expense,
                category: expense.category,
            };
            previousExpenses.push(similarExpense);
        }
    }
    previousExpenses = previousExpenses.map(convertExpenseToString).slice(0, 5);
    const content = `Categorize the expense to one or more categories.\nThe categories are ${categories}.\nThe expense to categorize is: ${inputText}.\nConsider the previous expenses that are similar: ${previousExpenses.join(". ")}`;

    return [
        { role: "user", content: content },
    ];
}

async function predictCategories({ openai, inputText, categories, expenses }) {

    try {

        const messages = await buildMessageList({ openai, inputText, categories, expenses });

        const completion = await openai.chat.completions.create({
            // include the previous expenses
            messages: messages,
            functions: [formatCategories()],
            function_call: {
                name: "formatCategories",
            },
            model: "ft:gpt-3.5-turbo-0125:personal::93g6UE2v",
        });

        console.log("completion", completion.choices[0].message.function_call.arguments);

        // print the response pretty
        const arguments = completion.choices[0].message.function_call.arguments;
        // convert the response to a JSON object
        const predictions = JSON.parse(arguments).categories;
        // filter the predictions to only the categories that are in the list
        const filteredPredictions = predictions.filter((prediction) => categories.includes(prediction));
        return filteredPredictions;
    } catch (error) {
        console.log("error", error);
        return [];
    }
}

module.exports = {
    predictCategories,
    buildMessageList,
}