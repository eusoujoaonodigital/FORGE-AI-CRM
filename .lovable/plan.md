

# Plano: Sistema Completo de Aceleração de Vendas

## Visão Geral

Transformar o dashboard atual em uma plataforma completa com 3 grandes módulos novos: **Landing Page Builder**, **Quiz Builder** e **CRM expandido**, todos integrados com analytics, pixel tracking e UTMs.

---

## 1. Banco de Dados — Novas Tabelas

**`landing_pages`** — Armazena cada landing page criada:
- `id`, `slug` (único), `title`, `is_published`, `meta_title`, `meta_description`
- `pixel_meta_id`, `pixel_google_id` — IDs de pixel por página
- `favicon_url`, `custom_css`, `created_by`, timestamps

**`landing_page_sections`** — Cada "dobra" de uma landing page:
- `id`, `page_id` (FK), `section_type` (hero, benefits, pricing, cta, testimonials, faq, features, gallery, contact_form, custom_html)
- `order` (posição), `config` (JSONB com todos os dados: textos, cores de fundo, cores de texto, tamanhos, botões, animação, ícones)
- `is_visible` (toggle on/off)

**`page_views`** — Analytics por página:
- `id`, `page_id`, `visitor_id`, `utm_source/medium/campaign/content/term`
- `referrer`, `user_agent`, `ip_hash`, `created_at`

Todas com RLS habilitado.

---

## 2. Dashboard — Nova Sidebar com Módulos

Sidebar expandida com seções:

```text
┌──────────────────────┐
│  CoWorkElite         │
├──────────────────────┤
│  📊 Pipeline CRM     │
│  👥 Leads            │
│  📅 Reservas         │
│  📈 Métricas         │
├──────────────────────┤
│  🌐 Landing Pages    │
│  📝 Quizzes          │
├──────────────────────┤
│  ⚙️ Configurações    │
│  🚪 Sair             │
└──────────────────────┘
```

---

## 3. Landing Page Builder (estilo Elementor)

### 3.1 Lista de Pages (`/dashboard` → aba "Landing Pages")
- Grid de cards mostrando cada landing page com preview thumbnail, slug, status (publicada/rascunho), acessos
- Botões: "Nova Landing Page", "Editar", "Duplicar", "Excluir"
- Link público: `/{slug}`

### 3.2 Editor Visual (`/dashboard/editor/:pageId`)
- **Painel esquerdo**: Lista de seções (drag para reordenar), botão "+ Adicionar Seção"
- **Centro**: Preview ao vivo da página
- **Painel direito**: Configurações da seção selecionada

### 3.3 Tipos de Seções Disponíveis (10+)
| Tipo | Campos editáveis |
|------|-----------------|
| Hero | Headline, subtitle, CTA text/url/color, badge, background color/gradient, animação |
| Benefits | Grid de cards com ícone, título, descrição, cor de fundo |
| Pricing | Planos com preços, features, botão CTA, highlight |
| CTA | Headline, description, botões, background |
| Testimonials | Cards com foto, nome, cargo, texto |
| FAQ | Accordion com perguntas e respostas |
| Features | Grid de features com ícone e texto |
| Gallery | Grid de imagens |
| Contact Form | Campos configuráveis que geram lead no CRM |
| Custom HTML | Bloco livre de conteúdo |

### 3.4 Editor de Propriedades por Seção
- **Cores**: Background (sólido, gradiente), cor do texto, cor de destaque
- **Tipografia**: Tamanho do heading (H1-H4), tamanho do body, font-weight
- **Botões**: Texto, URL/ação, variante (gold, outline, ghost), tamanho, border-radius
- **Animações**: fade-in, slide-up, slide-left, scale-in, none
- **Espaçamento**: Padding top/bottom

### 3.5 Analytics por Landing Page
- Total de acessos, acessos únicos, acessos por dia (gráfico)
- Breakdown por UTM source/medium/campaign
- Configuração de Pixel Meta e Google por página

### 3.6 Renderização Pública
- Rota dinâmica `/:slug` que carrega a landing page do Supabase
- Componente `<PageRenderer>` que renderiza cada seção baseado no `section_type` e `config`
- Auto-injeta pixel tracking e captura UTMs
- Registra `page_view` a cada acesso

---

## 4. Quiz Builder (no Dashboard)

### 4.1 Lista de Quizzes
- Cards com título, slug, respostas recebidas, status ativo/inativo
- Botões: "Novo Quiz", "Editar", "Copiar Link", "Ver Respostas"

### 4.2 Editor de Quiz
- Título, descrição, slug personalizado
- Lista de perguntas com drag-to-reorder
- Cada pergunta: texto, tipo (text/multiple_choice), opções editáveis
- Adicionar/remover perguntas inline
- Preview do quiz ao lado

### 4.3 Respostas do Quiz
- Tabela com lead name, email, respostas, UTMs, data
- Exportar para CSV (futuro)

---

## 5. CRM Expandido

- Remover a separação confusa "pipeline de leads" abaixo
- Botão global "Novo Lead" visível no topo do Kanban
- Botão "Nova Pipeline" para criar pipelines customizados além de vendas/retenção/onboarding
- Editar/renomear pipelines existentes
- Filtros por status, fonte, data

---

## 6. Arquitetura de Arquivos

```text
src/
├── pages/
│   ├── Dashboard.tsx          (sidebar expandida)
│   ├── PageEditor.tsx         (editor visual de LP)
│   └── PublicPage.tsx         (renderiza /:slug)
├── components/
│   ├── dashboard/
│   │   ├── CRMKanban.tsx      (expandido)
│   │   ├── LeadsList.tsx      (expandido)
│   │   ├── LandingPagesList.tsx
│   │   ├── QuizBuilder.tsx
│   │   ├── QuizList.tsx
│   │   └── PageAnalytics.tsx
│   └── page-builder/
│       ├── SectionList.tsx     (painel esquerdo)
│       ├── SectionPreview.tsx  (centro)
│       ├── SectionEditor.tsx   (painel direito)
│       ├── sections/           (renderers)
│       │   ├── HeroRenderer.tsx
│       │   ├── BenefitsRenderer.tsx
│       │   ├── PricingRenderer.tsx
│       │   ├── CTARenderer.tsx
│       │   ├── TestimonialsRenderer.tsx
│       │   ├── FAQRenderer.tsx
│       │   └── ...
│       └── AddSectionModal.tsx
```

---

## 7. Ordem de Execução (Lote Único)

1. **Migration SQL**: Criar tabelas `landing_pages`, `landing_page_sections`, `page_views` com RLS
2. **Dashboard expandido**: Nova sidebar com todas as abas
3. **Quiz Builder**: CRUD completo de quizzes no dashboard
4. **Landing Pages List**: Listar, criar, duplicar, excluir pages
5. **Page Builder/Editor**: Editor visual com seções editáveis
6. **Section Renderers**: Componentes para cada tipo de seção
7. **Public Page Renderer**: Rota `/:slug` com analytics tracking
8. **CRM melhorias**: Novo lead global, nova pipeline, filtros
9. **Page Analytics**: Dashboard de acessos por página

---

## Considerações Técnicas

- As configurações de cada seção são armazenadas como **JSONB** no Supabase, permitindo flexibilidade total sem migrations adicionais
- O editor usa estado local durante edição e salva no Supabase ao clicar "Salvar"
- A rota `/:slug` precisa verificar se o slug não conflita com rotas fixas (`/auth`, `/dashboard`, `/agendar`)
- Page views são inseridas via `anon` role (público) com RLS permitindo INSERT para todos
- O sistema de pixel é configurado por página individual

