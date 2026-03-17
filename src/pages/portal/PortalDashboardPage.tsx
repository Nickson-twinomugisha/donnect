import { useQuery } from "@tanstack/react-query";
import { useDonorAuth } from "@/contexts/DonorAuthContext";
import { getDonorDonations, getDonorTestResults } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Droplets,
  FlaskConical,
  CalendarDays,
  Heart,
  CheckCircle2,
  Clock,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pass: "bg-emerald-500/15 text-emerald-400 border-0",
  fail: "bg-destructive/15 text-destructive border-0",
  pending: "bg-amber-500/15 text-amber-400 border-0",
};

export default function PortalDashboardPage() {
  const { donor } = useDonorAuth();
  if (!donor) return null;

  const { data: donations = [], isLoading: loadingDon } = useQuery({
    queryKey: ["portal_donations", donor.id],
    queryFn: () => getDonorDonations(donor.id),
  });

  const { data: results = [], isLoading: loadingRes } = useQuery({
    queryKey: ["portal_results", donor.id],
    queryFn: () => getDonorTestResults(donor.id),
  });

  const lastDonation = donations[0];
  const latestResult = results[0];
  const bloodOk =
    latestResult &&
    [latestResult.hiv, latestResult.hepatitisB, latestResult.hepatitisC, latestResult.syphilis].every(
      (s) => s === "pass"
    );

  const stats = [
    {
      label: "Total Donations",
      value: loadingDon ? "—" : donations.length,
      icon: Droplets,
      color: "text-primary",
    },
    {
      label: "Blood Type",
      value: donor.bloodType,
      icon: Heart,
      color: "text-rose-400",
    },
    {
      label: "Last Donated",
      value: lastDonation
        ? new Date(lastDonation.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Never",
      icon: CalendarDays,
      color: "text-sky-400",
    },
    {
      label: "Screen Status",
      value: loadingRes ? "—" : latestResult ? (bloodOk ? "All Clear" : "Review Needed") : "No results",
      icon: bloodOk ? CheckCircle2 : Clock,
      color: bloodOk ? "text-emerald-400" : "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6">
        <p className="text-sm text-primary font-medium mb-1">Welcome back</p>
        <h1 className="text-2xl font-display font-bold">{donor.fullName}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {donor.donationCenter} • {donor.email}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-md bg-secondary ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-xl font-display font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent donations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Droplets className="h-4 w-4 text-primary" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingDon
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)
              : donations.slice(0, 5).length === 0
              ? <p className="text-sm text-muted-foreground py-4 text-center">No donations yet.</p>
              : donations.slice(0, 5).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium capitalize">{d.type.replace("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">{d.center}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{new Date(d.date).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{d.volume}ml</p>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Latest test results */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Latest Screening Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRes ? (
              <Skeleton className="h-40 rounded-lg" />
            ) : !latestResult ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No test results yet.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(latestResult.date).toLocaleDateString("en-US", { dateStyle: "long" })}
                </p>
                {(
                  [
                    ["HIV", latestResult.hiv],
                    ["Hepatitis B", latestResult.hepatitisB],
                    ["Hepatitis C", latestResult.hepatitisC],
                    ["Syphilis", latestResult.syphilis],
                    ["Blood Typing", latestResult.bloodTypingConfirmation],
                  ] as [string, string][]
                ).map(([label, status]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <Badge className={STATUS_STYLES[status] || ""}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>
                ))}
                {latestResult.hemoglobin && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hemoglobin</span>
                    <span className="text-sm font-medium">{latestResult.hemoglobin} g/dL</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
