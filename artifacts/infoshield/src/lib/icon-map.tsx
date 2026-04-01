import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface DynamicIconProps extends LucideProps {
  name: string;
  fallback?: IconName;
}

export function DynamicIcon({ name, fallback = "Circle", ...props }: DynamicIconProps) {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<LucideProps>>)[name];
  const Fallback = (LucideIcons as Record<string, React.ComponentType<LucideProps>>)[fallback];

  if (IconComponent) {
    return <IconComponent {...props} />;
  }
  return <Fallback {...props} />;
}
