import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';

interface HighlightReelProps {
  highlights: number[];
}

export const HighlightReel: React.FC<HighlightReelProps> = ({ highlights }) => {
  const frame = useCurrentFrame();
  const colors = ['#667eea', '#764ba2', '#f093fb'];

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      {highlights.map((time, idx) => (
        <Sequence key={idx} from={time} durationInFrames={60}>
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${colors[idx % colors.length]} 0%, ${colors[(idx + 1) % colors.length]} 100%)`,
              opacity: interpolate(frame - time, [0, 30, 60], [0, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Highlight {idx + 1}
            </div>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};