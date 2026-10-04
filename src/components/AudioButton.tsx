import { Volume2 } from 'lucide-react';

interface Props {
  label: string;
  supported: boolean;
  speaking: boolean;
  onPlay: () => void;
  onPreload?: () => void;
}

export function AudioButton({ label, supported, speaking, onPlay, onPreload }: Props) {
  const text = supported ? `Eshitish: ${label}` : 'Bu brauzerda ovoz ishlamaydi';
  return (
    <button
      type="button"
      className={`icon-btn${speaking ? ' is-speaking' : ''}`}
      onClick={onPlay}
      onMouseEnter={onPreload}
      onTouchStart={onPreload}
      onFocus={onPreload}
      disabled={!supported}
      aria-label={text}
      title={text}
    >
      <Volume2 aria-hidden="true" />
    </button>
  );
}
