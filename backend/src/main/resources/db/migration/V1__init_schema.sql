-- Verita Schema Initialization V1

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    linkedin VARCHAR(500),
    github VARCHAR(500),
    portfolio VARCHAR(500),
    professional_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resumes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(255),
    selected_template VARCHAR(50) NOT NULL DEFAULT 'MODERN',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    content_json TEXT,
    current_version_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resume_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resume_versions (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    version_number INT NOT NULL,
    version_name VARCHAR(255) NOT NULL,
    version_type VARCHAR(50) NOT NULL DEFAULT 'ORIGINAL',
    content_json TEXT NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_version_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS source_facts (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL,
    raw_text TEXT NOT NULL,
    structured_fact TEXT,
    source_section VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fact_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    version_id VARCHAR(36),
    claim_text TEXT NOT NULL,
    section VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UNVERIFIED',
    justification TEXT,
    confidence_score DOUBLE PRECISION DEFAULT 1.0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_claim_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS claim_source_facts (
    claim_id VARCHAR(36) NOT NULL,
    fact_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (claim_id, fact_id),
    CONSTRAINT fk_csf_claim FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    CONSTRAINT fk_csf_fact FOREIGN KEY (fact_id) REFERENCES source_facts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_analyses (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    job_title VARCHAR(255),
    company VARCHAR(255),
    raw_job_description TEXT NOT NULL,
    important_skills TEXT,
    technologies TEXT,
    qualifications TEXT,
    requirements TEXT,
    supported_requirements TEXT,
    missing_requirements TEXT,
    match_score INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ats_analyses (
    id VARCHAR(36) PRIMARY KEY,
    resume_id VARCHAR(36) NOT NULL,
    version_id VARCHAR(36),
    extracted_text TEXT,
    detected_sections TEXT,
    extracted_skills TEXT,
    extracted_education TEXT,
    extracted_experience TEXT,
    parsing_score INT DEFAULT 100,
    formatting_warnings TEXT,
    parsing_problems TEXT,
    missing_sections TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ats_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_facts_resume_id ON source_facts(resume_id);
CREATE INDEX IF NOT EXISTS idx_claims_resume_id ON claims(resume_id);
