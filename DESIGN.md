---
name: Neo-Geometric Surrealism
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#424753'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#727785'
  outline-variant: '#c2c6d5'
  surface-tint: '#005ac1'
  primary: '#0058bd'
  on-primary: '#ffffff'
  primary-container: '#2771df'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#b51b15'
  on-secondary: '#ffffff'
  secondary-container: '#d9372b'
  on-secondary-container: '#fffbff'
  tertiary: '#765700'
  on-tertiary: '#ffffff'
  tertiary-container: '#956e00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004494'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4a9'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930004'
  tertiary-fixed: '#ffdea0'
  tertiary-fixed-dim: '#fbbc06'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 64px
  element-gap: 24px
  section-margin: 128px
---

## Brand & Style

The design system is defined by a "Neo-Geometric Modern Vector Surrealism" aesthetic. It merges the clinical precision of technical drafting with the dreamlike quality of abstract geometry. The brand personality is intellectually playful, highly structured, and unapologetically bold. It targets a tech-forward audience that appreciates high-contrast clarity and avant-garde visual metaphors. 

The emotional response is intended to be one of "structured wonder"—where every element feels mathematically solved yet visually surprising. This design system avoids organic chaos, favoring decisive lines, prismatic color transitions, and a strict adherence to lowercase typography to maintain a humble, approachable "tech" vibe.

## Colors

This design system utilizes a pure white (#FFFFFF) foundation to maximize contrast against sharp black (#000000) linework. The core palette is derived from the official Google brand colors, but they are rarely used as flat solids for primary actions. Instead, they are deployed as:

1.  **Prismatic Gradients:** Linear transitions between the four primary colors (e.g., Blue to Green, Yellow to Red) within geometric fills.
2.  **Zebra Accents:** High-frequency black and white stripes used to denote interactive surfaces or decorative depth.
3.  **Technical Linework:** All containers and interactive elements must be bound by a solid black stroke.

## Typography

Typography in this design system is strictly lowercase across all levels, from massive headlines to micro-labels. This choice removes traditional hierarchy cues, shifting the burden of emphasis to weight and scale. 

**Plus Jakarta Sans** is the exclusive typeface, chosen for its geometric purity. To achieve the required "massive breathing room," typography must be surrounded by generous padding. Headlines should utilize tight letter-spacing for a "vector logo" feel, while body copy maintains generous line-heights to ensure legibility against high-contrast backgrounds.

## Layout & Spacing

The layout philosophy is based on an **Isometric Fixed Grid**. While the UI elements are responsive, their placement should feel as if they are anchored to a 30-degree isometric plane. 

Spacing is intentionally excessive. Elements are never crowded; the design system treats white space as a physical material rather than a void. A strict 8px rhythm governs all internal padding, but global margins are expanded to provide a "gallery" feel. Isometric grid lines should be subtly rendered in 0.5px light gray (#E0E0E0) in the background of large sections to reinforce the mathematical surrealism.

## Elevation & Depth

This design system rejects ambient shadows and blur-based depth. Instead, elevation is communicated through:

1.  **Bold Borders:** All layers are separated by 2px black outlines.
2.  **Geometric Stacking:** Depth is simulated by overlapping pill-shaped containers.
3.  **Zebra Patterns:** Elements that are "raised" or "active" may feature a 45-degree zebra stripe pattern fill, creating a vibrating optical effect that distinguishes them from the static white background.
4.  **Isometric Offsets:** Components can be visually "lifted" by adding a hard-edged black "shadow" block (a solid black duplicate of the shape shifted 4px right and 4px down).

## Shapes

The shape language is dominated by the **pill**. Every container, button, input field, and image mask must use `ROUND_FULL` (maximum corner radius) to create a soft, capsule-like silhouette. 

This extreme roundness acts as a counterpoint to the aggressive black linework and high-contrast colors. Squares and sharp corners are prohibited, except for the internal lines of pattern fills. The consistent 2px black stroke must be applied to the outer perimeter of every shape to maintain "technical" consistency.

## Components

### Buttons
Primary buttons are pill-shaped with a 2px black border and a prismatic gradient fill (Google Blue to Green). Text is lowercase, centered, and bold black. Secondary buttons use a white fill with zebra-stripe hover states.

### Cards & Containers
Large containers must be pill-shaped. If the content is too tall for a standard capsule, use a "stadium" shape (flat sides, fully rounded top and bottom). All cards feature the signature 2px black outline.

### Inputs & Form Elements
Input fields are pill-shaped capsules with lowercase placeholder text. The "focus" state is indicated by the 2px border thickening to 4px or the background switching to a faint isometric grid pattern. Checkboxes and radio buttons are also fully rounded (circles).

### Lists & Navigation
List items are treated as floating capsules with significant vertical gaps between them. Navigation utilizes pill-shaped "chips" to indicate the active page, filled with a solid Google Yellow (#FBBC05) and a black outline.

### Patterns
Use 'zebra' stripes sparingly within icons or as a decorative "edge" on the side of a card to indicate interactability or a "grab" state.