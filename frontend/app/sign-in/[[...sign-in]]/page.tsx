import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-h1 text-accent mb-2">BrainLog</h1>
                    <p className="font-body text-body text-muted-light">
                        Sign in to your account
                    </p>
                </div>
                <SignIn />
            </div>
        </main>
    );
}
