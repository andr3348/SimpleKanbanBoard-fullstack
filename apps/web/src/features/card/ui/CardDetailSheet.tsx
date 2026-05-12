"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { cardApi } from "../api/card.api";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { CardInBoard } from "@/shared/types";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  card: CardInBoard;
  columnId: string;
  boardId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CardDetailSheet({
  card,
  columnId,
  boardId,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: card.title, description: card.description ?? "" },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => cardApi.update(columnId, card.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      onOpenChange(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => cardApi.delete(columnId, card.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      onOpenChange(false);
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit card</SheetTitle>

          <form
            onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
            className="space-y-4 mt-6 pr-2"
          >
            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register("title")} />
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-ring"
                placeholder="Add a description..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!isDirty || updateMutation.isPending}
                className="flex-1"
              >
                Save changes
              </Button>
            </div>
          </form>
        </SheetHeader>

        <SheetFooter>
          <Separator className="my-6" />
          <div className="pr-2">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">
              Danger zone
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Delete this card?")) deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete card
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
