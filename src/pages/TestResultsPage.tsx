import { useState, useMemo } from "react";
import { getTestResults, getDonations, getDonors, addTestResult, type TestResult } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function StatusBadge({ status }: { status: string }) {
  if (status === "pass") return <Badge className="bg-success/20 text-success border-0 text-xs">Pass</Badge>;
  if (status === "fail") return <Badge className="bg-destructive/20 text-destructive border-0 text-xs">Fail</Badge>;
  return <Badge className="bg-warning/20 text-warning border-0 text-xs">Pending</Badge>;
}

type TestStatus = "pass" | "fail" | "pending";

export default function TestResultsPage() {
  const [results, setResults] = useState(getTestResults);
  const donations = getDonations();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return results.filter(t =>
      t.donorName.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [results, search]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const donationId = fd.get("donationId") as string;
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;
    const newResult = addTestResult({
      donationId,
      donorId: donation.donorId,
      donorName: donation.donorName,
      date: fd.get("date") as string,
      hiv: fd.get("hiv") as TestStatus,
      hepatitisB: fd.get("hepatitisB") as TestStatus,
      hepatitisC: fd.get("hepatitisC") as TestStatus,
      syphilis: fd.get("syphilis") as TestStatus,
      bloodTypingConfirmation: fd.get("bloodTyping") as TestStatus,
      hemoglobin: fd.get("hemoglobin") ? parseFloat(fd.get("hemoglobin") as string) : null,
    });
    setResults(prev => [...prev, newResult]);
    setDialogOpen(false);
    toast({ title: "Test results recorded" });
  };

  const statusSelect = (name: string, label: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select name={name} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
        <option value="pending">Pending</option><option value="pass">Pass</option><option value="fail">Fail</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Test Results</h1>
          <p className="text-muted-foreground">{results.length} test records</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Record Results</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-display">Record Test Results</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Donation</Label>
                <select name="donationId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                  <option value="">Select donation</option>
                  {donations.map(d => <option key={d.id} value={d.id}>{d.donorName} — {new Date(d.date).toLocaleDateString()}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" required /></div>
              <div className="grid grid-cols-2 gap-3">
                {statusSelect("hiv", "HIV")}
                {statusSelect("hepatitisB", "Hepatitis B")}
                {statusSelect("hepatitisC", "Hepatitis C")}
                {statusSelect("syphilis", "Syphilis")}
                {statusSelect("bloodTyping", "Blood Typing")}
                <div className="space-y-2"><Label>Hemoglobin (g/dL)</Label><Input name="hemoglobin" type="number" step="0.1" /></div>
              </div>
              <Button type="submit" className="w-full">Record Results</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by donor..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>HIV</TableHead>
                <TableHead>Hep B</TableHead>
                <TableHead>Hep C</TableHead>
                <TableHead>Syphilis</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Hb</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.donorName}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={t.hiv} /></TableCell>
                  <TableCell><StatusBadge status={t.hepatitisB} /></TableCell>
                  <TableCell><StatusBadge status={t.hepatitisC} /></TableCell>
                  <TableCell><StatusBadge status={t.syphilis} /></TableCell>
                  <TableCell><StatusBadge status={t.bloodTypingConfirmation} /></TableCell>
                  <TableCell className="text-muted-foreground">{t.hemoglobin ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
