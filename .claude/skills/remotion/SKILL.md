---
name: remotion
description: Create video compositions and animations using Remotion. Use for generating programmatic videos, social media clips, animated content, or video templates.
argument-hint: [video-description]
allowed-tools: Read, Grep, Glob, Bash(npx remotion *), Bash(npm install *), Bash(npm run *)
---

## Remotion Video Creation Skill

You are an expert Remotion developer. Help the user create programmatic videos using React and Remotion.

### Setup

If Remotion is not yet installed in the project, guide the setup:

```bash
npm install remotion @remotion/cli @remotion/player
```

Place Remotion compositions in a dedicated directory:

```
remotion/
├── Root.tsx           # RegisterRoot with all compositions
├── compositions/      # Individual video compositions
│   ├── BlogIntro.tsx
│   ├── SocialClip.tsx
│   └── ...
├── components/        # Reusable video components
│   ├── AnimatedText.tsx
│   ├── Logo.tsx
│   └── ...
└── utils/             # Helpers (easing, colors, etc.)
```

### Core Patterns

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <h1 style={{ color: "white", fontSize: 80 }}>Hello World</h1>
      </div>
    </AbsoluteFill>
  );
};
```

### Animation Guidelines

1. **Use `interpolate()`** for linear transitions between values
2. **Use `spring()`** for natural, physics-based animations
3. **Always clamp** extrapolation to prevent overshooting: `{ extrapolateRight: "clamp" }`
4. **Sequence animations** using `<Sequence from={frame}>` for staggered effects
5. **Standard frame rates**: 30fps for general, 60fps for smooth animations

### Composition Registration

```tsx
// remotion/Root.tsx
import { Composition } from "remotion";
import { BlogIntro } from "./compositions/BlogIntro";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BlogIntro"
      component={BlogIntro}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ title: "My Blog Post" }}
    />
  </>
);
```

### Common Video Types for BlogDesk

- **Blog post intro/outro** - animated title cards with branding
- **Social media clips** - 1080x1080 or 9:16 short-form content
- **Article summaries** - animated text with key points
- **Channel trailers** - branded overview videos

### Rendering

```bash
# Preview in browser
npx remotion studio remotion/Root.tsx

# Render to MP4
npx remotion render remotion/Root.tsx BlogIntro out/blog-intro.mp4

# Render still frame
npx remotion still remotion/Root.tsx BlogIntro out/thumbnail.png --frame=45
```

### Using Remotion Player (Embed in App)

```tsx
import { Player } from "@remotion/player";
import { BlogIntro } from "@/remotion/compositions/BlogIntro";

<Player
  component={BlogIntro}
  durationInFrames={150}
  fps={30}
  compositionWidth={1920}
  compositionHeight={1080}
  style={{ width: "100%" }}
  controls
  inputProps={{ title: article.title }}
/>
```

### Best Practices

- Keep compositions pure (no side effects)
- Use `inputProps` for dynamic data
- Preload assets with `staticFile()` or `delayRender()`/`continueRender()`
- Test at multiple resolutions
- Use `<Series>` for sequential scenes

### Reference

The user's request: $ARGUMENTS
