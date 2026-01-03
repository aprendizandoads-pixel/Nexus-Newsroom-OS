import { Signal, SignalSource, Article, ContentStatus, SystemModule, ArticleType, AIProviderConfig } from './types';

export const MOCK_SIGNALS: Signal[] = [
  {
    id: 's-101',
    title: 'Quantum Computing Breakthrough in Error Correction',
    source: SignalSource.ARXIV,
    timestamp: '2023-10-27T08:30:00Z',
    score: {
      total: 82,
      searchDemand: 15,
      coverage: 20,
      social: 28,
      innovation: 10,
      seo: 9
    },
    summary: 'New paper suggests a 10x improvement in qubit stability using hexagonal lattice codes.',
    status: 'APPROVED',
    metadata: {
        views: '12k downloads',
        growth: '+15% citations',
        postedAt: '2 days ago',
        officialUrl: 'https://arxiv.org/abs/2310.xxxxx',
        rank: 3
    },
    analysis: {
      pros: ['High Authority Backlink Potential', 'First-mover advantage in niche'],
      cons: ['High technical complexity', 'Low general mass volume'],
      expectedResult: 'Top 3 ranking for "stable qubits" within 30 days',
      timeToResult: 'Medium Term (1-2 months)',
      originalUrl: 'https://arxiv.org/abs/2310.xxxxx'
    }
  },
  {
    id: 's-102',
    title: 'Viral: "Blue Screen" affecting global logistics',
    source: SignalSource.REDDIT,
    timestamp: '2023-10-27T09:15:00Z',
    score: {
      total: 95,
      searchDemand: 25,
      coverage: 25,
      social: 30,
      innovation: 5,
      seo: 10
    },
    summary: 'Massive outage reported across major shipping providers. Threads growing rapidly on r/sysadmin.',
    status: 'PROCESSING',
    metadata: {
        views: '45k upvotes',
        growth: '+400% (4h)',
        postedAt: '4 hours ago',
        officialUrl: 'https://reddit.com/r/sysadmin/comments/xxxx',
        rank: 1
    },
    analysis: {
      pros: ['Massive immediate search volume', 'High viral social sharing'],
      cons: ['Short lifespan (24-48h)', 'High competition'],
      expectedResult: '10k+ views in 24 hours',
      timeToResult: 'Instant (Hours)',
      originalUrl: 'https://reddit.com/r/sysadmin/comments/xxxx'
    }
  },
  {
    id: 's-103',
    title: 'New JS Framework "Velociraptor" trends on GitHub',
    source: SignalSource.GLIMPSE,
    timestamp: '2023-10-27T10:00:00Z',
    score: {
      total: 68,
      searchDemand: 18,
      coverage: 5,
      social: 25,
      innovation: 8,
      seo: 12
    },
    summary: 'A new zero-runtime overhead framework gaining stars rapidly.',
    status: 'PENDING',
    metadata: {
        views: '2.5k stars',
        growth: '+20% (Week)',
        postedAt: '2023-10-20',
        officialUrl: 'https://github.com/velociraptorjs',
        rank: 5
    },
    analysis: {
      pros: ['Developer audience engagement', 'Evergreen tutorial potential'],
      cons: ['Niche audience', 'Framework fatigue'],
      expectedResult: 'Steady organic traffic growth',
      timeToResult: 'Long Term (3-6 months)',
      originalUrl: 'https://github.com/velociraptorjs'
    }
  },
  {
    id: 's-104',
    title: 'DIY Smart Home Hack trends on TikTok',
    source: SignalSource.TIKTOK,
    timestamp: '2023-10-27T12:00:00Z',
    score: {
      total: 88,
      searchDemand: 22,
      coverage: 10,
      social: 30,
      innovation: 7,
      seo: 8
    },
    summary: 'Users are using cheap sensors to automate blinds. #smarthome tag spiking.',
    status: 'PENDING',
    metadata: {
        views: '12.5M views',
        growth: '+800% (24h)',
        postedAt: '6 hours ago',
        officialUrl: 'https://tiktok.com/tag/smarthome',
        rank: 2
    },
    analysis: {
      pros: ['Extremely high viral potential', 'Visual content opportunity'],
      cons: ['Low technical depth', 'Short trend lifecycle'],
      expectedResult: 'High social traffic burst',
      timeToResult: 'Instant',
      originalUrl: 'https://tiktok.com'
    }
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'a-201',
    title: 'Entenda a falha global de logística: O que sabemos',
    slug: 'entenda-falha-global-logistica',
    language: 'PT',
    type: ArticleType.NEWS,
    status: ContentStatus.PUBLISHED,
    publishDate: '2023-10-27T11:00:00Z',
    views: 12504,
    signalId: 's-102',
    content: '## O que aconteceu\n\nUma falha massiva em sistemas Windows afetou companhias aéreas e bancos...',
    excerpt: 'Apagão digital causa atrasos em voos e operações bancárias ao redor do mundo.',
    tags: ['Tecnologia', 'Crise', 'Windows'],
    metaTitle: 'Falha Global Windows: Impactos e Causas',
    focusKeyword: 'Falha Windows'
  },
  {
    id: 'a-202',
    title: 'Quantum Error Correction: A Deep Dive',
    slug: 'quantum-error-correction-deep-dive',
    language: 'EN',
    type: ArticleType.ANALYSIS,
    status: ContentStatus.REVIEW,
    views: 0,
    signalId: 's-101',
    content: '## The Breakthrough\n\nResearchers have demonstrated a new method for logical qubits...',
    excerpt: 'New hexagonal lattice codes could be the key to stable quantum computing.',
    tags: ['Quantum Computing', 'Physics', 'Research'],
    metaTitle: 'Quantum Error Correction Explained',
    focusKeyword: 'Quantum Error Correction'
  },
  {
    id: 'a-203',
    title: 'Velociraptor JS: Vale a pena aprender?',
    slug: 'velociraptor-js-vale-a-pena',
    language: 'PT',
    type: ArticleType.GUIDE,
    status: ContentStatus.DRAFT,
    views: 0,
    signalId: 's-103',
    content: '## Introdução\n\nMais um dia, mais um framework JavaScript. Mas o Velociraptor promete...',
    excerpt: 'Analisamos o novo framework que promete zero-runtime overhead.',
    tags: ['JavaScript', 'Frontend', 'DevTools'],
    metaTitle: 'Velociraptor JS: Review Completo',
    focusKeyword: 'Velociraptor JS'
  }
];

