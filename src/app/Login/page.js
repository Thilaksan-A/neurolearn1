"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Login() {
  const router = useRouter();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Login form submitted");
  // };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="w-8 pb-4">
        <Brain></Brain>
      </div>
      <h1 className="pb-5">Welcome to NeuroLearn</h1>
    <form>
      <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" >
              Login
            </Button>
            <a href="#" className="py-2 pb-0 inline-block text-sm">
              Forgot your password?
            </a>
          </CardFooter>
        </Card>
        </form>
        <div className="p-2"></div>
        <Button className="bg-transparent shadow-none hover:bg-transparent hover:underline text-black" onClick={() => router.push('/Signup')}>No account yet? Sign up</Button>
      </div>
  )
}

export default Login;
