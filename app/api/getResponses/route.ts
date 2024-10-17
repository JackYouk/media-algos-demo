import { NextRequest, NextResponse } from "next/server";
import responses from '@/data/responses.json';

export async function GET(req: NextRequest) {
    return NextResponse.json(
        { status: 400, responses },
    );
}