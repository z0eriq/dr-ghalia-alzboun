export function GoldRule({ light = false }: { light?: boolean }) {
  const color = light ? "bg-gold" : "bg-gold-deep";
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className={`h-px w-10 ${color}`} />
      <span className={`size-1.5 rotate-45 ${color}`} />
      <span className={`h-px w-10 ${color}`} />
    </div>
  );
}
