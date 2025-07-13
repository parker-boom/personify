import { formatCustomInstructions } from "../../backend/formatCustomInstructions.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { answers } = JSON.parse(event.body || "{}");

    if (!answers || !Array.isArray(answers)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid request body. Expected { answers: [...] }",
        }),
      };
    }

    // Format the data for OpenAI
    const formatted = await formatCustomInstructions(
      JSON.stringify({ answers })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(formatted),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("❌ Netlify function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process answers" }),
    };
  }
};
