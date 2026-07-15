export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon && (
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl btn-hero">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
