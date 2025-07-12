"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, FlaskConical, PenTool, BookOpen, User, Volume2, Earth, Plus } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Dashboard() {
  const initialClasses = []
  const [classes, setClasses] = useState(initialClasses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newClassTitle, setNewClassTitle] = useState("")
  const [newClassStudentsName, setNewClassStudentsName] = useState("")
  const [newClassSubjects, setNewClassSubjects] = useState("")

  const handleCreateClass = (e) => {
    e.preventDefault()

    const newClass = {
      id: `class-${Date.now()}`,
      title: newClassTitle,
      icon: BookOpen,
      color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
      iconColor: "text-yellow-600",
      path: "/TeacherHomepage/ScienceDashboard",
      studentsName: "",
      subjects: newClassSubjects,
    }

    setClasses([...classes, newClass])
    setNewClassTitle("")
    setNewClassStudentsName("")
    setNewClassSubjects("")
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen p-6 mt-15">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome to the Teacher's Dashboard! 👋</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full border-2 hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 bg-transparent"
              aria-label="Profile"
            >
              <User className="h-6 w-6 text-slate-600" />
            </Button>
          </div>
        </header>
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => {
              const IconComponent = classItem.icon
              return (
                <Link href={classItem.path} key={classItem.id}>
                  <Card
                    className={`${classItem.color} border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-within:ring-4 focus-within:ring-blue-300 cursor-pointer`}
                  >
                    <CardContent className="p-8 text-center">
                      <button
                        className="w-full focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg p-4"
                        aria-label={`Go to ${classItem.title} activities`}
                      >
                        <div className="flex flex-col items-center gap-6">
                          <div className="p-6 rounded-full bg-white shadow-sm">
                            <IconComponent className={`h-16 w-16 ${classItem.iconColor}`} strokeWidth={2} />
                          </div>
                          <h2 className="text-3xl font-bold text-slate-800">{classItem.title}</h2>
                          {classItem.students !== undefined && (
                            <p className="text-lg text-slate-700">{classItem.students} Students</p>
                          )}
                          {classItem.subjects && <p className="text-md text-slate-600">{classItem.subjects}</p>}
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="border-2 border-dashed border-slate-400 bg-slate-50 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-within:ring-4 focus-within:ring-blue-300 cursor-pointer flex items-center justify-center">
                  <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
                    <Button
                      variant="ghost"
                      className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-slate-800"
                      aria-label="Add new class"
                    >
                      <Plus className="h-16 w-16" strokeWidth={2} />
                      <span className="text-2xl font-bold">Add New Class</span>
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new class. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateClass} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="students" className="text-left">
                      Student's name
                    </Label>
                    <Input
                      id="students"
                      value={newClassStudentsName}
                      onChange={(e) => setNewClassStudentsName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subjects" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="subjects"
                      value={newClassSubjects}
                      onChange={(e) => setNewClassSubjects(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., Math, Science, History"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Create Class</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
