import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ContentSceneProps {
  title: string;
  subtitle: string;
}

const Feature: React.FC<{ icon: string; label: string; delay: number; frame: number; fps: number }> = ({
  icon,
  label,
  delay,
  frame,
  fps,
}) => {
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 180 },
  });

  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity,
        transform: `translateX(${interpolate(progress, [0, 1], [-60, 0])}px)`,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        padding: "20px 32px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        marginBottom: 16,
        width: 500,
      }}
    >
      <span style={{ fontSize: 48 }}>{icon}</span>
      <span
        style={{
          fontSize: 28,
          fontFamily: "'Segoe UI', Arial, sans-serif",
          color: "rgba(255,255,255,0.9)",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const ContentScene: React.FC<ContentSceneProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 20], [-40, 0], {
    extrapolateRight: "clamp",
  });

  const features = [
    { icon: "🎬", label: "Smart Scene Detection", delay: 10 },
    { icon: "🤖", label: "AI-Powered Editing", delay: 20 },
    { icon: "🎵", label: "Audio Sync Engine", delay: 30 },
    { icon: "✨", label: "One-Click Export", delay: 40 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #13111c 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: "center",
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: 72,
            fontWeight: 800,
            color: "#fff",
            margin: 0,
            background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
            margin: "12px 0 0",
            fontFamily: "'Segoe UI', Arial, sans-serif",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Feature list */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {features.map((f) => (
          <Feature key={f.label} {...f} frame={frame} fps={fps} />
        ))}
      </div>

      {/* Decorative gradient circle */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "50%",
          transform: "translateY(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
