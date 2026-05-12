"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { BoardDetail } from "@/shared/types";

interface Props {
  board: BoardDetail;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function EditBoardCoverModal({ board, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    board.coverUrl ?? undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; thumbUrl: string; coverUrl: string }[]
  >([]);

  const update = useMutation({
    mutationFn: () => boardApi.update(board.id, { coverUrl: coverUrl ?? null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", board.id] });
      queryClient.invalidateQueries({ queryKey: ["boards"] });
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
          <DialogTitle>Edit board cover</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Cover image picker */}
          <div className="space-y-2">
            <Label>Search for cover image</Label>
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

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={update.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => update.mutate()}
              disabled={update.isPending}
            >
              {update.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
