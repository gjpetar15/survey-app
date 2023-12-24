import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type ApiRequestContext = {
    params: {
        surveyId: string
    }
}

export async function POST(request: NextRequest, {params: {surveyId}}: ApiRequestContext) {
    try {
        const body = await request.json()
        const createdQuestion = await db.question.create({
            data: {
                text: body.text,
                required: body.required,
                position: body.position,
                surveyId,
            }
        })

        return NextResponse.json(createdQuestion);
    }
    catch(e) {
        console.log(e)
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
                return NextResponse.json({
                message: 'Survey not found'
            },{
                status: 404
            })
            }
        }

        return NextResponse.json({
            message: 'Unknown error occured'
        },{
            status: 500
        })
    }
}


export async function GET(request: NextRequest, {params: {surveyId}}: ApiRequestContext) {
    try {
        const questionsForSurvey = await db.question.findMany({
            where: {
                surveyId
            }
        })

        return NextResponse.json(questionsForSurvey);
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
                return NextResponse.json({
                message: 'Survey not found'
            },{
                status: 404
            })
            }
        }

        return NextResponse.json({
            message: 'Unknown error occured'
        },{
            status: 500
        })
    }
}