import React from "react";
import Link from "next/link";
import { Gamepad2, SearchX, Inbox, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 my-6">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-glow">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold font-heading text-foreground mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && actionHref && (
        <Button asChild size="sm" className="shadow-glow">
          <Link href={actionHref}>
            {actionText}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      )}

      {actionText && onAction && !actionHref && (
        <Button onClick={onAction} size="sm" className="shadow-glow">
          {actionText}
        </Button>
      )}
    </div>
  );
}
