import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getDonors, addDonor, isEligibleToDonate, type Donor } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export default function DonorsPage() {
  const [donors, setDonors] = useState(getDonors);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return donors.filter(d => {
      const matchSearch = d.fullName.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase());
      const matchBlood = bloodFilter === "all" || d.bloodType === bloodFilter;
      return matchSearch && matchBlood;
    });
  }, [donors, search, bloodFilter]);

  const handleAddDonor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newDonor = addDonor({
      fullName: fd.get("fullName") as string,
      dateOfBirth: fd.get("dateOfBirth") as string,
      gender: fd.get("gender") as Donor["gender"],
      bloodType: fd.get("bloodType") as Donor["bloodType"],
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      address: fd.get("address") as string,
      emergencyContactName: fd.get("emergencyContactName") as string,
      emergencyContactPhone: fd.get("emergencyContactPhone") as string,
      emergencyContactRelationship: fd.get("emergencyContactRelationship") as string,
      donationCenter: fd.get("donationCenter") as string,
    });
    setDonors(prev => [...prev, newDonor]);
    setDialogOpen(false);
    toast({ title: "Donor registered", description: `${newDonor.fullName} has been added.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Donors</h1>
          <p className="text-muted-foreground">{donors.length} registered donors</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Register Donor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Register New Donor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDonor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-2"><Label>Full Name</Label><Input name="fullName" required /></div>
                <div className="space-y-2"><Label>Date of Birth</Label><Input name="dateOfBirth" type="date" required /></div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <select name="bloodType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                  </select>
                </div>
                <div className="space-y-2"><Label>Phone</Label><Input name="phone" required /></div>
                <div className="col-span-2 space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                <div className="col-span-2 space-y-2"><Label>Address</Label><Input name="address" required /></div>
                <div className="col-span-2 space-y-2"><Label>Donation Center</Label><Input name="donationCenter" required /></div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium mb-3">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Name</Label><Input name="emergencyContactName" required /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input name="emergencyContactPhone" required /></div>
                  <div className="col-span-2 space-y-2"><Label>Relationship</Label><Input name="emergencyContactRelationship" required /></div>
                </div>
              </div>
              <Button type="submit" className="w-full">Register Donor</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search donors..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={bloodFilter} onValueChange={setBloodFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {BLOOD_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Eligibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(donor => {
                const eligible = isEligibleToDonate(donor.id);
                return (
                  <TableRow key={donor.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => navigate(`/donors/${donor.id}`)}>
                    <TableCell className="font-medium">{donor.fullName}</TableCell>
                    <TableCell><Badge variant="outline">{donor.bloodType}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{donor.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{donor.donationCenter}</TableCell>
                    <TableCell>
                      {eligible ? (
                        <span className="flex items-center gap-1 text-success text-sm"><UserCheck className="h-3.5 w-3.5" />Eligible</span>
                      ) : (
                        <span className="flex items-center gap-1 text-warning text-sm"><UserX className="h-3.5 w-3.5" />Not yet</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
