interface Props {
  color: string;
}

function CarIcon({ color }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 28"
      width="64"
      height="28"
      aria-label="car"
    >
      <rect x="2" y="14" width="60" height="11" rx="3" fill={color} />
      <polygon points="14,14 20,5 44,5 50,14" fill={color} />
      <rect x="21" y="6" width="9" height="7" rx="1" fill="rgba(76,201,240,0.7)" />
      <rect x="33" y="6" width="9" height="7" rx="1" fill="rgba(76,201,240,0.7)" />
      <circle cx="14" cy="24" r="4" fill="#1a1a2e" />
      <circle cx="14" cy="24" r="2" fill="#444" />
      <circle cx="50" cy="24" r="4" fill="#1a1a2e" />
      <circle cx="50" cy="24" r="2" fill="#444" />
    </svg>
  );
}

export default CarIcon;
