import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface IntroSceneProps {
  text: string;
}

export const IntroScene: React.FC<IntroSceneProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  });

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  const subtitleY = interpolate(frame, [20, 50], [30, 0], {
    extrapolateRight: "clamp",
  });

  // Particle positions (deterministic)
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: ((i * 137.5) % 100),
    y: ((i * 97.3) % 100),
    size: 4 + (i % 5) * 3,
    opacity: 0.1 + (i % 4) * 0.1,
    delay: i * 2,
  }));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated particles */}
      {particles.map((p, i) => {
        const particleOpacity = interpolate(
          frame,
          [p.delay, p.delay + 30],
          [0, p.opacity],
          { extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `rgba(139, 92, 246, ${particleOpacity})`,
              boxShadow: `0 0 ${p.size * 2}px rgba(139, 92, 246, ${particleOpacity})`,
            }}
          />
        );
      })}

      {/* Glowing orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          opacity: titleOpacity,
        }}
      />

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontSize: 120,
          fontWeight: 900,
          color: "#fff",
          margin: 0,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: "center",
          letterSpacing: "-4px",
          background: "linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </h1>

      {/* Subtitle line */}
      <div
        style={{
          marginTop: 24,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 36,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontWeight: 300,
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        AI-Powered Video Creation
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6)",
          opacity: subtitleOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
