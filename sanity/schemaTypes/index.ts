import { certificationSchema } from "./certification";
import { eventSchema } from "./event";
import { projectSchema } from "./project";
import { siteSettingsSchema } from "./siteSettings";

export const schemaTypes = [siteSettingsSchema, projectSchema, certificationSchema, eventSchema];
