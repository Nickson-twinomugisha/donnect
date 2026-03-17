import { useQuery } from "@tanstack/react-query";
import { useDonorAuth } from "@/contexts/DonorAuthContext";
import { getDonorDonations } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  whole_blood: "Whole Blood",
  plasma: "Plasma",
  platelets: "Platelets",
};

export default function PortalDonationsPage() {
  const { donor } = useDonorAuth();
  if (!donor) return null;

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ["portal_donations", donor.id],
    queryFn: () => getDonorDonations(donor.id),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">My Donations</h1>
        <p className="text-muted-foreground text-sm mt-1">{donations.length} total donations on record</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            Donation History
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 my-2 rounded-lg" />)
          ) : donations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No donation records found.</p>
          ) : (
            donations.map((d) => (
              <div key={d.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Droplets className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{TYPE_LABEL[d.type] ?? d.type}</p>
                    <p className="text-xs text-muted-foreground">{d.center} • Collected by {d.collectedBy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(d.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</p>
                  <div className="flex items-center justify-end gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">{d.bloodType}</Badge>
                    <span className="text-xs text-muted-foreground">{d.volume}ml</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
