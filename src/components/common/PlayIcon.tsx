interface Props {
  size?: number;
}

function PlayIcon({ size = 10 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <polygon points="1,0 9,5 1,10" fill="currentColor" />
    </svg>
  );
}

export default PlayIcon;
