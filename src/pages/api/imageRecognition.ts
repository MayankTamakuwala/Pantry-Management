import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
require("dotenv").config();

export const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { messages } = req.body;

    try{
		const response = await client.chat.completions.create({
			model: "gpt-4o",
			messages: messages
		});
		return res.status(200).json({data: response.choices[0].message.content})
    } catch(error){
		throw Error(error as string)
    }
}