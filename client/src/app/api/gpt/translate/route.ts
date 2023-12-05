import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export const POST = async function handler(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const prompt: string = requestBody.prompt;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful translator. 
                        You will identify the language of text input to you
                        and translate it to English. If the input is English
                        Your response should simply be the input text.
                        Your response should only contain the translated text. `,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 150,
        });
        console.log(completion.choices[0]);
        return new NextResponse(JSON.stringify(completion.choices[0]));
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
};
