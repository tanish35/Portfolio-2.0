export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tanish.site"
).replace(/\/$/, "");

export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

export const AUTHOR = "Tanish Majumdar";
export const ROLE = "Full-Stack Developer & AI Engineer";
