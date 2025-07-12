"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, XCircle } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [questions, setQuestions] = useState([]);

  const createQuestion = () => ({
    id: crypto.randomUUID(),
    text: "",
    options: Array.from({ length: 4 }, () => ({
      id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
    })),
  });

  const updateQuestions = (fn) => setQuestions((prev) => fn(prev));

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    setTopics((prev) => [
      ...prev,
      {
        id: `topic-${Date.now()}`,
        title: newTopicTitle.trim(),
        content: newTopicContent.trim(),
        questions,
      },
    ]);
    setNewTopicTitle("");
    setNewTopicContent("");
    setQuestions([]);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 mt-15">
      <h1 className="mb-8 text-3xl font-bold">Science Topics</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Topic Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[150px]">Questions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground h-24"
                >
                  No topics yet.
                </TableCell>
              </TableRow>
            ) : (
              topics.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell>{t.content || "-"}</TableCell>
                  <TableCell>{t.questions.length || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add New Topic
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Topic</DialogTitle>
            <DialogDescription>
              Add questions and answers below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTopic} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Input
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="border p-4 rounded-md relative space-y-2"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() =>
                      updateQuestions((qs) => qs.filter((x) => x.id !== q.id))
                    }
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>

                  <Input
                    value={q.text}
                    onChange={(e) =>
                      updateQuestions((qs) =>
                        qs.map((item) =>
                          item.id === q.id
                            ? { ...item, text: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder={`Question ${qIndex + 1}`}
                    required
                  />

                  <div className="space-y-2 pl-4">
                    {q.options.map((opt, oIndex) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={opt.isCorrect}
                          onCheckedChange={() =>
                            updateQuestions((qs) =>
                              qs.map((item) =>
                                item.id === q.id
                                  ? {
                                      ...item,
                                      options: item.options.map((o) => ({
                                        ...o,
                                        isCorrect: o.id === opt.id,
                                      })),
                                    }
                                  : item
                              )
                            )
                          }
                        />
                        <Input
                          value={opt.text}
                          onChange={(e) =>
                            updateQuestions((qs) =>
                              qs.map((item) =>
                                item.id === q.id
                                  ? {
                                      ...item,
                                      options: item.options.map((o) =>
                                        o.id === opt.id
                                          ? { ...o, text: e.target.value }
                                          : o
                                      ),
                                    }
                                  : item
                              )
                            )
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  updateQuestions((qs) => [...qs, createQuestion()])
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Question
              </Button>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Topic</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
