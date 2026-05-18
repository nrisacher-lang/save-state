-- Seed connections data for all projects.
-- Run in Supabase SQL Editor after adding the connections column.
-- vault_path values follow the pattern used in Vaultwarden — update if yours differ.

UPDATE projects SET connections = '[
  {
    "service": "Supabase",
    "type": "database",
    "url": "https://supabase.com/dashboard/project/_/editor",
    "vault_path": "Understory / Supabase",
    "notes": "projects, features, purchase_events, kitchen recipes"
  },
  {
    "service": "Anthropic API",
    "type": "ai",
    "url": "https://console.anthropic.com/settings/keys",
    "vault_path": "Understory / Anthropic API",
    "notes": "companion chat, purchase classification, claude-sonnet-4-6"
  },
  {
    "service": "Vercel",
    "type": "hosting",
    "url": "https://vercel.com/dashboard",
    "vault_path": null,
    "notes": "dynamic SSR deployment, auto-deploy on push to main"
  },
  {
    "service": "Kroger API",
    "type": "api",
    "url": "https://developer.kroger.com",
    "vault_path": "Life Automation / Kroger API",
    "notes": "product search, price lookup, aisle data for kitchen module"
  },
  {
    "service": "n8n",
    "type": "automation",
    "url": "http://192.168.1.152:5678",
    "vault_path": "Taproot / Services",
    "notes": "background kitchen module workflows on CT 102"
  }
]'::jsonb
WHERE id = 'current-os';

UPDATE projects SET connections = '[
  {
    "service": "Supabase",
    "type": "database",
    "url": "https://supabase.com/dashboard/project/_/editor",
    "vault_path": "Understory / Supabase",
    "notes": "shared project with current-os — projects, features, wiki state tables"
  },
  {
    "service": "Vercel",
    "type": "hosting",
    "url": "https://vercel.com/dashboard",
    "vault_path": null,
    "notes": "dynamic SSR, auto-deploy via global git pre-push hook"
  }
]'::jsonb
WHERE id = 'save-state';

UPDATE projects SET connections = '[
  {
    "service": "Supabase",
    "type": "database",
    "url": "https://supabase.com/dashboard/project/_/editor",
    "vault_path": "Understory / Supabase",
    "notes": "shared with save-state — projects, wiki state, activity, release notes"
  },
  {
    "service": "Vercel",
    "type": "hosting",
    "url": "https://vercel.com/dashboard",
    "vault_path": null,
    "notes": "dynamic SSR deployment"
  }
]'::jsonb
WHERE id = 'understory-labs-site';

UPDATE projects SET connections = '[
  {
    "service": "Supabase",
    "type": "database",
    "url": "https://supabase.com/dashboard/project/_/editor",
    "vault_path": "Bud / App Secrets",
    "notes": "purchase_events table, inbox intelligence data"
  },
  {
    "service": "Anthropic API",
    "type": "ai",
    "url": "https://console.anthropic.com/settings/keys",
    "vault_path": "Understory / Anthropic API",
    "notes": "purchase classification, inbox parsing"
  },
  {
    "service": "Gmail OAuth",
    "type": "auth",
    "url": "https://console.cloud.google.com/apis/credentials",
    "vault_path": "Bud / Gmail OAuth",
    "notes": "Google Cloud project: life-dashboard-489004, Gmail read scope"
  },
  {
    "service": "n8n",
    "type": "automation",
    "url": "http://192.168.1.152:5678",
    "vault_path": "Taproot / Services",
    "notes": "Gmail monitoring workflow, purchase pipeline on CT 102"
  },
  {
    "service": "Docker",
    "type": "infra",
    "url": "http://192.168.1.153:8001",
    "vault_path": "Taproot / docker-host",
    "notes": "FastAPI container on docker-host CT 100, port 8001"
  }
]'::jsonb
WHERE id = 'bud';

UPDATE projects SET connections = '[
  {
    "service": "Discord API",
    "type": "api",
    "url": "https://discord.com/developers/applications",
    "vault_path": "Bark / Discord Bot",
    "notes": "bot token, application ID, guild ID for soundbite server"
  }
]'::jsonb
WHERE id = 'bark';

UPDATE projects SET connections = '[
  {
    "service": "Proxmox",
    "type": "infra",
    "url": null,
    "vault_path": "Taproot / Proxmox",
    "notes": "LXC host — root password and web UI credentials"
  },
  {
    "service": "Cloudflare",
    "type": "infra",
    "url": "https://dash.cloudflare.com",
    "vault_path": "Taproot / Cloudflare",
    "notes": "rootstack.dev domain, Tunnel tokens for public service routing"
  },
  {
    "service": "Vaultwarden",
    "type": "auth",
    "url": "https://vault.rootstack.dev",
    "vault_path": null,
    "notes": "self-hosted on CT 101, master password is the entry point"
  }
]'::jsonb
WHERE id = 'homelab';

UPDATE projects SET connections = '[
  {
    "service": "Supabase",
    "type": "database",
    "url": "https://supabase.com/dashboard/project/_/editor",
    "vault_path": "Lore / Supabase",
    "notes": "shared project database — schema TBD after repo assessment"
  },
  {
    "service": "Gitea",
    "type": "vcs",
    "url": null,
    "vault_path": "Lore / Gitea",
    "notes": "Nathan''s self-hosted Gitea — PRs require Nathan approval on master"
  }
]'::jsonb
WHERE id = 'lore';
