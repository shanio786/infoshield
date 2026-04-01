import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center w-full">
      <div className="font-mono text-9xl font-bold text-primary/20 mb-4 tracking-tighter">404</div>
      <h1 className="text-3xl font-serif font-bold mb-4">Clearance Denied</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The intelligence file you are attempting to access does not exist or has been redacted.
      </p>
      <Link href="/">
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
          Return to Base
        </button>
      </Link>
    </div>
  );
}
