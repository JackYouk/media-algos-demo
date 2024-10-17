import { NextRequest, NextResponse } from "next/server";
// import Sentiment from "sentiment";
import { sql } from '@vercel/postgres';
import { classifyResponseWithAi } from "@/lib/ai";

// const sentiment = new Sentiment();
const BIAS_PREFERENCE = "yes";

export async function POST(req: NextRequest) {
  try {
    const { responseText } = await req.json();
    console.log(responseText)
    if (!responseText || typeof responseText !== "string") {
      return NextResponse.json(
        { status: 400, message: "Invalid response text." },
      );
    }

    // LEGACY SENTIMENT ANALYSIS (DOESNT WORK WITH COMPLEX QUESTIONS)
    // const sentimentResult = sentiment.analyze(responseText);
    // const sentimentScore = sentimentResult.score;
    // console.log('sentiment score: ', sentimentScore)

    const responseClassification = await classifyResponseWithAi(responseText)

    let bias: boolean;

    // LEGACY SENTIMENT ANALYSIS (DOESNT WORK WITH COMPLEX QUESTIONS)
    // if (BIAS_PREFERENCE.toLowerCase() === "yes") {
    //   bias = sentimentScore > 0;
    // } else if (BIAS_PREFERENCE.toLowerCase() === "no") {
    //   bias = sentimentScore <= 0;
    // } else {
    //   bias = false;
    // }

    if (BIAS_PREFERENCE.toLowerCase() === "yes") {
      bias = responseClassification === "Support";
    } else if (BIAS_PREFERENCE.toLowerCase() === "no") {
      bias = responseClassification === "Oppose";
    } else {
      bias = false;
    }

    const timestamp = new Date().toISOString();
    await sql`INSERT INTO Responses (text, bias, timestamp) VALUES (${responseText}, ${bias}, ${timestamp}); `;

    return NextResponse.json(
      { status: 201, message: "Response recorded successfully." },
    );

  } catch (error) {
    console.error("Error processing response:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error." },
    );
  }
}