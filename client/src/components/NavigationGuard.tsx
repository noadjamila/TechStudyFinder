import React from "react";

/**
 * NavigationGuard is now a simple wrapper.
 * Navigation blocking is handled by individual pages.
 */
export default function NavigationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
