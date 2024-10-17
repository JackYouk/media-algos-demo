import { NextRequest, NextResponse } from "next/server";
// import Sentiment from "sentiment";
import fs from "fs-extra";
import path from "path";
import { classifyResponseWithAi } from "@/lib/ai";

// const sentiment = new Sentiment();
const responsesFilePath = path.join(process.cwd(), "data", "responses.json");
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

    const newResponse = {
      text: responseText,
      bias: bias,
      // sentimentScore: sentimentScore,
      timestamp: new Date().toISOString(),
    };

    let responses = [];
    if (await fs.pathExists(responsesFilePath)) {
      const fileData = await fs.readFile(responsesFilePath, "utf-8");
      responses = JSON.parse(fileData);
    }
    responses.push(newResponse);
    await fs.writeFile(responsesFilePath, JSON.stringify(responses, null, 2));

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