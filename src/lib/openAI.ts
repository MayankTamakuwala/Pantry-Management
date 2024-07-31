import OpenAI from "openai";

export const client = new OpenAI({
	// apiKey: "sk-proj-jXsCVJEtz4lFog25j8chT3BlbkFJz8Gzzl91kGthbgJsCtTb",
	apiKey: "my-key",
	dangerouslyAllowBrowser: true,
});
