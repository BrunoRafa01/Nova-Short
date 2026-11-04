import { NextRequest, NextResponse } from "next/server";
import { getJobStatus } from "@/lib/queue/download-queue";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    const status = await getJobStatus(jobId);

    if (!status) {
      return NextResponse.json({ error: "Tarefa de download não encontrada." }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const downloadUrl = status.status === "completed" ? `${appUrl}/api/download/file/${jobId}` : null;

    return NextResponse.json({
      success: true,
      job: {
        id: status.id,
        status: status.status,
        progress: status.progress,
        downloadUrl,
        errorMessage: status.errorMessage,
        title: status.title,
        platform: status.platform,
        format: status.format,
        quality: status.quality,
      },
    });
  } catch (err) {
    console.error("Erro ao verificar status de download:", err);
    return NextResponse.json({ error: "Erro ao obter status da tarefa." }, { status: 500 });
  }
}
