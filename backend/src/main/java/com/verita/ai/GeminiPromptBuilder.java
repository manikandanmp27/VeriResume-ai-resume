package com.verita.ai;

import com.verita.dto.content.ResumeContentDto;
import com.verita.entity.Resume;
import com.verita.entity.SourceFact;
import com.verita.util.JsonUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GeminiPromptBuilder {

    public String buildGenerateResumePrompt(Resume resume, ResumeContentDto content, List<SourceFact> facts, String targetRole) {
        String role = targetRole != null && !targetRole.isBlank()
                ? targetRole
                : (resume.getTargetRole() != null ? resume.getTargetRole() : "Software Professional");

        String factsList = facts.stream()
                .map(f -> "- [" + f.getCategory() + "] " + f.getRawText())
                .collect(Collectors.joining("\n"));

        return "You are Verita AI, an expert resume architect. Your goal is to transform the user's natural language input into high-impact, professional resume content.\n\n"
                + "CRITICAL ANTI-HALLUCINATION RULES (FACT LOCK):\n"
                + "1. You must ONLY use information provided in the SOURCE FACTS below.\n"
                + "2. DO NOT invent technologies, tools, companies, dates, degrees, metrics (e.g. \"improved by 40%\"), or job titles.\n"
                + "3. If metrics are not in the source facts, use qualitative action verbs (e.g. \"streamlined\", \"developed\", \"orchestrated\", \"engineered\") instead of fake percentages.\n"
                + "4. Organize skills into sensible categories (Languages, Frameworks, Tools, Databases, Concepts).\n"
                + "5. For each project and experience, generate 2-4 strong action-oriented bullet points adhering strictly to the user's stated role and tech stack.\n\n"
                + "TARGET ROLE: " + role + "\n\n"
                + "CURRENT STRUCTURED CONTENT:\n" + JsonUtils.toJson(content) + "\n\n"
                + "VERIFIED SOURCE FACTS:\n" + factsList + "\n\n"
                + """
                Respond with ONLY a valid JSON object adhering to this exact schema:
                {
                  "personalInfo": {
                    "fullName": "...",
                    "email": "...",
                    "phone": "...",
                    "location": "...",
                    "linkedin": "...",
                    "github": "...",
                    "portfolio": "...",
                    "professionalSummary": "..."
                  },
                  "education": [
                    {
                      "id": "...",
                      "institution": "...",
                      "degree": "...",
                      "fieldOfStudy": "...",
                      "startDate": "...",
                      "endDate": "...",
                      "gradeOrCgpa": "...",
                      "coursework": ["..."]
                    }
                  ],
                  "skills": [
                    {
                      "category": "Programming Languages",
                      "skills": ["..."]
                    }
                  ],
                  "projects": [
                    {
                      "id": "...",
                      "title": "...",
                      "role": "...",
                      "technologies": ["..."],
                      "naturalDescription": "...",
                      "bulletPoints": ["..."],
                      "link": "...",
                      "startDate": "...",
                      "endDate": "..."
                    }
                  ],
                  "experience": [
                    {
                      "id": "...",
                      "company": "...",
                      "position": "...",
                      "location": "...",
                      "startDate": "...",
                      "endDate": "...",
                      "current": false,
                      "naturalDescription": "...",
                      "bulletPoints": ["..."]
                    }
                  ],
                  "achievements": [
                    {
                      "id": "...",
                      "title": "...",
                      "issuer": "...",
                      "date": "...",
                      "description": "..."
                    }
                  ],
                  "certifications": [
                    {
                      "id": "...",
                      "name": "...",
                      "issuer": "...",
                      "issueDate": "...",
                      "expiryDate": "...",
                      "credentialUrl": "..."
                    }
                  ]
                }
                """;
    }

    public String buildImproveContentPrompt(String section, String currentText, String context, List<SourceFact> facts) {
        String factsList = facts.stream()
                .map(f -> "- " + f.getRawText())
                .collect(Collectors.joining("\n"));

        return "You are Verita AI Resume Improver.\n"
                + "Improve the following resume text for clarity, professional tone, conciseness, and action-oriented grammar.\n\n"
                + "STRICT GROUNDING:\n"
                + "- Do not change or invent factual details (technologies, metrics, companies, dates).\n"
                + "- Improve phrasing and strength of verbs while strictly preserving meaning.\n\n"
                + "SECTION: " + (section != null ? section : "") + "\n"
                + "CONTEXT: " + (context != null ? context : "") + "\n"
                + "ORIGINAL TEXT: " + (currentText != null ? currentText : "") + "\n\n"
                + "RELEVANT SOURCE FACTS:\n" + factsList + "\n\n"
                + """
                Respond with ONLY a JSON object:
                {
                  "originalText": "...",
                  "improvedText": "...",
                  "explanation": "..."
                }
                """;
    }

    public String buildJobAnalysisPrompt(String jobDescription, ResumeContentDto content, List<SourceFact> facts) {
        return "You are an expert technical recruiter and ATS parser. Analyze the given job description and compare it against the user's resume and source facts.\n\n"
                + "JOB DESCRIPTION:\n" + (jobDescription != null ? jobDescription : "") + "\n\n"
                + "CANDIDATE RESUME:\n" + JsonUtils.toJson(content) + "\n\n"
                + """
                Analyze the requirements and categorize them strictly into:
                - Supported Requirements (the candidate has verified background/experience for)
                - Missing Requirements (areas not supported by the candidate's resume/facts; note: this does not disqualify the candidate, just highlights gaps)

                Compute a reasonable match score (0-100) representing internal alignment.

                Respond ONLY with a JSON object:
                {
                  "jobTitle": "...",
                  "company": "...",
                  "importantSkills": ["..."],
                  "technologies": ["..."],
                  "qualifications": ["..."],
                  "requirements": ["..."],
                  "supportedRequirements": ["..."],
                  "missingRequirements": ["..."],
                  "matchScore": 75
                }
                """;
    }

    public String buildTailorResumePrompt(String jobDescription, ResumeContentDto originalContent, List<SourceFact> facts, String targetRole) {
        String factsList = facts.stream()
                .map(f -> "- " + f.getRawText())
                .collect(Collectors.joining("\n"));

        return "You are Verita AI Resume Tailor. Tailor the candidate's resume to align with the target job description while STRICTLY maintaining factual grounding.\n\n"
                + "RULES:\n"
                + "1. Emphasize matching skills, relevant project details, and keywords from the job description that the candidate ACTUALLY possesses.\n"
                + "2. Reorder skills and bullet points to highlight the most relevant achievements first.\n"
                + "3. DO NOT invent skills or experience that are not in the original resume or source facts.\n\n"
                + "TARGET JOB DESCRIPTION:\n" + (jobDescription != null ? jobDescription : "") + "\n\n"
                + "ORIGINAL RESUME CONTENT:\n" + JsonUtils.toJson(originalContent) + "\n\n"
                + "VERIFIED SOURCE FACTS:\n" + factsList + "\n\n"
                + """
                Respond with ONLY a JSON object:
                {
                  "tailoredContent": <Complete structured ResumeContentDto JSON matching original structure>,
                  "changeSummary": "Detailed summary of tailoring adjustments made and why",
                  "changes": [
                    {
                      "section": "...",
                      "itemTitle": "...",
                      "original": "...",
                      "tailored": "...",
                      "reason": "..."
                    }
                  ]
                }
                """;
    }

    public String buildAtsCheckPrompt(ResumeContentDto content) {
        return "You are an Applicant Tracking System (ATS) parsing simulator.\n"
                + "Simulate how a standard ATS parser extracts text, detects sections, and parses information from this resume structure.\n\n"
                + "RESUME CONTENT:\n" + JsonUtils.toJson(content) + "\n\n"
                + """
                Identify:
                - Detected sections (Contact, Education, Skills, Projects, Experience, Certifications, etc.)
                - Extracted skills list
                - Extracted education list
                - Extracted experience list
                - Potential formatting problems or parsing ambiguities (e.g. non-standard headings, missing dates, text density)
                - Formatting warnings
                - Missing recommended sections
                - An ATS Parsing Simulation Score (0-100)

                Respond ONLY with a JSON object:
                {
                  "extractedText": "Plain text extraction of the resume as seen by ATS",
                  "detectedSections": ["Contact Info", "Skills", "Projects", "Experience", "Education"],
                  "extractedSkills": ["..."],
                  "extractedEducation": ["..."],
                  "extractedExperience": ["..."],
                  "parsingScore": 92,
                  "formattingWarnings": ["..."],
                  "parsingProblems": ["..."],
                  "missingSections": ["..."]
                }
                """;
    }
}
