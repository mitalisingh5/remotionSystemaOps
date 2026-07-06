import React from 'react';

interface Props {
  value: string;
  onChange: (s: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const TranscriptEditor: React.FC<Props> = ({ value, onChange, onSend, disabled = false }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  return (
    <div className="transcript-editor">
      <input
        className="transcript-input"
        placeholder="Speak a command or type one here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <button className="send-btn" onClick={onSend} disabled={disabled || !value.trim()}>
        Send
      </button>
    </div>
  );
};

export default TranscriptEditor;
