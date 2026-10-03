import { Volume2 } from 'lucide-react';

interface Props {
  label: string;
  supported: boolean;
  speaking: boolean;
  onPlay: () => void;
}

export function AudioButton({ label, supported, speaking, onPlay }: Props) {
  const text = supported ? `Eshitish: ${label}` : 'Bu brauzerda ovoz ishlamaydi';
  return (
    <button type="button" className={`icon-btn${speaking ? ' is-speaking' : ''}`} onClick={onPlay} disabled={!supported} aria-label={text} title={text}>
      <Volume2 aria-hidden="true" />
    </button>
  );
}
