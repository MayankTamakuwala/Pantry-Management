import { NextApiRequest, NextApiResponse } from "next";
require("dotenv").config();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { items } = req.body;

	try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": `https://pantrymanagement.vercel.app/`,
                "X-Title": `https://pantrymanagement.vercel.app/`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.1-8b-instruct:free",
                "messages": [
                    { "role": "system", "content": "You are a world class chef with the best culinary practices. I will give you the list of all the ingredients and it's quantity I have in my pantry and I want you to only return a delicious recipe made out of these items." },
                    { "role": "user", "content": items },
                ],
            })
        }).then(res => res.json());
		return res.status(200).json({ data: response.choices[0].message.content });
	} catch (error) {
		throw Error(error as string);
	}
}
