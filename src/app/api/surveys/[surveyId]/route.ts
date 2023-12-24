import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type ApiRequestContext = {
    params: {
        surveyId: string
    }
}

export async function GET(request: NextRequest, {params: {surveyId}}: ApiRequestContext) {
    try {
        const survey = await db.survey.findUniqueOrThrow({
            where: {
                id: surveyId
            }
        })
        return NextResponse.json(survey);
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