import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';

interface ExplainerProps {
  title: string;
  subtitle: string;
}

export const Explainer: React.FC<ExplainerProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: interpolate(frame, [0, 45, 90], [0, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {title}
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '24px',
            opacity: interpolate(frame - 90, [0, 30, 90], [0, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              fontSize: 48,
              color: 'white',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#ccc',
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            Powered by AI Video Editing
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={210} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            opacity: interpolate(frame - 210, [0, 45, 90], [0, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Thanks for watching!
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};