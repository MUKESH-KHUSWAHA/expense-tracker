export default function ChartSkeleton({ height = 300 }) {
  return (
    <div
      className="w-full min-w-0 rounded-lg bg-gray-100 dark:bg-gray-800/80 animate-pulse"
      style={{ height, minHeight: height, width: "100%" }}
      aria-hidden
    />
  );
}
