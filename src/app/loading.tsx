export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-10">
        {/* Animated loader */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse ring */}
          <span className="absolute h-24 w-24 animate-ping rounded-full bg-primary/20" />

          {/* Middle pulse ring */}
          <span className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/10" />

          {/* Spinning arc */}
          <span className="absolute h-20 w-20 animate-spin rounded-full border-[3px] border-transparent border-r-primary/40 border-t-primary" />

          {/* Center dot */}
          <span className="h-5 w-5 animate-pulse rounded-full bg-primary" />
        </div>

        {/* Loading text with animation */}
        <div className="flex items-center gap-1.5">
          <p className="animate-pulse text-sm font-medium text-muted-foreground">
            লোড হচ্ছে
          </p>
          <span className="flex gap-0.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
          </span>
        </div>
      </div>
    </div>
  );
}