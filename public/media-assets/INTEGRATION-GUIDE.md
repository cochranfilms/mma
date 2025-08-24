# Marketing Mousetrap Agency - Media Assets Integration Guide

## Overview
This guide explains how to integrate the downloaded media assets into your website components.

## Asset Categories
### Media Connections
- **Description**: Professional networking and media relationship building
- **Total Images**: 36
- **Usage**: hero, section, card, thumbnail

### B2b Marketing
- **Description**: B2B marketing strategies and business growth
- **Total Images**: 36
- **Usage**: hero, section, card, thumbnail

### Consulting
- **Description**: Professional consulting and strategic planning
- **Total Images**: 24
- **Usage**: hero, section, card, thumbnail

### Web Presence
- **Description**: Digital presence and web development
- **Total Images**: 24
- **Usage**: hero, section, card, thumbnail

### Content Amplification
- **Description**: Content marketing and brand amplification
- **Total Images**: 24
- **Usage**: hero, section, card, thumbnail

### Campaign Execution
- **Description**: Marketing campaign execution and management
- **Total Images**: 24
- **Usage**: hero, section, card, thumbnail


## Integration Examples

### Hero Section Background
```tsx
// In your Hero component
<div className="relative overflow-hidden">
  <Image
    src="/media-assets/images/media-connections-hero-1.jpg"
    alt="Professional business networking"
    fill
    className="object-cover"
    priority
  />
  {/* Your hero content */}
</div>
```

### Service Card Images
```tsx
// In your ServicesOverview component
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {services.map((service, index) => (
    <div key={service.id} className="relative">
      <Image
        src={`/media-assets/images/${service.category}-card-${index + 1}.jpg`}
        alt={`${service.title} - Professional service`}
        width={400}
        height={300}
        className="rounded-t-2xl object-cover"
      />
      {/* Service content */}
    </div>
  ))}
</div>
```

### Section Backgrounds
```tsx
// For content sections
<section className="relative py-20">
  <div className="absolute inset-0 opacity-10">
    <Image
      src="/media-assets/images/b2b-marketing-section-1.jpg"
      alt="B2B marketing background"
      fill
      className="object-cover"
    />
  </div>
  {/* Section content */}
</section>
```

## Best Practices
1. **Optimization**: Use Next.js Image component for automatic optimization
2. **Accessibility**: Always provide meaningful alt text
3. **Performance**: Use appropriate image sizes for different contexts
4. **Branding**: Ensure images align with your professional B2B brand
5. **Consistency**: Maintain visual consistency across all pages

## File Naming Convention
- `{category}-{size}-{index}.jpg`
- Categories: media-connections, b2b-marketing, consulting, web-presence, content-amplification, campaign-execution
- Sizes: hero, section, card, thumbnail

## Next Steps
1. Review downloaded assets in `public/media-assets/images`
2. Integrate images into your website components
3. Customize styling and placement as needed
4. Test responsiveness across different devices
5. Optimize for performance and accessibility

Generated on: 8/21/2025
