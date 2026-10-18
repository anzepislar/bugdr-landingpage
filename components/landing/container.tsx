// Single source of truth for horizontal alignment across all sections.
// 1100px max width; 20px gutter on mobile, 32px on md+.
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1100px] px-5 md:px-8 ${className ?? ""}`}>
      {children}
    </div>
  );
}
