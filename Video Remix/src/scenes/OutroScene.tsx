import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface OutroSceneProps {
  text: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 150 },
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out near end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const ringScale = 1 + frame * 0.01;
  const ringOpacity = interpolate(frame, [0, 30, 60], [0, 0.4, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut,
      }}
    >
      {/* Expanding rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 200 + i * 120,
            height: 200 + i * 120,
            borderRadius: "50%",
            border: "2px solid rgba(167, 139, 250, 0.3)",
            transform: `scale(${1 + (frame - i * 10) * 0.008})`,
            opacity: interpolate(frame, [i * 10, i * 10 + 40, i * 10 + 80], [0, 0.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      ))}

      {/* Check icon */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 60,
          opacity,
          transform: `scale(${scale})`,
          marginBottom: 40,
          boxShadow: "0 0 60px rgba(167, 139, 250, 0.5)",
        }}
      >
        ✓
      </div>

      {/* Text */}
      <h2
        style={{
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 80,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
          background: "linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </h2>

      {/* Tagline */}
      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          marginTop: 20,
          fontFamily: "'Segoe UI', Arial, sans-serif",
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Made with Video Remix · SystemaOps
      </p>

      {/* Bottom gradient bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)",
        }}
      />
    </AbsoluteFill>
  );
};
