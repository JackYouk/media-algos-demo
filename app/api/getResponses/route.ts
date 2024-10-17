import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic"
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
    const { rows } = await sql`SELECT * FROM Responses;`;
    return NextResponse.json(
        { status: 400, responses: rows },
    );
}