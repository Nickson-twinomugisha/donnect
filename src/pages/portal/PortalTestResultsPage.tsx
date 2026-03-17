import { useQuery } from "@tanstack/react-query";
import { useDonorAuth } from "@/contexts/DonorAuthContext";
import { getDonorTestResults } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FlaskConical } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pass: "bg-emerald-500/15 text-emerald-400 border-0",
  fail: "bg-destructive/15 text-destructive border-0",
  pending: "bg-amber-500/15 text-amber-400 border-0",
};

const SCREENS = [
  { key: "hiv", label: "HIV" },
  { key: "hepatitisB", label: "Hepatitis B" },
  { key: "hepatitisC", label: "Hepatitis C" },
  { key: "syphilis", label: "Syphilis" },
  { key: "bloodTypingConfirmation", label: "Blood Typing" },
] as const;

export default function PortalTestResultsPage() {
  const { donor } = useDonorAuth();
  if (!donor) return null;

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["portal_results", donor.id],
    queryFn: () => getDonorTestResults(donor.id),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Screening Test Results</h1>
        <p className="text-muted-foreground text-sm mt-1">{results.length} test records on file</p>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No test results on file yet.
          </CardContent>
        </Card>
      ) : (
        results.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-display flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                {new Date(r.date).toLocaleDateString("en-US", { dateStyle: "long" })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SCREENS.map(({ key, label }) => (
                  <div key={key} className="bg-secondary/50 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <Badge className={STATUS_STYLES[r[key]] || ""}>
                      {r[key].charAt(0).toUpperCase() + r[key].slice(1)}
                    </Badge>
                  </div>
                ))}
                {r.hemoglobin && (
                  <div className="bg-secondary/50 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Hemoglobin</span>
                    <span className="text-sm font-medium">{r.hemoglobin} g/dL</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
