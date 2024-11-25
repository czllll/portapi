export function RecentActivity() {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                New API key generated
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(Date.now() - i * 60000).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }