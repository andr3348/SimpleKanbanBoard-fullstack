"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi } from "../api/board.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff, Mail } from "lucide-react";
import type { BoardDetail } from "@/shared/types";

interface Props {
  board: BoardDetail;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ManageMembersModal({ board, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();

  const updateRole = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "admin" | "member";
    }) => boardApi.updateMemberRole(board.id, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", board.id] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage members</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          {board.members.map((member) => {
            const isOwner = member.userId === board.ownerId;
            const canManage =
              board.userRole === "owner" && !isOwner;

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                  {member.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.userName}
                    {isOwner && (
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        (owner)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="size-3" />
                    {member.userEmail}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {canManage && member.role === "member" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateRole.mutate({
                          userId: member.userId,
                          role: "admin",
                        })
                      }
                      disabled={updateRole.isPending}
                    >
                      <Shield className="size-3.5 mr-1.5" />
                      Make admin
                    </Button>
                  )}
                  {canManage && member.role === "admin" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateRole.mutate({
                          userId: member.userId,
                          role: "member",
                        })
                      }
                      disabled={updateRole.isPending}
                    >
                      <ShieldOff className="size-3.5 mr-1.5" />
                      Remove admin
                    </Button>
                  )}
                  {!canManage && (
                    <span className="text-xs font-medium text-muted-foreground capitalize px-2">
                      {member.role}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
