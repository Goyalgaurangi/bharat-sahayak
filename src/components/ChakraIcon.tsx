export function ChakraIcon({ className = "", spin = false, size = 24 }: { className?: string; spin?: boolean; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${spin ? "animate-spin-slow" : ""} ${className}`}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="4">
        <circle cx="100" cy="100" r="88" />
        <circle cx="100" cy="100" r="18" fill="currentColor" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          const x2 = 100 + Math.cos(a) * 86;
          const y2 = 100 + Math.sin(a) * 86;
          return <line key={i} x1="100" y1="100" x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}
