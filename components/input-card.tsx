"use client"

import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Textarea } from "./ui/textarea"

export function InputCard() {
  return (
    <Card>
        <div className="flex justify-between items-center">
      <CardHeader>
        
        <CardTitle>Should social media platforms censor political misinformation?</CardTitle>
        <CardDescription>
          Give your opinion to the best of your ability within the 3 minute time limit.
          <br/>Responses will auto-submit at the end of the time period.
          <br/><span className="font-bold">This is an anonymous submission.</span>
        </CardDescription>
      </CardHeader>
      <div className="p-8">
        timer component here
      </div>
      </div>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Textarea
            placeholder="Input your opinion/response here."
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button className="w-full">Submit</Button>
      </CardFooter>
    </Card>
  )
}