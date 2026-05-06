type IconName = "run" | "walk" | "calendar" | "ranking" | "health" | "qr" | "admin";

type AppIconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, string[]> = {
  run: [
    "M13 4.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M9 20.5 11.5 14l-3-2-2.5 4.5",
    "M14.5 8.5 12 6l-3.5 3.5 3 2.5 4 1.5 2.5 4",
    "M7 8.5 9.5 6H13l3 3"
  ],
  walk: [
    "M12 4.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M10 21l2-7-2-3-2 3",
    "M14.5 21 13 15l2-4-2.5-3H9",
    "M7 10.5 9 8"
  ],
  calendar: [
    "M5 3v3M19 3v3",
    "M4 7h16",
    "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
    "M8 11h3M13 11h3M8 15h3M13 15h3"
  ],
  ranking: [
    "M4 20V10h4v10",
    "M10 20V4h4v16",
    "M16 20v-7h4v7",
    "M3 20h18"
  ],
  health: [
    "M20.5 8.5c0 5-8.5 10-8.5 10s-8.5-5-8.5-10A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8.5 3.5Z",
    "M8 11h2.5l1-2.5 2 5 1-2.5H17"
  ],
  qr: [
    "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Z",
    "M14 14h2v2h-2v-2Zm4 0h2v6h-4v-2h2v-4Zm-4 4h2v2h-2v-2Z"
  ],
  admin: [
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M4 21a8 8 0 0 1 16 0",
    "M18 8h3M19.5 6.5v3"
  ]
};

export function AppIcon({ name, className = "h-5 w-5" }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
