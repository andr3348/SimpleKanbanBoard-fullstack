"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { boardApi, unsplashApi } from "../api/board.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateBoardModal({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [coverUrl, setCoverUrl] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; thumbUrl: string; coverUrl: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const create = useMutation({
    mutationFn: (data: FormData) => boardApi.create({ ...data, coverUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      reset();
      setCoverUrl(undefined);
      setSearchResults([]);
      onOpenChange(false);
    },
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const results = await unsplashApi.search(searchQuery);
    setSearchResults(results);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => create.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label>Title</Label>
            <Input {...register("title")} placeholder="e.g. Website redesign" />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Description (optional)</Label>
            <Input
              {...register("description")}
              placeholder="What's this board about?"
            />
          </div>

          {/* Cover image picker */}
          <div className="space-y-2">
            <Label>Cover image</Label>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Unsplash..."
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleSearch())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-4 gap-1">
                {searchResults.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setCoverUrl(photo.coverUrl)}
                    className={`relative h-12 rounded overflow-hidden border-2 transition-all ${
                      coverUrl === photo.coverUrl
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={photo.thumbUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {coverUrl && (
              <div className="relative h-20 rounded overflow-hidden">
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverUrl(undefined)}
                  className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? "Creating..." : "Create board"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
