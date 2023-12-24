import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";


export async function GET() {
    const surveys = await db.survey.findMany({});
    
    return NextResponse.json(surveys);
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const createdSurvey = await db.survey.create({
        data: body
    })
    return NextResponse.json(createdSurvey)
}