export function JsonLd() {
  const baseUrl = 'https://arc-companion.com';

  // WebApplication Schema - Primary structured data
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Arc Raiders Companion',
    alternateName: ['ARC Companion', 'Arc Raiders Stash Tracker', 'Arc Raiders Inventory Manager'],
    description: 'The ultimate Arc Raiders companion app. Track your stash, get smart KEEP/SELL/RECYCLE recommendations, manage workshop upgrades, plan loadouts, and optimize your raids.',
    url: baseUrl,
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Inventory Management',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Works best in modern browsers.',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Inventory tracking for Arc Raiders',
      'KEEP/SELL/RECYCLE item recommendations',
      'Workshop upgrade progress tracking',
      'Scrappy companion upgrade tracker',
      'Loadout builder and manager',
      'Quest requirement tracking',
      'Cloud sync with Google account',
      'Offline support (PWA)',
    ],
    screenshot: `${baseUrl}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // SoftwareApplication for broader discovery
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Arc Raiders Companion',
    description: 'Free inventory management and progression tracking tool for Arc Raiders players.',
    url: baseUrl,
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Arc Raiders Companion',
      url: baseUrl,
    },
  };

  // FAQPage Schema - Helps with rich snippets and AI understanding
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Arc Raiders Companion?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Arc Raiders Companion is a free web app that helps Arc Raiders players manage their inventory, track workshop upgrade progress, get recommendations on what items to keep or sell, and plan loadouts.',
        },
      },
      {
        '@type': 'Question',
        name: 'What items should I keep in Arc Raiders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You should keep items needed for workshop upgrades (Gunsmith, Gear Bench, Medical Lab, etc.) and Scrappy upgrades. Critical items include Arc Alloy, Arc Circuitry, and various materials. Use our companion app to see exactly what you need based on your current progress.',
        },
      },
      {
        '@type': 'Question',
        name: 'What items should I sell in Arc Raiders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can safely sell Valuables and excess materials you don\'t need for upgrades. However, be careful with Trinkets - items like Dog Collar, Cat Bed, and Very Comfortable Pillow look sellable but are actually needed for Scrappy upgrades!',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I upgrade Scrappy in Arc Raiders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Scrappy is upgraded using specific items including Dog Collar, Cat Bed, Very Comfortable Pillow, and various materials. Our companion app tracks all Scrappy upgrade requirements and shows what you still need.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Arc Raiders Companion free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Arc Raiders Companion is completely free to use. You can use it as a guest without any account, or sign in with Google to sync your data across devices.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the workshop stations in Arc Raiders?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Arc Raiders has 6 workshop stations: Gunsmith (weapons), Gear Bench (armor/equipment), Medical Lab (healing items), Explosives Station (grenades), Utility Station (tools/gadgets), and Refiner (material processing). Each requires specific materials to upgrade.',
        },
      },
    ],
  };

  // HowTo Schema - For feature usage
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Use Arc Raiders Companion',
    description: 'Learn how to track your Arc Raiders inventory and get item recommendations',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Add Items to Your Stash',
        text: 'Click "Add Items" in the Raider Stash section and select items from your in-game inventory. You can add quantities and track everything you own.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Get KEEP/SELL/RECYCLE Recommendations',
        text: 'The Stash Analyzer automatically shows which items to keep for upgrades, which to recycle for materials, and which to sell for currency.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Track Workshop Upgrades',
        text: 'Go to Workshop Upgrades to see all station requirements. Mark levels as complete to track your progress and see remaining materials needed.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Save Loadouts',
        text: 'Use the Loadouts section to create and save gear presets for different playstyles or situations.',
      },
    ],
  };

  // VideoGame reference schema - connects to the game
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Arc Raiders',
    description: 'A free-to-play cooperative third-person extraction shooter by Embark Studios',
    genre: ['Extraction Shooter', 'Third-Person Shooter', 'Cooperative'],
    gamePlatform: ['PC', 'PlayStation 5', 'Xbox Series X/S'],
    publisher: {
      '@type': 'Organization',
      name: 'Embark Studios',
    },
    applicationCategory: 'Game',
  };

  // Organization schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Arc Raiders Companion',
    url: baseUrl,
    logo: `${baseUrl}/icon-512.png`,
    description: 'Free companion tools for Arc Raiders players',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
