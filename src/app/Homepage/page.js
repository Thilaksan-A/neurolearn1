"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import {
  BookOpen,
  Calculator,
  Earth,
  FlaskConical,
  Palette,
  PenTool,
  User,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const subjects = [
  {
    id: "maths",
    title: "Maths",
    icon: Calculator,
    color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300",
    iconColor: "text-emerald-600",
    path: "/",
  },
  {
    id: "science",
    title: "Science",
    icon: FlaskConical,
    color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
    iconColor: "text-blue-600",
    path: "/Science",
  },
  {
    id: "geography",
    title: "Geography",
    icon: Earth,
    color: "bg-green-100 hover:bg-green-200 border-green-300",
    iconColor: "text-green-600",
    path: "/",
  },
  {
    id: "english",
    title: "English",
    icon: PenTool,
    color: "bg-purple-100 hover:bg-purple-200 border-purple-300",
    iconColor: "text-purple-600",
    path: "/",
  },
  {
    id: "art",
    title: "Art",
    icon: Palette,
    color: "bg-orange-100 hover:bg-orange-200 border-orange-300",
    iconColor: "text-orange-600",
    path: "/",
  },
  {
    id: "reading",
    title: "Reading",
    icon: BookOpen,
    color: "bg-rose-100 hover:bg-rose-200 border-rose-300",
    iconColor: "text-rose-600",
    path: "/",
  },
];

export default function Dashboard() {
  const [userName, setUserName] = useState("Student");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/Login"); // redirect to login if token is missing
    //   return;
    // }

    try {
      const decoded = jwtDecode(token);
      if (typeof decoded === "object" && decoded?.name) {
        setUserName(decoded.name);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      // router.push("/Login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/Login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-xl text-slate-600">
              Ready to learn something new today?
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full border-2 hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 bg-transparent"
              aria-label="Audio settings"
            >
              <Volume2 className="h-6 w-6 text-slate-600" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-14 w-14 rounded-full border-2 hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 bg-transparent"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <User className="h-6 w-6 text-slate-600" />
            </Button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Link href={subject.path} key={subject.id}>
                  <Card
                    className={`${subject.color} border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg focus-within:ring-4 focus-within:ring-blue-300 cursor-pointer`}
                  >
                    <CardContent className="p-8 text-center">
                      <button
                        className="w-full focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg p-4"
                        aria-label={`Go to ${subject.title} activities`}
                      >
                        <div className="flex flex-col items-center gap-6">
                          <div className="p-6 rounded-full bg-white shadow-sm">
                            <IconComponent
                              className={`h-16 w-16 ${subject.iconColor}`}
                              strokeWidth={2}
                            />
                          </div>
                          <h2 className="text-3xl font-bold text-slate-800">
                            {subject.title}
                          </h2>
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>

        <footer className="mt-12 text-center">
          <p className="text-lg text-slate-500">
            Take your time and have fun learning! 🌟
          </p>
        </footer>
      </div>
    </div>
  );
}
