interface Props {
  size?: number;
}

function ResetIcon({ size = 10 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        d="M6 1.5 A4.5 4.5 0 1 0 10.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <polygon points="9,1 12.5,5 7.5,6" fill="currentColor"/>
    </svg>
  );
}

export default ResetIcon;
