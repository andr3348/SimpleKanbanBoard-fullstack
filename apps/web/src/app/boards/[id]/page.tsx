import { BoardView } from "@/features/board/ui/BoardView";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BoardView boardId={id} />;
}
