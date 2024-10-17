import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <Card>
        <CardHeader>
          <CardTitle>CRWN 1 Media Presentation - Algorithms</CardTitle>
          <CardDescription>
            Activity outline:
            <br /> 1- You will be asked a question and will have 3 minutes to write your response
            <br /> 2- Look at the class's responses for 2 minutes
            <br /> 3- See a visualization of how the algorithm decided what content you should see
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full">
          <Link href="/respond" className="w-full">
            <Button className="w-full">Start Activity</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}