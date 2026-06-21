import { defineField, defineType } from "sanity";

export const certificationSchema = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "issuer", title: "Issuer", type: "string" }),
    defineField({ name: "earnedOn", title: "Earned On", type: "date" }),
    defineField({ name: "verificationUrl", title: "Verification URL", type: "url" }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "issuer",
    },
  },
});
