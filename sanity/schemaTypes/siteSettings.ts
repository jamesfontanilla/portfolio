import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4 }),
    defineField({ name: "intro", title: "Status", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "availability", title: "Availability", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "phoneNumber", title: "Phone Number", type: "string" }),
    defineField({ name: "githubUrl", title: "GitHub URL", type: "url" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "xUrl", title: "X URL", type: "url" }),
    defineField({ name: "threadsUrl", title: "Threads URL", type: "url" }),
    defineField({ name: "resumeUrl", title: "Resume URL", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
    },
  },
});
