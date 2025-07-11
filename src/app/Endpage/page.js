"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, ArrowRight, Home, BookOpen, Clock, Users } from "lucide-react"
import { useRouter } from 'next/router';

export default function Component() {
  const router = useRouter();
  
  const relatedCourses = [
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      description: "Deep dive into closures, prototypes, and async programming",
      duration: "6 hours",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "React Hooks Mastery",
      description: "Master useState, useEffect, and custom hooks",
      duration: "4 hours",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      description: "Build scalable APIs with Express and MongoDB",
      duration: "8 hours",
      rating: 4.7,
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
          <p className="text-gray-500">Your dedication to learning is truly inspiring. Keep up the great work!</p>

          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-500">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">A+</div>
              <div className="text-sm text-gray-500">Final Grade</div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Continue Your Learning Journey</h2>
            <p className="text-gray-600">Based on what you've learned, here are some courses we recommend</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
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
