"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const occupations = [
  { label: "Student", value: "st" },
  { label: "Teacher", value: "te" },
];

const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  occupation: z.string({
    required_error: "Please select an occupation.",
  }),
});

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      occupation: "",
    },
  });

  const handleSubmit = async (data) => {
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          learner_type: "visual", // Default learner type - will be updated after survey
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || "Signup failed");
        return;
      }

      localStorage.setItem("token", responseData.token);

      // Route based on occupation
      if (data.occupation === "st") {
        router.push("/Signup/Survey");
      } else if (data.occupation === "te") {
        router.push("/TeacherHomepage");
      }

      toast("Account created successfully!", {
        description: "Welcome to NeuroLearn!",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    handleSubmit(data);
  };

  return (
    <main className="flex justify-center items-center min-h-screen flex-col bg-gray-50 p-4">
      <div className="p-6 rounded-2xl shadow-lg bg-white w-full max-w-md">
        <div className="flex justify-center items-center">
          <Brain className="h-10 w-10 text-gray-700" />
        </div>
        <p className="text-center pt-4 text-2xl font-semibold text-gray-800">
          Sign Up
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-3"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>I am a...</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          aria-label="Select Occupation"
                        >
                          {field.value
                            ? occupations.find(
                                (occupation) => occupation.value === field.value
                              )?.label
                            : "Select"}
                          <span className="ml-2 opacity-50">▼</span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white border border-gray-200 shadow-md p-3 w-[var(--radix-popover-trigger-width)]">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {occupations.map((occupation) => (
                              <CommandItem
                                key={occupation.value}
                                value={occupation.label}
                                onSelect={() => {
                                  form.setValue("occupation", occupation.value);
                                  form.trigger("occupation");
                                }}
                              >
                                {occupation.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="py-3 w-full"
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
