import { formatSalary } from "@/lib/utils";
import type { CostOfLiving } from "@/types/database";

interface SalaryDisplayProps {
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
  colData?: CostOfLiving[];
}

export function SalaryDisplay({
  salaryMin,
  salaryMax,
  currency = "USD",
  colData = [],
}: SalaryDisplayProps) {
  if (!salaryMin && !salaryMax) return null;

  const midSalary = salaryMin && salaryMax
    ? Math.round((salaryMin + salaryMax) / 2)
    : salaryMin || salaryMax || 0;
  const monthlySalary = Math.round(midSalary / 12);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Salary
        </h3>
        <p className="text-2xl font-bold text-accent">
          {salaryMin && salaryMax
            ? `${formatSalary(salaryMin)} – ${formatSalary(salaryMax)}`
            : salaryMin
            ? `From ${formatSalary(salaryMin)}`
            : `Up to ${formatSalary(salaryMax!)}`}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            /{currency === "USD" ? "yr" : `yr ${currency}`}
          </span>
        </p>
      </div>

      {colData.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            Your salary goes further in...
          </h4>
          <div className="space-y-2">
            {colData.slice(0, 5).map((city) => {
              const adjustedMonthly = Math.round(
                (monthlySalary / city.col_index) * 100
              );
              const savings = adjustedMonthly - city.avg_monthly_cost_usd;

              return (
                <div
                  key={`${city.city}-${city.country_code}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {city.city}, {city.country_code}
                  </span>
                  <span
                    className={
                      savings > 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    {savings > 0 ? "+" : ""}${Math.abs(savings).toLocaleString()}
                    /mo
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
