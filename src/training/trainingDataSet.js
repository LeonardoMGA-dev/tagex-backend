const { default: OpenAI } = require("openai")
const { buildMessageList } = require("../predictCategories")
require("dotenv").config();

function buildExpenses({ girlfriendName, friendName, petName, transportType, entertainmentType }) {
    return [
        {
            "expense": "Sushi with " + girlfriendName,
            "category": ["girlfriend", "food", "eating out"],
        },
        {
            "expense": "Dinner with " + girlfriendName,
            "category": ["girlfriend", "food", "eating out"],
        },
        {
            "expense": "Pizza with " + friendName,
            "category": ["friends", "food", "eating out"],
        },
        {
            "expense": "Beer with " + friendName,
            "category": ["friends", "food", "eating out"],
        },
        {
            "expense": "fuel",
            "category": [transportType, "transport"],
        },
        {
            "expense": "fuel",
            "category": [transportType, "transport"],
        },
        {
            "expense": "fuel",
            "category": [transportType, "transport"],
        },
        {
            "expense": petName + " food",
            "category": ["pets", "food"],
        },
        {
            "expense": "rent",
            "category": ["housing"],
        },
        {
            "expense": "Toilet paper",
            "category": ["groceries"],
        },
        {
            "expense": entertainmentType,
            "category": ["entertainment"],
        },
        {
            "expense": "Uber",
            "category": ["transport"],
        },
        {
            "expense": "Savings",
            "category": ["savings"],
        },
        {
            "expense": "Investments",
            "category": ["investments"],
        },
        {
            "expense": "Sushi with " + girlfriendName,
            "category": ["other"],
        },
        {
            "expense": "Pizza with " + friendName,
            "category": ["eating out"],
        },
        {
            "expense": "fuel",
            "category": ["other"],
        },
        {
            "expense": petName + " toys",
            "category": ["pets"],
        },
        {
            "expense": "Cat food",
            "category": ["pets", "food"],
        }
    ]
}

function buildUseCases({ girlfriendName, friendName, petName, transportType, entertainmentType }) {
    return [
        {
            "input": "Sushi with " + girlfriendName,
            "predictions": ["girlfriend", "food", "eating out"],
            "availableCategories": [transportType, "transport", "groceries", "food", "home", "entertainment"],
        },
        {
            "input": "Pizza with " + friendName,
            "predictions": ["friends", "food", "eating out"],
            "availableCategories": [transportType, "transport", "food", "home", "friends", "eating out"],
        },
        {
            "input": "fuel",
            "predictions": [transportType, "transport"],
            "availableCategories": [transportType, "transport", "friends", "eating out"],
        },
        {
            "input": petName + " food",
            "predictions": ["pets", "food"],
            "availableCategories": ["pets", "food", "home", "entertainment"],
        },
        {
            "input": "rent",
            "predictions": ["housing", "home"],
            "availableCategories": ["housing", "home", "entertainment"],
        },
        {
            "input": "Toilet paper",
            "predictions": ["groceries"],
            "availableCategories": ["groceries", "home", "entertainment"],
        },
        {
            "input": entertainmentType,
            "predictions": ["entertainment"],
            "availableCategories": ["entertainment", "home"],
        },
        {
            "input": "Uber",
            "predictions": ["transport"],
            "availableCategories": [transportType, "transport", "groceries", "food", "home", "entertainment"],
        },
        {
            "input": "Savings",
            "predictions": ["savings"],
            "availableCategories": ["savings", "investments", "other"],
        },
        {
            "input": "Investments",
            "predictions": ["investments"],
            "availableCategories": ["savings", "investments", "other"],
        },
        {
            "input": "Sushi with " + girlfriendName,
            "predictions": ["other"],
            "availableCategories": ["other", "car", "transport"],
        },
        {
            "input": "Pizza with " + friendName,
            "predictions": ["eating out"],
            "availableCategories": ["eating out", "enterntainment", "other"],
        },
        {
            "input": "fuel",
            "predictions": ["other"],
            "availableCategories": ["other", "eating out", "friends"],
        },
        {
            "input": petName + " toys",
            "predictions": ["pets"],
            "availableCategories": ["pets", "food", "home", "entertainment"],
        },
        {
            "input": "Cat food",
            "predictions": ["pets", "food"],
            "availableCategories": ["pets", "food", "home", "entertainment"],
        }
    ]
}

async function buildDataset({ girlfriendName, friendName, petName, transportType, entertainmentType }) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY)
    const expenses = buildExpenses({ girlfriendName, friendName, petName, transportType, entertainmentType })
    const useCases = buildUseCases({ girlfriendName, friendName, petName, transportType, entertainmentType })
    const dataset = []
    for (let i = 0; i < useCases.length; i++) {
        const useCase = useCases[i]
        const input = useCase.input
        const availableCategories = useCase.availableCategories
        const messages = await buildMessageList({
            openai,
            inputText: input,
            categories: availableCategories,
            expenses: expenses
        })
        messages.push({ role: "assistant", content: JSON.stringify(useCase.predictions) })
        console.log("messages", messages)
        const dataItem = {
            messages: messages
        }
        dataset.push(dataItem)
    }
    return dataset
}

async function main() {
    console.log("Building dataset")
    const dataset1 = await buildDataset({
        girlfriendName: "Lulu",
        friendName: "John",
        petName: "Pocoyo",
        transportType: "car",
        entertainmentType: "Netflix"
    });
    const dataset2 = await buildDataset({
        girlfriendName: "Maria",
        friendName: "Gabriel",
        petName: "Luna",
        transportType: "Truck",
        entertainmentType: "Spotify"
    });
    const dataset3 = await buildDataset({
        girlfriendName: "Sofia",
        friendName: "Lucas",
        petName: "Coco",
        transportType: "Motorcycle",
        entertainmentType: "Youtube"
    });
    const dataset = dataset1.concat(dataset2).concat(dataset3)
    console.log(dataset)
    // convert the dataset to a JSONL format
    const fs = require("fs")
    const samplesJSONL = dataset.map((sample) => JSON.stringify(sample)).join("\n");
    fs.writeFileSync("samples.jsonl", samplesJSONL);
    console.log("Dataset built")

}

main()