export const MOCK_MODULES: SystemModule[] = [
  {
    id: 'm-009',
    manifest: {
      name: 'nexus-video-studio',
      version: '1.0.0',
      description: 'AI Video production suite. Transform articles into short-form videos for TikTok/Reels.',
      type: 'full',
      permissions: ['read:content', 'write:media', 'network:outbound'],
      compatibility: { core: '>=1.5.0' },
      configSchema: {
        type: 'object',
        properties: {
          provider: { type: 'string', enum: ['Google Veo', 'Runway Gen-2', 'OpenAI Sora'], default: 'Google Veo' },
          apiKey: { type: 'string', format: 'password', description: 'API Key for the selected provider' },
          defaultDuration: { type: 'string', enum: ['5s', '10s', '30s', '60s'], default: '10s' },
          aspectRatio: { type: 'string', enum: ['9:16 (Vertical)', '16:9 (Landscape)', '1:1 (Square)'], default: '9:16 (Vertical)' },
          autoGenerateForViral: { type: 'boolean', default: false, description: 'Auto-generate video if Signal Score > 90' },
          includeVoiceover: { type: 'boolean', default: true, description: 'Generate TTS voiceover track' }
        },
        required: ['apiKey']
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-10-25'
  },
  {
    id: 'm-010',
    manifest: {
      name: 'omni-channel-broadcaster',
      version: '1.0.0',
      description: 'Master distribution node. Publishes content to Instagram, TikTok, Facebook, LinkedIn, and Google My Business.',
      type: 'worker-only',
      permissions: ['read:content', 'read:media', 'network:outbound'],
      compatibility: { core: '>=1.5.0' },
      configSchema: {
        type: 'object',
        properties: {
          instagramToken: { type: 'string', format: 'password', description: 'Instagram Graph API Token' },
          facebookPageToken: { type: 'string', format: 'password', description: 'Facebook Page Access Token' },
          tiktokAccessToken: { type: 'string', format: 'password', description: 'TikTok Business Access Token' },
          linkedinAccessToken: { type: 'string', format: 'password', description: 'LinkedIn OAuth Token' },
          gmbLocationId: { type: 'string', description: 'Google Business Profile Location ID' },
          publishDelayMinutes: { type: 'number', default: 5, description: 'Buffer time after main publish' },
          autoHashtags: { type: 'boolean', default: true, description: 'Generate platform-specific hashtags' }
        }
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-10-25',
    config: {
        publishDelayMinutes: 15,
        autoHashtags: true
    }
  },
  {
    id: 'm-001',
    manifest: {
      name: 'wordpress-core-integrator',
      version: '3.0.0',
      description: 'Advanced WP connection with Deep Analysis, DB Optimization, and Public Folder Scanning.',
      type: 'worker-only',
      permissions: ['read:fs', 'read:db', 'write:report', 'network:outbound'],
      compatibility: { core: '>=0.1.0' },
      configSchema: {
        type: 'object',
        properties: {
          wpUrl: { type: 'string', description: 'WordPress Site URL', default: '' },
          username: { type: 'string', description: 'Admin Username', default: '' },
          appPassword: { type: 'string', description: 'Application Password', format: 'password' },
          analysisMode: { type: 'string', description: 'Scan Depth', enum: ['Surface', 'Deep (Slow)', 'Real-time'], default: 'Deep (Slow)' },
          scanInterval: { type: 'string', description: 'Interval (Minutes)', default: '60' },
          autoFix: { type: 'boolean', description: 'Auto-apply critical fixes', default: false },
          generateReports: { type: 'boolean', description: 'Generate PDF Reports', default: true },
          databaseOptimization: { type: 'boolean', description: 'Clean Transients/Post Revisions', default: true }
        },
        required: ['wpUrl', 'username', 'appPassword']
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-09-15',
    config: {
      wpUrl: 'https://news.nexus-os.com',
      username: 'admin',
      analysisMode: 'Deep (Slow)',
      autoFix: false,
      generateReports: true,
      databaseOptimization: true
    }
  },
  {
    id: 'm-002',
    manifest: {
      name: 'social-syndicator-x',
      version: '1.2.0',
      description: 'Auto-generates threads for X and posts to LinkedIn upon publication.',
      type: 'worker-only',
      permissions: ['network:outbound', 'read:articles'],
      compatibility: { core: '>=1.0.0' },
      configSchema: {
        type: 'object',
        properties: {
          twitterApiKey: { type: 'string', format: 'password', description: 'X API Key' },
          linkedinClientId: { type: 'string', format: 'password', description: 'LinkedIn Client ID' },
          autoPost: { type: 'boolean', default: true, description: 'Post immediately after publishing' },
          hashtagCount: { type: 'string', default: '3', description: 'Max hashtags to append' }
        },
        required: ['twitterApiKey']
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-10-02',
    config: { autoPost: true, hashtagCount: '3' }
  },
  {
    id: 'm-003',
    manifest: {
      name: 'fact-check-pro',
      version: '0.9.beta',
      description: 'AI Agent that cross-references draft claims with arXiv and Google Scholar.',
      type: 'declarative',
      permissions: ['read:drafts', 'network:outbound', 'write:metadata'],
      compatibility: { core: '>=0.5.0' },
      configSchema: {
        type: 'object',
        properties: {
          strictMode: { type: 'boolean', default: false, description: 'Block publishing if claims fail check' },
          trustedSources: { type: 'string', default: 'arxiv.org, nature.com, reuters.com', description: 'Comma separated allowed domains' }
        }
      }
    },
    active: false,
    status: 'STOPPED',
    installedAt: '2023-10-05'
  },
  {
    id: 'm-004',
    manifest: {
      name: 'image-magic-studio',
      version: '2.1.0',
      description: 'Generates SEO-optimized featured images and infographics using Midjourney/DALL-E.',
      type: 'full',
      permissions: ['read:drafts', 'write:media', 'network:outbound'],
      compatibility: { core: '>=1.0.0' },
      configSchema: {
        type: 'object',
        properties: {
          provider: { type: 'string', enum: ['Midjourney', 'DALL-E 3'], default: 'DALL-E 3' },
          stylePreset: { type: 'string', enum: ['Photorealistic', 'Vector Art', 'Cyberpunk', 'Minimalist'], default: 'Photorealistic' },
          aspectRatio: { type: 'string', enum: ['16:9', '1:1', '4:3'], default: '16:9' }
        }
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-10-10'
  },
  {
    id: 'm-005',
    manifest: {
      name: 'seo-competitor-spy',
      version: '1.0.5',
      description: 'Analyzes top SERP results for focus keywords and suggests content gaps.',
      type: 'worker-only',
      permissions: ['network:outbound', 'read:drafts'],
      compatibility: { core: '>=1.0.0' },
      configSchema: {
        type: 'object',
        properties: {
            targetRegion: { type: 'string', enum: ['US', 'BR', 'UK', 'Global'], default: 'Global' },
            competitorCount: { type: 'string', default: '5', description: 'Number of results to analyze' }
        }
      }
    },
    active: false,
    status: 'STOPPED',
    installedAt: '2023-10-12'
  },
  {
    id: 'm-006',
    manifest: {
      name: 'newsletter-automator',
      version: '1.0.0',
      description: 'Compiles daily/weekly published content into a digest for email marketing.',
      type: 'worker-only',
      permissions: ['read:articles', 'network:outbound'],
      compatibility: { core: '>=1.1.0' },
      configSchema: {
          type: 'object',
          properties: {
              mailchimpApiKey: { type: 'string', format: 'password', description: 'Mailchimp API Key' },
              frequency: { type: 'string', enum: ["Daily", "Weekly"], default: 'Weekly' },
              subjectLineTemplate: { type: 'string', default: 'Nexus Tech Digest: {date}' }
          }
      }
    },
    active: false,
    status: 'STOPPED',
    installedAt: '2023-10-15'
  },
  {
    id: 'm-007',
    manifest: {
      name: 'slack-newsroom-bot',
      version: '1.0.0',
      description: 'Real-time alerts for viral signals (Score > 80) and breaking news.',
      type: 'worker-only',
      permissions: ['read:signals', 'network:outbound'],
      compatibility: { core: '>=0.1.0' },
      configSchema: {
          type: 'object',
          properties: {
              webhookUrl: { type: 'string', format: 'url', description: 'Slack Incoming Webhook URL' },
              alertThreshold: { type: 'string', default: '80', description: 'Min signal score to trigger alert' },
              channelName: { type: 'string', default: '#breaking', description: 'Target Channel' }
          }
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-10-18',
    config: {
        webhookUrl: 'https://hooks.slack.com/services/xxx/yyy',
        alertThreshold: '80',
        channelName: '#breaking'
    }
  },
  {
    id: 'm-008',
    manifest: {
      name: 'affiliate-link-injector',
      version: '1.5.0',
      description: 'Automatically injects affiliate tracking links into product mentions.',
      type: 'declarative',
      permissions: ['read:drafts', 'write:content'],
      compatibility: { core: '>=1.0.0' },
      configSchema: {
          type: 'object',
          properties: {
              amazonAssociateId: { type: 'string', description: 'Amazon Associate Tag' },
              disclaimerText: { type: 'string', default: 'This post contains affiliate links.' },
              autoLink: { type: 'boolean', default: true, description: 'Automatically link known keywords' }
          }
      }
    },
    active: true,
    status: 'RUNNING',
    installedAt: '2023-10-20'
  }
];

export const INITIAL_AI_CONFIGS: AIProviderConfig[] = [
    { id: 'ai-1', type: 'TEXT', name: 'Primary Article Generator', provider: 'Gemini', model: 'gemini-3-pro-preview', apiKey: '', active: true },
    { id: 'ai-2', type: 'RESEARCH', name: 'Deep Fact Checker', provider: 'OpenAI', model: 'gpt-4-turbo', apiKey: '', active: false },
    { id: 'ai-3', type: 'IMAGE', name: 'Featured Image Gen', provider: 'Midjourney', model: 'v6', apiKey: '', active: true },
    { id: 'ai-4', type: 'SEO', name: 'Keyword Analyzer', provider: 'Gemini', model: 'gemini-3-flash-preview', apiKey: '', active: true },
    { id: 'ai-5', type: 'CODE', name: 'Code Snippet Gen', provider: 'Anthropic', model: 'claude-3-opus', apiKey: '', active: false },
];