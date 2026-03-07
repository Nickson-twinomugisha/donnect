import { useState, useMemo } from "react";
import { getMedicalNotes, getDonors, addMedicalNote } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function MedicalNotesPage() {
  const [notes, setNotes] = useState(getMedicalNotes);
  const donors = getDonors();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const enrichedNotes = useMemo(() => {
    return notes.map(n => ({
      ...n,
      donorName: donors.find(d => d.id === n.donorId)?.fullName || "Unknown",
    })).filter(n =>
      n.donorName.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notes, donors, search]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newNote = addMedicalNote({
      donorId: fd.get("donorId") as string,
      author: user?.name || "Staff",
      date: new Date().toISOString().split("T")[0],
      content: fd.get("content") as string,
    });
    setNotes(prev => [...prev, newNote]);
    setDialogOpen(false);
    toast({ title: "Medical note added" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Medical Notes</h1>
          <p className="text-muted-foreground">{notes.length} notes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Note</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Add Medical Note</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Donor</Label>
                <select name="donorId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                  <option value="">Select donor</option>
                  {donors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea name="content" placeholder="Enter medical note..." required className="min-h-[100px]" />
              </div>
              <Button type="submit" className="w-full">Add Note</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {enrichedNotes.map(n => (
          <Card key={n.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{n.donorName}</span>
                  <span className="text-xs text-muted-foreground">• by {n.author}</span>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">{n.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
