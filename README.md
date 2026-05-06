# automation

jbr-generator/
├── frontend/                   # Vite React
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProgramSelector.tsx   # dropdown acara
│   │   │   ├── InputForm.tsx         # tema + link berita
│   │   │   ├── BatchInput.tsx        # multi tema input
│   │   │   └── GenerateButton.tsx
│   │   ├── hooks/
│   │   │   └── useGenerate.ts        # handle API call + state
│   │   ├── types.ts
│   │   └── App.tsx
│   └── vite.config.ts
│
└── backend/                    # Bun + Elysia
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   │   ├── generate.ts     # POST /generate (single)
    │   │   ├── batch.ts        # POST /batch (multi)
    │   │   └── scrape.ts       # POST /scrape
    │   ├── services/
    │   │   ├── ai.ts           # prompt builder + Deepseek call
    │   │   ├── docx.ts         # build .docx dari JSON naskah
    │   │   ├── scraper.ts      # extract konten dari URL berita
    │   │   └── zip.ts          # zip semua .docx
    │   ├── templates/
    │   │   └── programs.ts     # config tiap program (nama, system prompt, dll)
    │   └── types.ts
    ├── .env
    └── package.json