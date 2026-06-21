import { defineField, defineType } from "sanity";

export const eventSchema = defineType({
  name: "event",
  title: "Tech Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: ["Conference", "Hackathon", "Meetup", "Workshop", "Talk", "Other"],
      },
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4 }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
    },
  },
});
