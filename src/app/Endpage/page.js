"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ArrowRight, BookOpen, Clock, Worm, BookOpenText } from "lucide-react"
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();

  const relatedCourses = [
    {
      id: 1,
      title: "Butterfly Lifecycle",
      description: "Learn about how capterpillars turn into butterflies!",
      duration: "10 mins",
      image: Worm,
    },
    {
      id: 2,
      title: "Types of rocks",
      description: "Learn about the different rocks that exist in the world.",
      duration: "20 mins",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Trees",
      description: "Learn about the different trees that grow in our forest",
      duration: "15 mins",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Congratulations! 🎉</h1>
          <p className="text-xl text-gray-600 mb-2">You've successfully completed the course!</p>

          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-500">Questions Answered</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center pb-8">
          <Button onClick={() => router.push('/Homepage')}>Back to Home</Button>
        </div>
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue Your Learning Journey</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="pb-4">
                    <BookOpenText />
                   </div>
                <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </CardTitle>

                  <CardDescription className="text-sm text-gray-600 mb-4">{course.description}</CardDescription>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>

                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Course
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </div>
      </div>
  )
}
