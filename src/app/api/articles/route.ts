import { NextResponse } from "next/server";
import { articleService } from "@/lib/firebase/services/articleService";

export async function POST(request: Request) {
  try {
    const { authorId } = await request.json();
    const articleId = await articleService.createArticle(authorId);

    return NextResponse.json({ articleId });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
