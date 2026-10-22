import { SEO_LANDING_PAGES } from '../data/seoLandingPages';

export interface PageSEOMetadata {
  title: string;
  description: string;
  canonicalPath?: string;
  schema?: object | object[];
}

export const ROUTE_SEO: Record<string, PageSEOMetadata> = {
  '/': {
    title: 'True Marriage — Real People. Real Stories. Free Matrimonial Biodata Maker',
    description: 'Create stunning marriage biodata for free in minutes. Download beautiful PDFs, browse verified matrimonial profiles, and discover authentic matches with True Marriage.',
    canonicalPath: '/',
  },
  '/biodata-maker': {
    title: 'Biodata Maker & Matrimonial Templates — True Marriage',
    description: 'Create beautiful marriage biodata in minutes with our free online biodata maker. Choose from 100+ handcrafted traditional and modern formats.',
    canonicalPath: '/biodata-maker',
  },
  '/templates': {
    title: 'Biodata Maker & Matrimonial Templates — True Marriage',
    description: 'Create beautiful marriage biodata in minutes with our free online biodata maker. Choose from 100+ handcrafted traditional and modern formats.',
    canonicalPath: '/biodata-maker',
  },
  '/biodata': {
    title: 'Marriage Biodata Formats & Maker Directory — True Marriage',
    description: 'Explore 24+ specialized marriage biodata formats, regional language makers, community layouts, and free PDF templates with True Marriage.',
    canonicalPath: '/biodata',
  },
  '/biodata-formats': {
    title: 'Marriage Biodata Formats & Maker Directory — True Marriage',
    description: 'Explore 24+ specialized marriage biodata formats, regional language makers, community layouts, and free PDF templates with True Marriage.',
    canonicalPath: '/biodata',
  },
  '/discover': {
    title: 'Find Verified Matrimonial Profiles & Matches — True Marriage',
    description: 'Browse authentic and verified matchmaking profiles. Filter by profession, education, location, and lifestyle to find your ideal life partner.',
    canonicalPath: '/discover',
  },
  '/discovery': {
    title: 'Find Verified Matrimonial Profiles & Matches — True Marriage',
    description: 'Browse authentic and verified matchmaking profiles. Filter by profession, education, location, and lifestyle to find your ideal life partner.',
    canonicalPath: '/discover',
  },
  '/wizard': {
    title: 'Create Your Biodata Profile — Step by Step Wizard | True Marriage',
    description: 'Interactive conversational biodata maker with smart suggestions, crop tool, and real-time formatting.',
    canonicalPath: '/wizard',
  },
  '/studio': {
    title: 'Biodata Maker & Matrimonial Templates — True Marriage',
    description: 'Personalize and export your high-resolution verified matrimonial biodata PDF.',
    canonicalPath: '/templates',
  },
  '/interactions': {
    title: 'Your Matrimonial Interests & Shortlisted Profiles — True Marriage',
    description: 'Manage sent and received marriage interests, accepted connections, and shortlisted candidate profiles.',
    canonicalPath: '/interactions',
  },
  '/admin': {
    title: 'Admin Control Panel — True Marriage',
    description: 'System administration, moderation, and profile review panel.',
    canonicalPath: '/admin',
  },
  '/about-us': {
    title: 'About Us — Mission & Matchmaking Story | True Marriage',
    description: 'Learn about True Marriage, India’s modern privacy-first matrimonial biodata and verified matchmaking platform crafted with trust, elegance, and zero telemarketing spam.',
    canonicalPath: '/about-us',
  },
  '/about-me': {
    title: 'About Us — Mission & Matchmaking Story | True Marriage',
    description: 'Learn about True Marriage, India’s modern privacy-first matrimonial biodata and verified matchmaking platform crafted with trust, elegance, and zero telemarketing spam.',
    canonicalPath: '/about-us',
  },
  '/team': {
    title: 'Meet the Team & Developers | True Marriage',
    description: 'Meet the engineers, designers, and contributors building True Marriage — India’s modern privacy-first matrimonial biodata and matchmaking platform.',
    canonicalPath: '/team',
  },
  '/meet-the-team': {
    title: 'Meet the Team & Developers | True Marriage',
    description: 'Meet the engineers, designers, and contributors building True Marriage — India’s modern privacy-first matrimonial biodata and matchmaking platform.',
    canonicalPath: '/team',
  },
};

// Dynamically register all 24 SEO landing pages for both /biodata/:slug and /:slug
Object.values(SEO_LANDING_PAGES).forEach((page) => {
  const meta: PageSEOMetadata = {
    title: page.title,
    description: page.description,
    canonicalPath: page.canonicalPath,
  };
  // Register under /biodata/:slug
  ROUTE_SEO[`/biodata/${page.slug}`] = meta;
  // Also register under top-level /:slug
  ROUTE_SEO[`/${page.slug}`] = meta;
});

export const updatePageSEO = (metadata: PageSEOMetadata) => {
  if (typeof document === 'undefined') return;

  // Title
  if (typeof window !== 'undefined') {
    (window as any).__intended_app_title__ = metadata.title;
  }
  document.title = metadata.title;

  // Meta Description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute('content', metadata.description);

  // OpenGraph Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', metadata.title);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', metadata.description);

  // Twitter Title & Description
  let twTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twTitle) {
    twTitle = document.createElement('meta');
    twTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twTitle);
  }
  twTitle.setAttribute('content', metadata.title);

  let twDesc = document.querySelector('meta[name="twitter:description"]');
  if (!twDesc) {
    twDesc = document.createElement('meta');
    twDesc.setAttribute('name', 'twitter:description');
    document.head.appendChild(twDesc);
  }
  twDesc.setAttribute('content', metadata.description);

  // Canonical URL
  if (metadata.canonicalPath) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://truemarriage.in${metadata.canonicalPath}`);
  }

  // Schema.org JSON-LD structured data injection
  const schemaId = 'tm-schema-ld-json';
  let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
  if (metadata.schema) {
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(metadata.schema);
  } else if (schemaScript) {
    schemaScript.remove();
  }
};
