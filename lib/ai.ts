import OpenAI from "openai";
const openai = new OpenAI();

const systemPrompt = `
    Users have been given the question "Should social media platforms censor political misinformation?".
    Your job is to classify the user's responses as "Support" or "Oppose".
    If the user is off-topic from the question asked, respond with just "Oppose".
    It is very important that you only respond with "Support" or "Oppose".
`

export const classifyResponseWithAi = async (userResponse: string) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: userResponse,
            },
        ],
    });
    const classification = completion.choices[0].message.content
    console.log('Ai classification: ', classification)
    return classification
}
