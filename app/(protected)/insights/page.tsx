"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Target,
  Sparkles,
} from "lucide-react";

const SAMPLE_INSIGHTS = [
  {
    id: "1",
    type: "opportunity",
    priority: "high",
    title: "Package Services Underutilized",
    description:
      "Your package services generate only 15% of total revenue. Consider promoting them more aggressively or bundling with popular services.",
    icon: TrendingUp,
  },
  {
    id: "2",
    type: "alert",
    priority: "medium",
    title: "Low Stock Warning",
    description:
      "You have 3 products running low on inventory. Consider restocking within the next week to avoid shortages.",
    icon: AlertCircle,
  },
  {
    id: "3",
    type: "recommendation",
    priority: "high",
    title: "Peak Hours Optimization",
    description:
      "You have the most appointments between 2-5 PM on weekdays. Consider offering exclusive discounts during off-peak hours to balance demand.",
    icon: Target,
  },
  {
    id: "4",
    type: "insight",
    priority: "medium",
    title: "Customer Retention Rate",
    description:
      "Your repeat customer rate is 45%, which is above industry average. Focus on maintaining this momentum through loyalty programs.",
    icon: Lightbulb,
  },
];

type InsightType = "opportunity" | "alert" | "recommendation" | "insight";
type BadgeVariant = "success" | "warning" | "info" | "default" | "danger";

const typeColors: Record<
  InsightType,
  { bg: string; border: string; badge: BadgeVariant; iconColor: string }
> = {
  opportunity: {
    bg: "bg-info-light",
    border: "border-info/30",
    badge: "info",
    iconColor: "text-info",
  },
  alert: {
    bg: "bg-warning-light",
    border: "border-warning/30",
    badge: "warning",
    iconColor: "text-warning",
  },
  recommendation: {
    bg: "bg-purple-light",
    border: "border-purple/30",
    badge: "info",
    iconColor: "text-purple",
  },
  insight: {
    bg: "bg-success-light",
    border: "border-success/30",
    badge: "success",
    iconColor: "text-success",
  },
};

export default function InsightsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Business Insights
        </h1>
        <p className="text-foreground-secondary mt-1">
          AI-powered recommendations to grow your business
        </p>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {SAMPLE_INSIGHTS.map((insight) => {
          const Icon = insight.icon;
          const colors = typeColors[insight.type as InsightType];
          const priorityBadge: BadgeVariant =
            insight.priority === "high" ? "danger" : "warning";

          return (
            <Card
              key={insight.id}
              className={`${colors.bg} border-2 ${colors.border}`}
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex gap-3 md:gap-4">
                  <div className={`p-2 rounded-xl bg-card shrink-0 self-start`}>
                    <Icon
                      className={`w-5 h-5 md:w-6 md:h-6 ${colors.iconColor}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-foreground">
                        {insight.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <Badge
                          variant={colors.badge}
                          size="sm"
                          className="capitalize"
                        >
                          {insight.type}
                        </Badge>
                        <Badge
                          variant={priorityBadge}
                          size="sm"
                          className="capitalize"
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-foreground-secondary leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-light rounded-xl shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              These insights are AI-generated recommendations based on your
              business data. After connecting to Supabase, we&apos;ll provide
              real-time, data-driven insights for your specific business.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
