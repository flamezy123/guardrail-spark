import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Brain, Plus, BookOpen, Users, Settings, LogOut, Copy, Trash2, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  socratic_strictness: number;
  is_active: boolean;
  created_at: string;
}

interface CurriculumDoc {
  id: string;
  title: string;
  content: string;
  file_name: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [docs, setDocs] = useState<CurriculumDoc[]>([]);
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [newCourse, setNewCourse] = useState({ title: "", subject: "", description: "" });
  const [newDoc, setNewDoc] = useState({ title: "", content: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) fetchCourses();
  }, [user]);

  useEffect(() => {
    if (selectedCourse) fetchDocs(selectedCourse.id);
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (data) {
      setCourses(data);
      if (data.length > 0 && !selectedCourse) setSelectedCourse(data[0]);
      // Fetch session counts
      const counts: Record<string, number> = {};
      for (const course of data) {
        const { count } = await supabase.from("chat_sessions").select("*", { count: "exact", head: true }).eq("course_id", course.id);
        counts[course.id] = count || 0;
      }
      setSessionCounts(counts);
    }
  };

  const fetchDocs = async (courseId: string) => {
    const { data } = await supabase.from("curriculum_documents").select("*").eq("course_id", courseId).order("created_at", { ascending: false });
    if (data) setDocs(data);
  };

  const createCourse = async () => {
    if (!newCourse.title || !user) return;
    const { error } = await supabase.from("courses").insert({
      teacher_id: user.id, title: newCourse.title, subject: newCourse.subject, description: newCourse.description
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setNewCourse({ title: "", subject: "", description: "" });
    setCreateOpen(false);
    fetchCourses();
    toast({ title: "Course created!" });
  };

  const addDocument = async () => {
    if (!newDoc.title || !newDoc.content || !selectedCourse) return;
    const { error } = await supabase.from("curriculum_documents").insert({
      course_id: selectedCourse.id, title: newDoc.title, content: newDoc.content
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setNewDoc({ title: "", content: "" });
    setUploadOpen(false);
    fetchDocs(selectedCourse.id);
    toast({ title: "Document added!" });
  };

  const deleteDoc = async (id: string) => {
    await supabase.from("curriculum_documents").delete().eq("id", id);
    if (selectedCourse) fetchDocs(selectedCourse.id);
  };

  const updateStrictness = async (value: number[]) => {
    if (!selectedCourse) return;
    await supabase.from("courses").update({ socratic_strictness: value[0] }).eq("id", selectedCourse.id);
    setSelectedCourse({ ...selectedCourse, socratic_strictness: value[0] });
  };

  const copyShareLink = (courseId: string) => {
    const link = `${window.location.origin}/chat/${courseId}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied!", description: "Share this with your students." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-[Space_Grotesk]">Neural Layer</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1" /> New Course</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create a new course</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Course Title</Label>
                  <Input value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="e.g. Introduction to Biology" />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={newCourse.subject} onChange={e => setNewCourse({ ...newCourse, subject: e.target.value })} placeholder="e.g. Biology" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Brief course description..." />
                </div>
                <Button onClick={createCourse} className="w-full">Create Course</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">Create your first course to get started.</p>
              <Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4 mr-1" /> Create Course</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course list */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Your Courses</h2>
              {courses.map(course => (
                <Card
                  key={course.id}
                  className={`cursor-pointer transition-all ${selectedCourse?.id === course.id ? "ring-2 ring-primary" : "hover:shadow-sm"}`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{course.subject}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {sessionCounts[course.id] || 0} sessions</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Course detail */}
            {selectedCourse && (
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedCourse.title}</CardTitle>
                        <CardDescription>{selectedCourse.subject} • {selectedCourse.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyShareLink(selectedCourse.id)}>
                        <Copy className="w-4 h-4 mr-1" /> Share Link
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Socratic Strictness */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Settings className="w-4 h-4" /> AI Behavior</CardTitle>
                    <CardDescription>Adjust how strictly the AI enforces Socratic method (1 = gentle hints, 10 = strict questioning only)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-16">Gentle</span>
                      <Slider
                        value={[selectedCourse.socratic_strictness]}
                        onValueChange={updateStrictness}
                        min={1} max={10} step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-16 text-right">Strict</span>
                      <span className="text-lg font-bold w-8 text-center">{selectedCourse.socratic_strictness}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Curriculum Documents */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" /> Curriculum Materials</CardTitle>
                        <CardDescription>Add text content that the AI will use as context</CardDescription>
                      </div>
                      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Material</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Add curriculum material</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} placeholder="e.g. Chapter 1 - Cell Biology" />
                            </div>
                            <div className="space-y-2">
                              <Label>Content</Label>
                              <Textarea
                                value={newDoc.content}
                                onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                                placeholder="Paste your curriculum text here..."
                                className="min-h-[200px]"
                              />
                            </div>
                            <Button onClick={addDocument} className="w-full">Add Material</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {docs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No materials added yet. Add curriculum content for the AI to use.</p>
                    ) : (
                      <div className="space-y-2">
                        {docs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="text-sm font-medium">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">{doc.content.length} characters</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
