# Assets Directory

This directory contains all static assets for the Shaimaa Al-Rifai portfolio website.

## Structure

```
/assets/
├── images/
│   ├── projects/      # Project screenshots and mockups
│   ├── profile/       # Profile photos and personal images
│   ├── icons/         # Custom icons and SVG files
│   └── backgrounds/   # Background images and textures
└── docs/             # CV, certificates, and documents
```

## Usage Guidelines

### Images
- **Format**: Use modern formats like WebP, PNG, or JPG
- **Size**: Optimize images for web (compress before uploading)
- **Naming**: Use descriptive, kebab-case names (e.g., `dar-al-rahmah-mockup.png`)

### Documents
- **CV/Resume**: Keep updated versions
- **Certificates**: Scan in high quality PDF format
- **Portfolio**: Additional portfolio pieces

### Importing Assets

```tsx
// For images
import projectImage from "../assets/images/projects/my-project.png";

// For documents
import myCV from "../assets/docs/resume.pdf";

// Usage in components
<img src={projectImage} alt="Project description" />
<a href={myCV} download>Download CV</a>
```

## Best Practices

1. **Optimize images** before uploading to reduce bundle size
2. **Use descriptive file names** for easy identification
3. **Organize by category** to maintain clean structure
4. **Update regularly** especially CV and portfolio pieces
5. **Consider WebP format** for better compression and quality