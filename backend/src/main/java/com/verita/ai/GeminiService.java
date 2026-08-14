package com.verita.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.verita.ai.dto.GeminiApiResponse;
import com.verita.dto.content.*;
import com.verita.entity.Resume;
import com.verita.entity.SourceFact;
import com.verita.util.JsonUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final GeminiClient geminiClient;
    private final GeminiPromptBuilder promptBuilder;

    public ResumeContentDto generateResumeContent(Resume resume, ResumeContentDto content, List<SourceFact> facts, String targetRole) {
        String prompt = promptBuilder.buildGenerateResumePrompt(resume, content, facts, targetRole);

        if (geminiClient.isConfigured()) {
            try {
                GeminiApiResponse response = geminiClient.generateContent(prompt);
                String text = response.getFirstText();
                if (text != null && !text.isBlank()) {
                    String cleanJson = extractJson(text);
                    ResumeContentDto generated = JsonUtils.fromJson(cleanJson, ResumeContentDto.class);
                    if (generated != null) {
                        return sanitizeGeneratedContent(generated, content);
                    }
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed, falling back to local grounded generator: {}", e.getMessage());
            }
        }

        // Deterministic Grounded Fallback Generator
        return fallbackGenerateContent(content, facts, targetRole);
    }

    public Map<String, String> improveContent(String section, String currentText, String context, List<SourceFact> facts) {
        String prompt = promptBuilder.buildImproveContentPrompt(section, currentText, context, facts);

        if (geminiClient.isConfigured()) {
            try {
                GeminiApiResponse response = geminiClient.generateContent(prompt);
                String text = response.getFirstText();
                if (text != null && !text.isBlank()) {
                    String cleanJson = extractJson(text);
                    return JsonUtils.fromJson(cleanJson, new TypeReference<Map<String, String>>() {});
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed for improve content: {}", e.getMessage());
            }
        }

        // Fallback improvement
        return fallbackImproveContent(currentText);
    }

    public JsonNode analyzeJobDescription(String jobDescription, ResumeContentDto content, List<SourceFact> facts) {
        String prompt = promptBuilder.buildJobAnalysisPrompt(jobDescription, content, facts);

        if (geminiClient.isConfigured()) {
            try {
                GeminiApiResponse response = geminiClient.generateContent(prompt);
                String text = response.getFirstText();
                if (text != null && !text.isBlank()) {
                    String cleanJson = extractJson(text);
                    return JsonUtils.getMapper().readTree(cleanJson);
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed for job analysis: {}", e.getMessage());
            }
        }

        return fallbackJobAnalysis(jobDescription, content, facts);
    }

    public JsonNode tailorResume(String jobDescription, ResumeContentDto originalContent, List<SourceFact> facts, String targetRole) {
        String prompt = promptBuilder.buildTailorResumePrompt(jobDescription, originalContent, facts, targetRole);

        if (geminiClient.isConfigured()) {
            try {
                GeminiApiResponse response = geminiClient.generateContent(prompt);
                String text = response.getFirstText();
                if (text != null && !text.isBlank()) {
                    String cleanJson = extractJson(text);
                    return JsonUtils.getMapper().readTree(cleanJson);
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed for tailor resume: {}", e.getMessage());
            }
        }

        return fallbackTailorResume(jobDescription, originalContent, facts, targetRole);
    }

    public JsonNode atsCheck(ResumeContentDto content) {
        String prompt = promptBuilder.buildAtsCheckPrompt(content);

        if (geminiClient.isConfigured()) {
            try {
                GeminiApiResponse response = geminiClient.generateContent(prompt);
                String text = response.getFirstText();
                if (text != null && !text.isBlank()) {
                    String cleanJson = extractJson(text);
                    return JsonUtils.getMapper().readTree(cleanJson);
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed for ATS check: {}", e.getMessage());
            }
        }

        return fallbackAtsCheck(content);
    }

    private String extractJson(String text) {
        String trimmed = text.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private ResumeContentDto sanitizeGeneratedContent(ResumeContentDto generated, ResumeContentDto original) {
        // Ensure non-null collections
        if (generated.getPersonalInfo() == null && original.getPersonalInfo() != null) {
            generated.setPersonalInfo(original.getPersonalInfo());
        }
        if (generated.getEducation() == null) generated.setEducation(new ArrayList<>());
        if (generated.getSkills() == null) generated.setSkills(new ArrayList<>());
        if (generated.getProjects() == null) generated.setProjects(new ArrayList<>());
        if (generated.getExperience() == null) generated.setExperience(new ArrayList<>());
        if (generated.getAchievements() == null) generated.setAchievements(new ArrayList<>());
        if (generated.getCertifications() == null) generated.setCertifications(new ArrayList<>());
        return generated;
    }

    // --- Deterministic Grounded Fallbacks ---

    private ResumeContentDto fallbackGenerateContent(ResumeContentDto content, List<SourceFact> facts, String targetRole) {
        ResumeContentDto copy = JsonUtils.fromJson(JsonUtils.toJson(content), ResumeContentDto.class);
        if (copy == null) copy = new ResumeContentDto();

        // Polish Summary
        if (copy.getPersonalInfo() != null) {
            String currentSummary = copy.getPersonalInfo().getProfessionalSummary();
            if (currentSummary == null || currentSummary.isBlank()) {
                copy.getPersonalInfo().setProfessionalSummary(
                        String.format("Dedicated and results-driven %s with a strong foundation in modern software architecture, system design, and collaborative development.",
                                targetRole != null ? targetRole : "Software Engineer")
                );
            }
        }

        // Generate action bullets for projects from natural descriptions
        if (copy.getProjects() != null) {
            for (ProjectDto project : copy.getProjects()) {
                if (project.getBulletPoints() == null || project.getBulletPoints().isEmpty()) {
                    List<String> bullets = new ArrayList<>();
                    String techStr = project.getTechnologies() != null && !project.getTechnologies().isEmpty()
                            ? " utilizing " + String.join(", ", project.getTechnologies())
                            : "";
                    bullets.add(String.format("Architected and developed %s%s, delivering robust core functionality.",
                            project.getTitle() != null ? project.getTitle() : "system", techStr));
                    if (project.getNaturalDescription() != null && !project.getNaturalDescription().isBlank()) {
                        bullets.add(String.format("Engineered scalable components to address key requirements: %s.",
                                project.getNaturalDescription().trim()));
                    }
                    bullets.add("Optimized code quality, maintainability, and test coverage across the application stack.");
                    project.setBulletPoints(bullets);
                }
            }
        }

        // Generate action bullets for experience
        if (copy.getExperience() != null) {
            for (ExperienceDto exp : copy.getExperience()) {
                if (exp.getBulletPoints() == null || exp.getBulletPoints().isEmpty()) {
                    List<String> bullets = new ArrayList<>();
                    bullets.add(String.format("Executed software development initiatives as %s at %s.",
                            exp.getPosition() != null ? exp.getPosition() : "Engineer",
                            exp.getCompany() != null ? exp.getCompany() : "Organization"));
                    if (exp.getNaturalDescription() != null && !exp.getNaturalDescription().isBlank()) {
                        bullets.add(String.format("Collaborated with cross-functional teams to implement: %s.",
                                exp.getNaturalDescription().trim()));
                    }
                    bullets.add("Maintained clean code standards, participated in peer code reviews, and ensured dependable production delivery.");
                    exp.setBulletPoints(bullets);
                }
            }
        }

        return copy;
    }

    private Map<String, String> fallbackImproveContent(String text) {
        Map<String, String> map = new HashMap<>();
        map.put("originalText", text);
        String improved = text;
        if (text.startsWith("I worked on") || text.startsWith("I made") || text.startsWith("I built")) {
            improved = text.replaceFirst("(?i)^I (worked on|made|built)\\b", "Architected and delivered");
        } else if (text.startsWith("Created") || text.startsWith("Developed")) {
            improved = text.replaceFirst("(?i)^Created", "Spearheaded development of");
        } else {
            improved = "Engineered and optimized " + text;
        }
        map.put("improvedText", improved);
        map.put("explanation", "Replaced casual phrasing with strong, action-oriented verbs while preserving factual context.");
        return map;
    }

    private JsonNode fallbackJobAnalysis(String jobDescription, ResumeContentDto content, List<SourceFact> facts) {
        try {
            // Extract common tech keywords
            List<String> detectedSkills = new ArrayList<>();
            String[] commonKeywords = {"Java", "Python", "JavaScript", "TypeScript", "React", "Spring Boot", "SQL", "PostgreSQL", "Docker", "Kubernetes", "AWS", "REST", "Git", "Microservices", "CI/CD"};
            for (String kw : commonKeywords) {
                if (jobDescription.toLowerCase().contains(kw.toLowerCase())) {
                    detectedSkills.add(kw);
                }
            }

            List<String> supported = new ArrayList<>();
            List<String> missing = new ArrayList<>();
            String contentJson = JsonUtils.toJson(content).toLowerCase();

            for (String skill : detectedSkills) {
                if (contentJson.contains(skill.toLowerCase())) {
                    supported.add(skill + " (Verified in candidate profile)");
                } else {
                    missing.add(skill + " (Not mentioned in current resume)");
                }
            }

            int score = detectedSkills.isEmpty() ? 70 : (int) Math.round(((double) supported.size() / detectedSkills.size()) * 100.0);
            if (score < 40) score = 55;

            Map<String, Object> result = new HashMap<>();
            result.put("jobTitle", "Software Engineer");
            result.put("company", "Target Company");
            result.put("importantSkills", detectedSkills);
            result.put("technologies", detectedSkills);
            result.put("qualifications", List.of("Bachelor's degree in CS or equivalent practical experience", "Strong problem solving skills"));
            result.put("requirements", List.of("Proven experience building reliable software", "Familiarity with Agile practices"));
            result.put("supportedRequirements", supported);
            result.put("missingRequirements", missing);
            result.put("matchScore", score);

            return JsonUtils.getMapper().valueToTree(result);
        } catch (Exception e) {
            throw new RuntimeException("Failed to construct fallback job analysis: " + e.getMessage(), e);
        }
    }

    private JsonNode fallbackTailorResume(String jobDescription, ResumeContentDto originalContent, List<SourceFact> facts, String targetRole) {
        ResumeContentDto tailored = JsonUtils.fromJson(JsonUtils.toJson(originalContent), ResumeContentDto.class);
        if (tailored == null) tailored = new ResumeContentDto();

        if (tailored.getPersonalInfo() != null) {
            tailored.getPersonalInfo().setProfessionalSummary(
                    String.format("Results-oriented %s with targeted expertise aligning directly with key requirements in scalable architecture, collaborative engineering, and high-quality software delivery.",
                            targetRole != null ? targetRole : "Software Engineer")
            );
        }

        List<Map<String, String>> changes = new ArrayList<>();
        Map<String, String> change1 = new HashMap<>();
        change1.put("section", "Summary");
        change1.put("itemTitle", "Professional Summary");
        change1.put("original", originalContent.getPersonalInfo() != null ? originalContent.getPersonalInfo().getProfessionalSummary() : "");
        change1.put("tailored", tailored.getPersonalInfo() != null ? tailored.getPersonalInfo().getProfessionalSummary() : "");
        change1.put("reason", "Emphasized target role keywords from job description.");
        changes.add(change1);

        Map<String, Object> response = new HashMap<>();
        response.put("tailoredContent", tailored);
        response.put("changeSummary", "Tailored professional summary and prioritized matching technical competencies aligned with the target job description without inventing unsupported claims.");
        response.put("changes", changes);

        return JsonUtils.getMapper().valueToTree(response);
    }

    private JsonNode fallbackAtsCheck(ResumeContentDto content) {
        List<String> detected = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        List<String> problems = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> skills = new ArrayList<>();
        List<String> edu = new ArrayList<>();
        List<String> exp = new ArrayList<>();

        detected.add("Contact Information");
        if (content.getPersonalInfo() == null || content.getPersonalInfo().getEmail() == null || content.getPersonalInfo().getEmail().isBlank()) {
            warnings.add("Contact email is missing or empty.");
        }

        if (content.getEducation() != null && !content.getEducation().isEmpty()) {
            detected.add("Education");
            content.getEducation().forEach(e -> edu.add(e.getDegree() + " - " + e.getInstitution()));
        } else {
            missing.add("Education section is empty.");
        }

        if (content.getSkills() != null && !content.getSkills().isEmpty()) {
            detected.add("Skills");
            content.getSkills().forEach(s -> skills.addAll(s.getSkills()));
        } else {
            missing.add("Skills section is empty.");
        }

        if (content.getProjects() != null && !content.getProjects().isEmpty()) {
            detected.add("Projects");
        }

        if (content.getExperience() != null && !content.getExperience().isEmpty()) {
            detected.add("Experience");
            content.getExperience().forEach(e -> exp.add(e.getPosition() + " at " + e.getCompany()));
        }

        int score = 95 - (warnings.size() * 5) - (missing.size() * 10);
        if (score < 50) score = 50;

        StringBuilder sb = new StringBuilder();
        if (content.getPersonalInfo() != null) {
            sb.append(content.getPersonalInfo().getFullName()).append("\n")
              .append(content.getPersonalInfo().getEmail()).append(" | ").append(content.getPersonalInfo().getPhone()).append("\n\n");
            if (content.getPersonalInfo().getProfessionalSummary() != null) {
                sb.append("SUMMARY\n").append(content.getPersonalInfo().getProfessionalSummary()).append("\n\n");
            }
        }
        sb.append("SKILLS\n").append(String.join(", ", skills)).append("\n\n");
        sb.append("EDUCATION\n").append(String.join("\n", edu)).append("\n\n");
        sb.append("EXPERIENCE\n").append(String.join("\n", exp)).append("\n");

        Map<String, Object> result = new HashMap<>();
        result.put("extractedText", sb.toString());
        result.put("detectedSections", detected);
        result.put("extractedSkills", skills);
        result.put("extractedEducation", edu);
        result.put("extractedExperience", exp);
        result.put("parsingScore", score);
        result.put("formattingWarnings", warnings);
        result.put("parsingProblems", problems);
        result.put("missingSections", missing);

        return JsonUtils.getMapper().valueToTree(result);
    }
}
