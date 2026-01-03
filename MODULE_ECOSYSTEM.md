# Nexus Newsroom OS: Module Ecosystem

This document outlines the expansion modules available for the Nexus Newsroom OS. These modules are designed to be packaged as `.zip` files containing a `manifest.json` and loaded via the **Module Manager** in the admin dashboard.

## Module Manifest Structure
All modules must include a `manifest.json` file in the root of the .zip package.

```json
{
  "name": "module-id-slug",
  "version": "1.0.0",
  "description": "Short description.",
  "type": "worker-only | declarative | full",
  "permissions": ["network:outbound", "read:db"],
  "compatibility": { "core": ">=1.0.0" },
  "configSchema": {
    "type": "object",
    "properties": {
      "apiKey": { "type": "string", "format": "password" }
    }
  }
}
```

---

## Available Modules

### 1. WordPress Core Integrator (Standard)
* **Type:** `worker-only`
* **Objective:** Seamless synchronization between Nexus OS drafts and external WordPress installations.
* **Description:** The backbone of publishing. It connects via WP REST API to push content, sync categories, and handle featured media.
* **Functions:**
    *   Draft-to-Post conversion.
    *   Media library synchronization (uploading images from Nexus to WP).
    *   Category and Tag mapping.
    *   Canonical URL management for SEO.
* **Use Cases:**
    *   A journalist finishes a "Hot Trend" article and clicks "Publish". The module automatically formats the markdown to HTML and posts it to the corporate blog.

### 2. Social Syndicator X
* **Type:** `worker-only`
* **Objective:** Automate distribution of published content to social platforms (X/Twitter, LinkedIn).
* **Description:** Monitors the "Published" status of articles and automatically generates threads or posts based on the article summary.
* **Functions:**
    *   Auto-posting upon publication.
    *   Thread generation from H2 headers in the article.
    *   Hashtag optimization based on signal keywords.
* **Use Cases:**
    *   An article about "Quantum Computing" goes live. This module instantly posts a 5-part thread on X summarizing the key takeaways with a link back to the full article.

### 3. Fact-Check Pro (Deep Research)
* **Type:** `declarative`
* **Objective:** Enhance credibility by cross-referencing claims with academic and trusted sources.
* **Description:** An AI-agent wrapper that runs a secondary pass on "Draft" content, specifically looking for statistical claims and verifying them against the `arXiv` and `Google Scholar` signals.
* **Functions:**
    *   Highlight unverified claims.
    *   Suggest citations/footnotes.
    *   Flag potential hallucinations.
* **Use Cases:**
    *   Before publishing a financial guide, the editor runs this module. It flags a wrong percentage regarding inflation and suggests the correct official source.

### 4. Image Magic Studio
* **Type:** `full` (Requires UI)
* **Objective:** Generate SEO-optimized featured images and infographics without leaving the dashboard.
* **Description:** Integrates with Midjourney or DALL-E 3 APIs to create visuals based on the article content.
* **Functions:**
    *   Prompt generation from article summary.
    *   Style presets (e.g., "Editorial", "Minimalist", "Cyberpunk").
    *   Text-overlay generation for thumbnails.
* **Use Cases:**
    *   A "Guide to React" is written. The module generates a futuristic 16:9 header image featuring code snippets and a React logo style.

### 5. SEO Competitor Spy
* **Type:** `worker-only`
* **Objective:** Monitor SERP positions for the keywords detected in the Signal Feed.
* **Description:** Scans the top 10 results on Google for the target "Focus Keyword" and compares word count, readability, and schema usage.
* **Functions:**
    *   SERP Gap Analysis.
    *   Keyword density comparison.
    *   Content length recommendations.
* **Use Cases:**
    *   The "Signal Feed" suggests "AI Regulations". This module analyzes the top 3 current articles and tells the writer: "Competitors average 1,500 words; you need to write 2,000 to rank."

### 6. Newsletter Automator
* **Type:** `worker-only`
* **Objective:** Repurpose daily content into a digest format for email marketing.
* **Description:** Aggregates all articles published in the last 24h/7d and uses Gemini to write a cohesive newsletter introduction.
* **Functions:**
    *   Weekly/Daily digest generation.
    *   HTML email formatting.
    *   Integration with Mailchimp/SendGrid via API.
* **Use Cases:**
    *   On Friday at 5 PM, the module grabs the top 5 performing stories of the week and drafts a "Weekly Tech Roundup" for the newsletter subscribers.

### 7. Slack Newsroom Bot
* **Type:** `worker-only`
* **Objective:** Real-time team notifications for breaking signals.
* **Description:** Connects the "Hot Trends" signal feed to a specific Slack or Discord channel.
* **Functions:**
    *   Alerts when a signal score exceeds 80 (Viral).
    *   Notifications when content moves from "Draft" to "Review".
    *   Daily performance summaries.
* **Use Cases:**
    *   A "Red Alert" signal appears (Score 95). The bot pings the #breaking-news channel in Slack so the editorial team can react immediately.

### 8. Affiliate Link Injector
* **Type:** `declarative`
* **Objective:** Monetization of evergreen content.
* **Description:** Scans content for product names (e.g., "iPhone 15", "Hosting", "VPN") and automatically wraps them in configured affiliate links.
* **Functions:**
    *   Keyword-to-Link mapping database.
    *   Cloaking/Shortening links.
    *   Disclaimer injection at the top of the post.
* **Use Cases:**
    *   A guide on "Best Web Hosting" is written. The module automatically converts mentions of "Bluehost" and "AWS" into tracking links defined in the settings.

### 9. Nexus Video Studio
* **Type:** `full` (Requires UI)
* **Objective:** Short-form video production.
* **Description:** Uses Google Veo, Runway, or Sora to transform article highlights into engaging 9:16 vertical videos.
* **Functions:**
    *   Text-to-Video generation.
    *   Image-to-Video animation.
    *   Auto-captioning and Voiceover (TTS).
* **Use Cases:**
    *   A "Hot Trend" from TikTok is detected. This module takes the article summary and generates a 15-second animated explainer video for Reels.

### 10. Omni-Channel Broadcaster
* **Type:** `worker-only`
* **Objective:** Massive distribution.
* **Description:** Pushes content to Instagram, TikTok, Facebook Pages, LinkedIn, and Google My Business.
* **Functions:**
    *   Platform-specific formatting (Hashags, mentions).
    *   Scheduling offsets (e.g., post to LinkedIn at 9am, Instagram at 12pm).
    *   Media resizing for each platform.
* **Use Cases:**
    *   Upon publishing a "Review" article, this module pushes the featured image to Instagram Stories, the video summary to TikTok, and the link to LinkedIn/Facebook.
