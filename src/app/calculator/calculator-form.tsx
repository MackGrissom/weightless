"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  Trophy,
  Wifi,
  Shield,
  DollarSign,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { CostOfLiving } from "@/types/database";

interface CalculatorFormProps {
  data: CostOfLiving[];
}

interface RankedCity extends CostOfLiving {
  adjustedSalary: number;
  rank: number;
}

function formatCurrency(amount: number): string {
  return "$" + Math.round(amount).toLocaleString("en-US");
}

const FREE_LIMIT = 5;

export function CalculatorForm({ data }: CalculatorFormProps) {
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("calculator_unlocked");
    if (stored === "true") {
      setUnlocked(true);
    }
  }, []);

  const rankedCities: RankedCity[] = useMemo(() => {
    const salaryNum = parseFloat(salary);
    if (!salaryNum || salaryNum <= 0) return [];

    return data
      .map((city) => ({
        ...city,
        adjustedSalary: salaryNum * (100 / city.col_index),
        rank: 0,
      }))
      .sort((a, b) => b.adjustedSalary - a.adjustedSalary)
      .map((city, i) => ({ ...city, rank: i + 1 }));
  }, [salary, data]);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!salary) return;
    setHasSubmitted(true);
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setEmailStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const resData = await res.json();

      if (res.ok) {
        setEmailStatus("success");
        setEmailMessage("Unlocked! Showing all cities.");
        setUnlocked(true);
        localStorage.setItem("calculator_unlocked", "true");
      } else {
        setEmailStatus("error");
        setEmailMessage(resData.error || "Something went wrong. Try again.");
      }
    } catch {
      setEmailStatus("error");
      setEmailMessage("Something went wrong. Try again.");
    }
  }

  const visibleCities = unlocked
    ? rankedCities
    : rankedCities.slice(0, FREE_LIMIT);
  const lockedCities = unlocked ? [] : rankedCities.slice(FREE_LIMIT);

  return (
    <div>
      {/* Salary input */}
      <form
        onSubmit={handleCalculate}
        className="mx-auto max-w-md flex gap-3 mb-12"
      >
        <div className="relative flex-1">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Annual salary (USD)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="h-12 pl-9"
            min={1}
            required
          />
        </div>
        <Button type="submit" size="lg">
          Calculate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      {/* Results */}
      {hasSubmitted && rankedCities.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-6">
            Showing purchasing power for a{" "}
            <span className="text-foreground font-medium">
              {formatCurrency(parseFloat(salary))}
            </span>{" "}
            salary across {rankedCities.length} cities
          </p>

          {/* Visible cities */}
          <div className="grid gap-4">
            {visibleCities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                originalSalary={parseFloat(salary)}
              />
            ))}
          </div>

          {/* Locked section */}
          {!unlocked && lockedCities.length > 0 && (
            <div className="relative mt-8">
              {/* Blurred preview */}
              <div className="grid gap-4 pointer-events-none select-none">
                {lockedCities.slice(0, 3).map((city) => (
                  <div key={city.id} className="blur-[6px] opacity-50">
                    <CityCard
                      city={city}
                      originalSalary={parseFloat(salary)}
                    />
                  </div>
                ))}
              </div>

              {/* Unlock overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Card className="w-full max-w-md border-accent/30 bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mx-auto mb-4">
                      <Lock className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Unlock all {rankedCities.length} cities
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Enter your email to see the full report with all cities
                      ranked by purchasing power.
                    </p>

                    <form onSubmit={handleUnlock} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10"
                        required
                        disabled={
                          emailStatus === "loading" ||
                          emailStatus === "success"
                        }
                      />
                      <Button
                        type="submit"
                        disabled={
                          emailStatus === "loading" ||
                          emailStatus === "success"
                        }
                      >
                        {emailStatus === "loading" ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                        ) : (
                          "Get full report"
                        )}
                      </Button>
                    </form>

                    {emailStatus === "success" && (
                      <p className="mt-3 text-sm text-green-400 flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        {emailMessage}
                      </p>
                    )}
                    {emailStatus === "error" && (
                      <p className="mt-3 text-sm text-red-400 flex items-center justify-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {emailMessage}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {hasSubmitted && rankedCities.length === 0 && (
        <p className="text-center text-muted-foreground">
          No city data available. Please try again later.
        </p>
      )}
    </div>
  );
}

function CityCard({
  city,
  originalSalary,
}: {
  city: RankedCity;
  originalSalary: number;
}) {
  const isTop = city.rank === 1;
  const gain = city.adjustedSalary - originalSalary;
  const gainPercent = ((gain / originalSalary) * 100).toFixed(0);

  return (
    <Card
      className={
        isTop
          ? "border-accent ring-2 ring-accent/20"
          : ""
      }
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: rank + city info */}
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                isTop
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isTop ? (
                <Trophy className="h-4 w-4" />
              ) : (
                `#${city.rank}`
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {city.city}
                <span className="text-muted-foreground font-normal ml-2 text-sm">
                  {city.country}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {formatCurrency(city.avg_monthly_cost_usd)}/mo avg cost
              </p>
            </div>
          </div>

          {/* Right: adjusted salary */}
          <div className="text-right shrink-0">
            <p
              className={`text-lg font-bold ${
                isTop ? "text-accent" : "text-foreground"
              }`}
            >
              {formatCurrency(city.adjustedSalary)}
            </p>
            <p
              className={`text-xs ${
                gain >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {gain >= 0 ? "+" : ""}
              {gainPercent}% purchasing power
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          {city.nomad_score != null && (
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Nomad: {city.nomad_score.toFixed(1)}
            </span>
          )}
          {city.internet_speed_mbps != null && (
            <span className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              {Math.round(city.internet_speed_mbps)} Mbps
            </span>
          )}
          {city.safety_index != null && (
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Safety: {city.safety_index.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            COL Index: {city.col_index}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
