import { describe, expect, it } from 'vitest';
import { auditedProjects, techById, techStack } from './tech-stack';

describe('tech stack audit catalog', () => {
  it('covers every audited repository with an explanation and local logo mark', () => {
    expect(auditedProjects).toHaveLength(15);
    expect(new Set(auditedProjects.map((project) => project.id)).size).toBe(15);

    for (const project of auditedProjects) {
      expect(project.name.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(20);
      expect(project.techIds.length).toBeGreaterThan(0);
      expect(project.techIds.every((id) => techById(id))).toBe(true);
    }
  });

  it('keeps every technology card explainable and connected to a repository', () => {
    const projectIds = new Set(auditedProjects.map((project) => project.id));

    for (const entry of techStack) {
      expect(entry.mark.length).toBeGreaterThan(0);
      expect(entry.color).toMatch(/^#/);
      expect(entry.description.length).toBeGreaterThan(20);
      expect(entry.projects.length).toBeGreaterThan(0);
      expect(entry.projects.every((projectId) => projectIds.has(projectId))).toBe(true);
    }
  });
});
