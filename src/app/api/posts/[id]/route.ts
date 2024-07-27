import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async (request: NextRequest, { params }: { params: { id: string } }, //ここでリクエストパラメータを受け取る
) => {
  //paramsの中にidが入っているので、それを取り出す
  const { id } = params
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      // カテゴリ含めて取得
      include: {
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
    })
    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}
