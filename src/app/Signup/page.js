"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Brain } from "lucide-react"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"

const occupations = [
  { label: "Student", value: "st" },
  { label: "Teacher", value: "te" },
]

const FormSchema = z.object({
  occupation: z.string({
    required_error: "Please select an occupation.",
  }),
})

export default function Signup( onSuccess ) {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      occupation: "",
    },
  })

  const onSubmit = (data) => {
    if (data.occupation === "st") {
      router.push("/Signup/Survey")
    } else if (data.occupation === "te") {
      router.push("/TeacherHomepage")
    }

    toast("Form submitted!", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <main className="flex justify-center items-center min-h-screen flex-col bg-gray-50 p-4">
      <div className="p-6 rounded-2xl shadow-lg bg-white w-full max-w-md">
        <div className="flex justify-center items-center">
          <Brain className="h-10 w-10 text-gray-700" />
        </div>
        <p className="text-center pt-4 text-2xl font-semibold text-gray-800">Sign Up</p>
        <div className="py-3">
          <p className="mb-2 text-black py-2">Full Name</p>
          <Input type="text" placeholder="Name" required aria-label="Full Name" />
        </div>
        <div className="py-3">
          <p className="mb-2 text-black">Email</p>
          <Input type="email" placeholder="Email" required aria-label="Email" />
        </div>
        <div className="py-3">
          <p className="mb-2 text-black">Password</p>
          <Input type="password" placeholder="Password" required aria-label="Password" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-3">
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
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                          aria-label="Select Occupation"
                        >
                          {field.value
                            ? occupations.find((occupation) => occupation.value === field.value)?.label
                            : "Select"}
                          <span className="ml-2 opacity-50">▼</span> {/* Added a simple dropdown indicator */}
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
                                  form.setValue("occupation", occupation.value)
                                  form.trigger("occupation")
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
            <Button className="py-3 w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
