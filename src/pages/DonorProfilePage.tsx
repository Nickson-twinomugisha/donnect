import { useParams, useNavigate } from "react-router-dom";
import { getDonor, getDonationsByDonor, getTestResultsByDonor, getMedicalNotesByDonor, isEligibleToDonate, getLastDonationDate, addMedicalNote } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Phone, Mail, MapPin, UserCheck, UserX, Heart, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

function StatusBadge({ status }: { status: string }) {
  if (status === "pass") return <Badge className="bg-success/20 text-success border-0">Pass</Badge>;
  if (status === "fail") return <Badge className="bg-destructive/20 text-destructive border-0">Fail</Badge>;
  return <Badge className="bg-warning/20 text-warning border-0">Pending</Badge>;
}

export default function DonorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const donor = getDonor(id || "");
  const { user } = useAuth();
  const { toast } = useToast();
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState(() => getMedicalNotesByDonor(id || ""));

  if (!donor) return <div className="p-8 text-center text-muted-foreground">Donor not found</div>;

  const donations = getDonationsByDonor(donor.id);
  const tests = getTestResultsByDonor(donor.id);
  const eligible = isEligibleToDonate(donor.id);
  const lastDonation = getLastDonationDate(donor.id);

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    const note = addMedicalNote({ donorId: donor.id, author: user?.name || "Staff", date: new Date().toISOString().split("T")[0], content: noteContent });
    setNotes(prev => [...prev, note]);
    setNoteContent("");
    toast({ title: "Note added" });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/donors")} className="mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />Back to Donors
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donor Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary font-display">
                {donor.fullName.charAt(0)}
              </div>
              <div>
                <CardTitle className="font-display">{donor.fullName}</CardTitle>
                <Badge variant="outline" className="mt-1">{donor.bloodType}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{donor.phone}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{donor.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{donor.address}</div>
            <div className="border-t border-border pt-3 mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">DOB</p>
              <p>{new Date(donor.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Gender</p>
              <p className="capitalize">{donor.gender}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Emergency Contact</p>
              <p>{donor.emergencyContactName} ({donor.emergencyContactRelationship})</p>
              <p className="text-muted-foreground">{donor.emergencyContactPhone}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Eligibility</p>
              {eligible ? (
                <span className="flex items-center gap-1 text-success"><UserCheck className="h-4 w-4" />Eligible to donate</span>
              ) : (
                <span className="flex items-center gap-1 text-warning"><UserX className="h-4 w-4" />Not eligible yet</span>
              )}
              {lastDonation && <p className="text-xs text-muted-foreground mt-1">Last donation: {new Date(lastDonation).toLocaleDateString()}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Donations & Tests & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donations */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><Heart className="h-5 w-5 text-primary" />Donation History</CardTitle></CardHeader>
            <CardContent>
              {donations.length === 0 ? <p className="text-muted-foreground text-sm">No donations yet.</p> : (
                <div className="space-y-3">
                  {donations.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-sm font-medium capitalize">{d.type.replace("_", " ")}</p>
                        <p className="text-xs text-muted-foreground">{d.center} • {d.volume}ml • by {d.collectedBy}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{new Date(d.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" />Test Results</CardTitle></CardHeader>
            <CardContent>
              {tests.length === 0 ? <p className="text-muted-foreground text-sm">No test results.</p> : (
                <div className="space-y-3">
                  {tests.map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{new Date(t.date).toLocaleDateString()}</span>
                        {t.hemoglobin && <span className="text-xs text-muted-foreground">Hb: {t.hemoglobin} g/dL</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs">HIV: <StatusBadge status={t.hiv} /></span>
                        <span className="text-xs">Hep B: <StatusBadge status={t.hepatitisB} /></span>
                        <span className="text-xs">Hep C: <StatusBadge status={t.hepatitisC} /></span>
                        <span className="text-xs">Syphilis: <StatusBadge status={t.syphilis} /></span>
                        <span className="text-xs">Blood Type: <StatusBadge status={t.bloodTypingConfirmation} /></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Notes */}
          <Card>
            <CardHeader><CardTitle className="font-display text-lg">Medical Notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea placeholder="Add a medical note..." value={noteContent} onChange={e => setNoteContent(e.target.value)} className="min-h-[60px]" />
                <Button onClick={handleAddNote} className="self-end">Add</Button>
              </div>
              {notes.length === 0 ? <p className="text-muted-foreground text-sm">No notes yet.</p> : (
                <div className="space-y-3">
                  {[...notes].reverse().map(n => (
                    <div key={n.id} className="p-3 rounded-lg bg-secondary/30 border-l-2 border-primary">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{n.author}</span>
                        <span className="text-xs text-muted-foreground">{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
