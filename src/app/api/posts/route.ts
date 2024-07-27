import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリ含めて取得
        postCategories: {
          include: {
            category: {
              //　カテゴリのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      //作成日時の降順で取得
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })
    console.log(posts)

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}
