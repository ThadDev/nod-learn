import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-muted/20 py-10 md:py-14">
            <div className="container grid gap-8 md:grid-cols-4">
                <div>
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-xl tracking-tight text-primary">Nodlearn</span>
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                        A premium financial education platform teaching you how modern investments work.
                    </p>
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-semibold">Features</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/course" className="hover:text-foreground transition">Free Course</Link></li>
                        <li><Link href="/blog" className="hover:text-foreground transition">Blog</Link></li>
                        <li><Link href="/certificate" className="hover:text-foreground transition">Certificates</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-semibold">Company</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/about" className="hover:text-foreground transition">About Us</Link></li>
                        <li><Link href="/faq" className="hover:text-foreground transition">FAQ</Link></li>
                        <li><Link href="/contact" className="hover:text-foreground transition">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/terms" className="hover:text-foreground transition">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link></li>
                        <li><Link href="/disclaimer" className="hover:text-foreground transition">Disclaimer</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container mt-10 md:mt-14 border-t pt-8">
                <p className="text-xs text-muted-foreground text-center">
                    &copy; {new Date().getFullYear()} Nodlearn. All rights reserved. Not financial advice.
                </p>
            </div>
        </footer>
    )
}
