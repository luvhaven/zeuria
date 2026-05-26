export default function Template({ children }: { children: React.ReactNode }) {
  // Page transitions are now elegantly handled by the global TransitionLayout
  // utilizing AnimatePresence in layout.tsx
  return <>{children}</>;
}
