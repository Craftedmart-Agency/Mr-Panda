export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning loader */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-secondary" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          লোড হচ্ছে...
        </p>
      </div>
    </div>
  );
}