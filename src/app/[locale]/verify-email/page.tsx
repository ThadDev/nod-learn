import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
            <Card className="w-full max-w-md text-center py-8 shadow-xl border-t-4 border-t-primary">
                <CardHeader>
                    <div className="mx-auto bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">Check your inbox</CardTitle>
                    <CardDescription className="text-base mt-2">
                        We've sent a sign-in link to your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg text-sm flex items-start gap-3 text-left">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">
                            If you don't see the email, please check your spam folder. The link will expire in 24 hours.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full h-11 text-base font-semibold">
                            <Link href="/signin">Return to Sign In</Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
