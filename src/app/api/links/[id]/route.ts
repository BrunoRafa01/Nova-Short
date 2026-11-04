import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.shortLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Link excluído com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar link:", err);
    return NextResponse.json({ error: "Erro ao excluir o link." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.shortLink.update({
      where: { id },
      data: {
        isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, link: updated });
  } catch (err) {
    console.error("Erro ao atualizar link:", err);
    return NextResponse.json({ error: "Erro ao atualizar o link." }, { status: 500 });
  }
}
