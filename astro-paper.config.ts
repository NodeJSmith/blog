import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jessicasmith.dev/",
    title: "Jessica Smith",
    description: "Notes on AI-assisted development, automation, and building things.",
    author: "Jessica Smith",
    profile: "https://github.com/NodeJSmith",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "America/Chicago",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/NodeJSmith" },
  ],
  shareLinks: [
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});