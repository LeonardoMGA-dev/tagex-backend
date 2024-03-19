const expenses = [
    {
        "expense": "car fuel",
        "category": ["car", "transport"]
    },
    {
        "expense": "Dog food",
        "category": ["pets", "food"]
    },
    {
        "expense": "Pizza with friends",
        "category": ["friends", "food", "eating out"]
    },
]

function buildDataItem({
    categories,
    mostCommonExpenses,
    input,
    predictions,
}) {
    return {
        messages: [
            {
                "role": "user",
                "content": `categorize the expense to one or more categories, the categories are ${categories}. The expense to categorize is: ${input}. Consider the most common expenses for this case: ${mostCommonExpenses}`,
            },
            {
                "role": "assistant",
                "content": JSON.stringify(predictions),
            },
        ]
    }
}

function buildDataset() {
    const dataset = [
        buildDataItem({
            categories: ["car", "transport", "groceries", "food", "home", "entertainment", "pet", "housing",],
            expenses: [
                {
                    "expense": "fuel",
                    "category": ["car", "transport"]
                },
                {
                    "expense": "Dog food",
                    "category": ["pets", "food"]
                },
                {
                    "expense": "Pizza with friends",
                    "category": ["friends", "food", "eating out"]
                },
            ],
            input: "car fuel",
            predictions: ["car", "transport"]
        }),
    ]
    return dataset;
}