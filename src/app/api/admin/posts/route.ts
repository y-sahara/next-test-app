import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/utils/supabase';

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {

  //送ったtokenが正しくない場合、errorが返却されるのでクライエントにエラーを返す。
  const { error } = await getCurrentUser(request);
  
  if (error)
    return NextResponse.json({ status: 'Unauthorized' }, { status: 400 });

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
    });

    await prisma.$disconnect();

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

export const POST = async (request: NextRequest, context: any) => {
  const { currentUser, error } = await getCurrentUser(request);

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    //リクエストのbodyを作成
    const body = await request.json();

    const { title, content, categories, thumbnailUrl } = body;

    //投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    //記事とカテゴリーの中間テーブルのレコードをDBに生成
    //　sqliteでcreateManyメソッドが使えないため、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }

    //レスポンス
    return NextResponse.json({
      status: 'ok',
      message: '作成しました',
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
