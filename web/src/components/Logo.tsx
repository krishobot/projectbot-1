// astack + tbrain brand mark.
//
// Concept: a 3×3 grid of 8 small zinc dots orbiting one bold emerald node.
// 8 + 1 = 9 visible elements, but the *meaning* is 13 specialised teams
// orbiting one founder/brain — the founder is the anchored emerald node,
// the dots are abbreviated for legibility at favicon scale. Reads as a
// "team grid + central source" mark, not as a letterform — distinctive vs.
// the previous gradient "a" tile, and meaningful for the product.
export function Logo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const r = size / 32; // scale factor
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="astack-bg" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="astack-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#d1fae5" />
        </radialGradient>
      </defs>

      {/* Rounded-square tile with emerald → cyan gradient */}
      <rect
        x="0"
        y="0"
        width="32"
        height="32"
        rx={7 * r}
        fill="url(#astack-bg)"
      />

      {/* 8 dim dots — the surrounding teams */}
      <g fill="rgba(9, 9, 11, 0.55)">
        <circle cx="9" cy="9" r="1.4" />
        <circle cx="16" cy="9" r="1.4" />
        <circle cx="23" cy="9" r="1.4" />
        <circle cx="9" cy="16" r="1.4" />
        <circle cx="23" cy="16" r="1.4" />
        <circle cx="9" cy="23" r="1.4" />
        <circle cx="16" cy="23" r="1.4" />
        <circle cx="23" cy="23" r="1.4" />
      </g>

      {/* Center node — the founder / brain. Bigger, light-coloured, with
          a subtle glow ring so it reads as the anchor of the grid. */}
      <circle
        cx="16"
        cy="16"
        r="3.6"
        fill="rgba(250, 250, 250, 0.18)"
      />
      <circle cx="16" cy="16" r="2.4" fill="url(#astack-core)" />
    </svg>
  );
}
