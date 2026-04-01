import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: string;
}

export function DynamicIcon({ name, fallback = "Circle", ...props }: DynamicIconProps) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
  const IconComponent = icons[name];
  const FallbackIcon = icons[fallback] ?? icons["Circle"];

  if (IconComponent) {
    return <IconComponent {...props} />;
  }
  return <FallbackIcon {...props} />;
}
