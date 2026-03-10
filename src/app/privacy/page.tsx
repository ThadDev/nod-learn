export default function PrivacyPage() {
    return (
        <div className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 max-w-3xl prose prose-slate dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: March 9, 2026</p>

                <h2>1. Information We Collect</h2>
                <p>We collect information you provide when creating an account (name, email), as well as usage data such as course progress and lesson completions.</p>

                <h2>2. How We Use Your Information</h2>
                <ul>
                    <li>To provide and improve our educational services</li>
                    <li>To issue certificates upon course completion</li>
                    <li>To send transactional emails (welcome, completion, certificate)</li>
                    <li>To send optional educational newsletters (with your consent)</li>
                </ul>

                <h2>3. Data Sharing</h2>
                <p>We do not sell your personal data. We may share data with third-party service providers (such as email services) solely to operate the Platform.</p>

                <h2>4. Cookies</h2>
                <p>We use session cookies for authentication. We do not use advertising or tracking cookies.</p>

                <h2>5. Data Retention</h2>
                <p>Your data is retained for as long as your account is active. You may request deletion at any time.</p>

                <h2>6. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@nodlearn.com">privacy@nodlearn.com</a>.</p>

                <h2>7. Security</h2>
                <p>We use industry-standard security practices including encrypted connections (HTTPS) and hashed tokens for authentication.</p>
            </div>
        </div>
    )
}
