import { useState, useMemo } from "react";
import { getDonations, getDonors, addDonation, type Donation } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DonationsPage() {
  const [donations, setDonations] = useState(getDonations);
  const donors = getDonors();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const filtered = useMemo(() => {
    return donations.filter(d =>
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.center.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [donations, search]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const donorId = fd.get("donorId") as string;
    const donor = donors.find(d => d.id === donorId);
    if (!donor) return;
    const newDonation = addDonation({
      donorId,
      donorName: donor.fullName,
      date: fd.get("date") as string,
      type: fd.get("type") as Donation["type"],
      volume: parseInt(fd.get("volume") as string),
      center: fd.get("center") as string,
      collectedBy: user?.name || "Staff",
      bloodType: donor.bloodType,
    });
    setDonations(prev => [...prev, newDonation]);
    setDialogOpen(false);
    toast({ title: "Donation recorded", description: `Donation from ${donor.fullName} recorded.` });
  };

  const typeLabel = (t: string) => t.replace("_", " ");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Donations</h1>
          <p className="text-muted-foreground">{donations.length} total donations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Record Donation</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Record New Donation</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Donor</Label>
                <select name="donorId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                  <option value="">Select donor</option>
                  {donors.map(d => <option key={d.id} value={d.id}>{d.fullName} ({d.bloodType})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" required /></div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="whole_blood">Whole Blood</option>
                    <option value="plasma">Plasma</option>
                    <option value="platelets">Platelets</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Volume (ml)</Label><Input name="volume" type="number" defaultValue={450} required /></div>
                <div className="space-y-2"><Label>Center</Label><Input name="center" required /></div>
              </div>
              <Button type="submit" className="w-full">Record Donation</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search donations..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.donorName}</TableCell>
                  <TableCell className="capitalize">{typeLabel(d.type)}</TableCell>
                  <TableCell><Badge variant="outline">{d.bloodType}</Badge></TableCell>
                  <TableCell>{d.volume}ml</TableCell>
                  <TableCell className="text-muted-foreground">{d.center}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(d.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
