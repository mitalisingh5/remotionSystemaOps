import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
} from "remotion";

interface CaptionedVideoProps {
  videoSrc: string;
  caption?: string;
}

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  videoSrc,
  caption,
}) => {
  console.log("CaptionedVideo videoSrc:", videoSrc);
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo
        src={videoSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {caption && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 60,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.75)",
              color: "white",
              fontSize: 40,
              padding: "15px 30px",
              borderRadius: 10,
              maxWidth: "80%",
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};