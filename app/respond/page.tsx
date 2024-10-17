"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from "react"

export default function RespondPage() {
    const router = useRouter()
    const [timeLeft, setTimeLeft] = useState<number>(180)
    const [responseText, setResponseText] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const timerRef = useRef<number | null>(null)

    const responseTextRef = useRef(responseText)
    const isSubmittingRef = useRef(isSubmitting)

    useEffect(() => {
        responseTextRef.current = responseText
    }, [responseText])

    useEffect(() => {
        isSubmittingRef.current = isSubmitting
    }, [isSubmitting])

    useEffect(() => {
        async function submitResponse(): Promise<void> {
            if (isSubmittingRef.current) {
                console.log('Submission already in progress.')
                return
            }

            setIsSubmitting(true)
            setError(null)

            try {
                const currentResponseText = responseTextRef.current.trim()
                if (currentResponseText !== "") {
                    const res = await fetch('/api/postResponse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ responseText: currentResponseText }),
                    })

                    if (!res.ok) {
                        const data = await res.json()
                        console.error(`API responded with error: ${data.message || 'Something went wrong'}`)
                        throw new Error(data.message || 'Something went wrong')
                    }
                }
                router.push('/responses')
            } catch (err: any) {
                console.error('Error sending response text:', err)
                setError(err.message || 'Failed to submit response')
                setIsSubmitting(false)
                router.push('/responses')
            }
        }

        timerRef.current = window.setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    if (timerRef.current !== null) {
                        clearInterval(timerRef.current)
                        timerRef.current = null
                        console.log('Timer ended. Calling submitResponse.')
                    }
                    submitResponse()
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current)
                timerRef.current = null
                console.log('Component unmounted. Timer cleared.')
            }
        }
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="w-full h-screen flex justify-center items-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <CardTitle className="pr-4">Should social media platforms censor political misinformation?</CardTitle>
                        <div
                            className={`mt-2 sm:mt-0 text-xl font-semibold p-2 w-20 border border-dashed rounded 
                            ${timeLeft < 15 ? 'border-red-500 text-red-500' : timeLeft < 60 ? 'border-orange-400 text-orange-400' : 'border-green-500 text-green-500'}`}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <CardDescription>
                        Give your opinion to the best of your ability within the 3-minute time limit.
                        <br />Responses will auto-submit at the end of the time period.
                        <br /><span className="font-bold">This is an anonymous submission.</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Textarea
                            value={responseText}
                            onChange={e => setResponseText(e.target.value)}
                            placeholder="Input your opinion/response here."
                            disabled={isSubmitting}
                            className="resize-none"
                        />
                        {error && (
                            <p className="text-red-500 text-sm">
                                {error}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}