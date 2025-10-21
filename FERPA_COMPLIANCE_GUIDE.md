# 🛡️ FERPA COMPLIANCE GUIDE - Geographic Detective Academy

**Version:** 1.0  
**Last Updated:** October 20, 2025  
**Regulation:** Family Educational Rights and Privacy Act (FERPA) - 20 U.S.C. § 1232g  
**Status:** Production-ready compliance framework

---

## 📋 EXECUTIVE SUMMARY

### What is FERPA?
FERPA is a federal law that protects the privacy of student education records. Any educational technology used in schools must comply with FERPA regulations.

### FERPA Requirements for EdTech
1. **Parental Consent** - Parents must consent to data collection
2. **Limited Data Collection** - Collect only what's needed for education
3. **Secure Storage** - Protect student data with encryption
4. **Access Control** - Only authorized users can view student records
5. **Data Retention** - Delete data when no longer needed
6. **Third-Party Agreements** - Vendors must sign FERPA compliance agreements
7. **Breach Notification** - Report data breaches within required timeframes
8. **Audit Trails** - Track who accesses student data

### Your Current Status
- ✅ **localStorage only** - No server-side student data currently
- ⚠️ **SaaS requires compliance** - Must implement FERPA controls before school deployment
- ✅ **Architecture supports FERPA** - Supabase + Row Level Security = compliant

---

## 🎯 FERPA COMPLIANCE REQUIREMENTS

### 1. Education Records (Covered by FERPA)

#### What Geographic Detective Academy Stores:
| Data Type | FERPA Protected? | Why It Matters |
|-----------|------------------|----------------|
| Student name | ✅ YES | Personally identifiable |
| Username | ✅ YES | Can identify student |
| Age/Grade | ✅ YES | Educational context |
| Game progress | ✅ YES | Educational performance data |
| Achievement scores | ✅ YES | Academic performance indicator |
| Play time/session logs | ✅ YES | Attendance/engagement record |
| XP/scores | ✅ YES | Grading/assessment data |
| Geography quiz answers | ✅ YES | Test results |
| Teacher notes | ✅ YES | Educational assessments |

#### What is NOT Protected:
- ❌ Directory information (if publicly available)
- ❌ De-identified data (no way to identify student)
- ❌ Publicly available information

**Bottom Line:** Almost everything in your app is FERPA-protected education records.

---

### 2. Parental Rights Under FERPA

Parents have the right to:
1. **Inspect and review** their child's education records
2. **Request corrections** to inaccurate records
3. **Control disclosure** of personally identifiable information
4. **File complaints** with the Department of Education

#### Your Implementation:
```javascript
// Parent Dashboard - FERPA Required Features
const parentDashboard = {
  // 1. View all child data
  viewChildData: async (parentId, childId) => {
    // Show: game progress, achievements, play time, quiz results
    const data = await fetchAllChildData(childId);
    return data; // Full transparency
  },
  
  // 2. Export all child data (FERPA right to inspect)
  exportChildData: async (childId) => {
    const data = await fetchAllChildData(childId);
    return downloadJSON(data, `child_data_${childId}.json`);
  },
  
  // 3. Request data correction
  requestCorrection: async (childId, field, newValue, reason) => {
    await submitCorrectionRequest({
      childId,
      field,
      newValue,
      reason,
      status: 'pending'
    });
    // Teacher reviews and approves
  },
  
  // 4. Delete all child data (right to control disclosure)
  deleteChildAccount: async (childId) => {
    // PERMANENTLY delete all records
    await cascadeDelete(childId); // Removes from all tables
    await auditLog('FERPA_DELETION', { childId, timestamp: Date.now() });
  }
};
```

---

### 3. School Official Exception

#### When Can Teachers Access Student Data?
FERPA allows "school officials" to access student records if they have a "legitimate educational interest."

**Your app qualifies because:**
- ✅ Teacher is a school official
- ✅ Purpose is education (geography learning)
- ✅ Access is necessary to perform instructional duties
- ✅ School has written agreement with you (vendor)

#### Required Written Agreement:
Schools must have a **FERPA Compliance Agreement** with you stating:
1. You will use student data ONLY for educational purposes
2. You will not re-disclose data without consent
3. You will maintain security standards
4. You will delete data when no longer needed
5. You will allow parents to inspect records

---

### 4. Data Minimization

**FERPA Best Practice:** Collect only what's necessary for education.

#### What You NEED to Collect:
- ✅ Student name or username (identification)
- ✅ Age/grade (appropriate content)
- ✅ Game progress (educational assessment)
- ✅ Achievement data (learning outcomes)
- ✅ Play time (engagement tracking)

#### What You DON'T NEED:
- ❌ Email address (teacher has it)
- ❌ Phone number (not needed)
- ❌ Home address (not needed)
- ❌ Parent names (teacher has it)
- ❌ Social media profiles (not needed)
- ❌ Photo/video of student (not needed)
- ❌ Biometric data (not needed)

**Your Current Architecture:** Already complies! You don't collect unnecessary data.

---

### 5. Consent Requirements

#### Classroom/School Scenario (FERPA applies)
**Consent Pathway:**
1. School signs FERPA agreement with you (vendor)
2. School obtains parent consent (or uses school official exception)
3. Teacher creates student accounts
4. Students use app at school
5. Parents can access data via teacher

**No direct parent consent needed** if:
- ✅ School has agreement with you
- ✅ Teacher is creating accounts (school official)
- ✅ Use is for educational purposes
- ✅ Parents are notified and can opt-out

#### Family/Home Scenario (FERPA does NOT apply)
**Consent Pathway:**
1. Parent creates account
2. Parent adds child profiles
3. Parent is the consent provider
4. COPPA applies instead of FERPA

---

### 6. Security Requirements

FERPA requires "reasonable" security measures to protect student data.

#### Required Security Controls:

**A. Encryption**
```javascript
// Supabase provides encryption by default
// - Data at rest: AES-256 encryption
// - Data in transit: TLS 1.3
// - Database backups: Encrypted
```

**B. Access Control**
```sql
-- Row Level Security (RLS) - FERPA Compliance
-- Students can ONLY see their own data
CREATE POLICY "students_own_data" ON game_progress
  FOR SELECT
  USING (auth.uid() = profile_id);

-- Teachers can ONLY see their classroom
CREATE POLICY "teachers_own_classroom" ON game_progress
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles 
      WHERE account_id IN (
        SELECT id FROM accounts 
        WHERE owner_user_id = auth.uid()
      )
    )
  );

-- Parents can ONLY see their children
CREATE POLICY "parents_own_children" ON game_progress
  FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles 
      WHERE account_id IN (
        SELECT id FROM accounts 
        WHERE owner_user_id = auth.uid()
      )
    )
  );
```

**C. Authentication**
```javascript
// Strong authentication required
const authConfig = {
  passwordMinLength: 12,
  requireEmailVerification: true,
  sessionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
  mfaRequired: false, // Optional but recommended for teachers
};
```

**D. Audit Logging**
```sql
-- Track all access to student data (FERPA requirement)
CREATE TABLE ferpa_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'VIEW', 'EXPORT', 'EDIT', 'DELETE'
  student_profile_id UUID REFERENCES profiles(id),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_ferpa_audit_student ON ferpa_audit_log(student_profile_id);
CREATE INDEX idx_ferpa_audit_timestamp ON ferpa_audit_log(timestamp DESC);
```

---

### 7. Data Retention and Deletion

FERPA doesn't specify retention periods, but best practice is:

#### Retention Policy:
| Data Type | Retention Period | Reason |
|-----------|------------------|--------|
| Active student data | While enrolled + 1 year | Ongoing education |
| Archived student data | 3 years after graduation | Historical records |
| Audit logs | 7 years | Legal compliance |
| Deleted account data | 90 days in trash | Recovery period |
| After permanent deletion | 0 days | Complete removal |

#### Automated Deletion:
```javascript
// Scheduled cleanup (runs monthly)
async function cleanupOldData() {
  // 1. Delete students who haven't logged in for 2 years
  await supabase
    .from('profiles')
    .delete()
    .lt('last_played_at', twoYearsAgo);
  
  // 2. Permanently delete "trash" after 90 days
  await supabase
    .from('deleted_profiles')
    .delete()
    .lt('deleted_at', ninetyDaysAgo);
  
  // 3. Archive old audit logs to cold storage
  await archiveOldAuditLogs(sevenYearsAgo);
}
```

---

### 8. Third-Party Services (Subprocessors)

FERPA requires you to have agreements with ALL third-party services that handle student data.

#### Your Current Stack:
| Service | Handles Student Data? | FERPA Agreement Needed? | Status |
|---------|----------------------|------------------------|--------|
| Supabase | ✅ YES | ✅ YES | Available |
| Netlify | ✅ YES (serverless functions) | ✅ YES | Available |
| Stripe | ❌ NO (parent billing only) | ❌ NO | N/A |
| OpenWeatherMap | ❌ NO (location data only) | ❌ NO | N/A |
| Unsplash/Pexels | ❌ NO (public photos) | ❌ NO | N/A |
| OpenAI API | ⚠️ MAYBE (if student names sent) | ⚠️ MAYBE | Check usage |

#### Required Agreements:
1. **Supabase:** Sign Business Associate Agreement (BAA) equivalent
2. **Netlify:** Review Terms of Service for FERPA compliance
3. **OpenAI:** If sending student data → Need Data Processing Agreement (DPA)

**Action Item:** Review all API calls to ensure student names are NOT sent to AI services.

---

### 9. Breach Notification Requirements

If student data is compromised, you must:

#### Immediate Actions (24-48 hours):
1. **Contain the breach** - Stop unauthorized access
2. **Assess impact** - How many students affected?
3. **Notify affected schools** - Email/phone within 48 hours
4. **Document everything** - Timeline, scope, actions taken

#### Notification Requirements:
```javascript
// Breach notification template
const breachNotification = {
  to: ['school_principal@school.edu', 'teacher@school.edu'],
  subject: 'URGENT: Data Security Incident Notification',
  body: `
    Dear School Administrator,
    
    We are writing to inform you of a data security incident involving 
    Geographic Detective Academy that may have affected student information.
    
    INCIDENT DETAILS:
    - Date discovered: ${discoveryDate}
    - Nature of breach: ${breachType}
    - Students potentially affected: ${affectedCount}
    - Data types involved: ${dataTypes}
    - Current status: ${status}
    
    ACTIONS TAKEN:
    ${actionsTaken}
    
    RECOMMENDATIONS FOR SCHOOLS:
    ${schoolRecommendations}
    
    We take the privacy of student data extremely seriously and are 
    implementing additional safeguards to prevent future incidents.
    
    For questions, contact: security@yourapp.com
    
    Sincerely,
    [Your Name]
    Chief Privacy Officer
  `
};
```

#### Legal Requirements:
- **Federal:** Notify affected parties "without unreasonable delay"
- **State laws:** May require notification within 30-90 days
- **Documentation:** Keep records for 7 years

---

## 📄 REQUIRED LEGAL DOCUMENTS

### 1. School Service Agreement (FERPA Compliance)

**Template:**
```
FERPA COMPLIANCE AGREEMENT
Between [School Name] and Geographic Detective Academy

1. PURPOSE
   Geographic Detective Academy ("Provider") will provide educational 
   software services to [School Name] ("School").

2. FERPA COMPLIANCE
   Provider acknowledges that student data constitutes "education records" 
   under FERPA (20 U.S.C. § 1232g) and agrees to:
   
   a) Use student data ONLY for educational purposes
   b) Not re-disclose student data without School's written consent
   c) Maintain security standards equivalent to School's standards
   d) Allow parents to inspect and review student records
   e) Delete student data upon School's request
   f) Notify School of data breaches within 48 hours
   
3. DATA COLLECTION
   Provider will collect the following student data:
   - Student name or username
   - Age and grade level
   - Game progress and achievement data
   - Quiz results and scores
   - Play time and session logs
   
4. DATA SECURITY
   Provider will implement:
   - Encryption at rest and in transit (AES-256, TLS 1.3)
   - Role-based access control
   - Audit logging of all data access
   - Annual security audits
   
5. DATA RETENTION
   Student data will be retained while the student is enrolled, plus 
   one year. After this period, data will be permanently deleted unless 
   School requests otherwise.
   
6. TERMINATION
   Upon termination of services, Provider will:
   - Export all student data to School within 30 days
   - Permanently delete all student data within 90 days
   - Provide written confirmation of deletion
   
7. SUBPROCESSORS
   Provider uses the following third-party services:
   - Supabase (database hosting)
   - Netlify (application hosting)
   
   Provider certifies these subprocessors are FERPA-compliant.
   
8. PARENT RIGHTS
   Provider will honor all parent requests to:
   - Inspect student records (within 45 days)
   - Correct inaccurate records (within 30 days)
   - Delete student accounts (within 14 days)

Signed: ___________________ Date: ___________
[School Representative]

Signed: ___________________ Date: ___________
[Your Name], Geographic Detective Academy
```

---

### 2. Privacy Policy (Public-Facing)

**Key Sections:**
```markdown
# Privacy Policy - Geographic Detective Academy

## For Schools and Classrooms

### FERPA Compliance
We comply with the Family Educational Rights and Privacy Act (FERPA). 
Student data is used ONLY for educational purposes and is never sold 
or used for advertising.

### Data Collection
We collect:
- Student name or username (identification)
- Age/grade level (appropriate content)
- Game progress and scores (educational assessment)
- Play time (engagement tracking)

We do NOT collect:
- Email addresses
- Home addresses
- Phone numbers
- Photos or videos

### Parent Rights
Parents have the right to:
- View all data we have about their child
- Request corrections to inaccurate data
- Delete their child's account at any time
- Export all data in machine-readable format

Contact: privacy@yourapp.com

### Data Security
- All data encrypted at rest and in transit
- Access limited to authorized school officials
- Regular security audits
- Breach notification within 48 hours

### Data Retention
- Active students: Retained while enrolled + 1 year
- Deleted accounts: Permanently removed within 90 days
- Audit logs: Retained for 7 years

### Third-Party Services
We use:
- Supabase (database hosting) - FERPA compliant
- Netlify (application hosting) - FERPA compliant

We do NOT share student data with advertisers or marketers.
```

---

### 3. Teacher Terms of Service

**Key Clauses:**
```markdown
# Terms of Service - Teachers

By using Geographic Detective Academy, you agree to:

1. FERPA COMPLIANCE
   - You are responsible for obtaining appropriate consent from your 
     school and parents before creating student accounts
   - You will not share student data with unauthorized parties
   - You will use student data only for educational purposes

2. STUDENT DATA PROTECTION
   - You will create secure usernames that do not reveal 
     personally identifiable information (e.g., "student_001" 
     not "john_smith")
   - You will keep login credentials secure
   - You will notify us immediately of any data breach

3. ACCOUNT CREATION
   - You certify you have authority to create student accounts
   - You have obtained necessary parental consent
   - You understand you are a "school official" under FERPA

4. DATA ACCESS
   - You may only access data for students in your classroom
   - You will not share student passwords
   - You will log out when finished

5. DATA DELETION
   - You can delete student accounts at any time
   - You understand deletion is permanent after 90 days
   - You will export data before deletion if needed
```

---

## 🎯 IMPLEMENTATION CHECKLIST

### Phase 1: Legal Documents (1-2 hours)
- [ ] Customize School Service Agreement template
- [ ] Write comprehensive Privacy Policy
- [ ] Create Teacher Terms of Service
- [ ] Review with education lawyer (recommended)

### Phase 2: Technical Implementation (8-10 hours)
- [ ] Implement Row Level Security (RLS) in Supabase
- [ ] Create FERPA audit logging system
- [ ] Build parent data export feature
- [ ] Implement data deletion workflows
- [ ] Add consent tracking system

### Phase 3: Third-Party Agreements (2-4 hours)
- [ ] Sign Supabase Business Associate Agreement
- [ ] Review Netlify FERPA compliance
- [ ] Audit all API calls for student data leakage
- [ ] Document all subprocessors

### Phase 4: Security Audit (4-6 hours)
- [ ] Penetration testing (optional but recommended)
- [ ] Security checklist review
- [ ] Incident response plan
- [ ] Staff training on FERPA requirements

### Phase 5: Documentation (2-3 hours)
- [ ] Create teacher onboarding guide
- [ ] FERPA FAQ for schools
- [ ] Parent information sheet
- [ ] Data breach response procedures

**Total Time:** 17-25 hours

---

## 🔒 FERPA-COMPLIANT DATABASE SCHEMA

### Updated Tables with FERPA Controls:

```sql
-- Add FERPA-specific fields to accounts table
ALTER TABLE accounts ADD COLUMN ferpa_agreement_signed BOOLEAN DEFAULT false;
ALTER TABLE accounts ADD COLUMN ferpa_agreement_date TIMESTAMPTZ;
ALTER TABLE accounts ADD COLUMN school_name TEXT;
ALTER TABLE accounts ADD COLUMN school_contact_email TEXT;

-- Add consent tracking to profiles
ALTER TABLE profiles ADD COLUMN parent_consent_obtained BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN parent_consent_date TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN opt_out BOOLEAN DEFAULT false;

-- FERPA audit log (required)
CREATE TABLE ferpa_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'VIEW', 'EXPORT', 'EDIT', 'DELETE'
  student_profile_id UUID REFERENCES profiles(id),
  data_accessed TEXT, -- What data was viewed
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Data correction requests (FERPA right to amend)
CREATE TABLE data_correction_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  parent_user_id UUID REFERENCES auth.users(id),
  field_to_correct TEXT,
  current_value TEXT,
  requested_value TEXT,
  reason TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data export requests (FERPA right to inspect)
CREATE TABLE data_export_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  requester_user_id UUID REFERENCES auth.users(id),
  export_url TEXT, -- S3/Supabase Storage URL
  status TEXT CHECK (status IN ('pending', 'completed', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Soft delete (90-day recovery period)
CREATE TABLE deleted_profiles (
  id UUID PRIMARY KEY,
  profile_data JSONB, -- Full profile backup
  game_progress_data JSONB, -- Full progress backup
  deleted_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ DEFAULT NOW(),
  permanent_deletion_at TIMESTAMPTZ -- deleted_at + 90 days
);
```

---

## 🚨 COMMON FERPA VIOLATIONS TO AVOID

### ❌ DON'T DO THIS:
1. **Public Leaderboards with Names**
   - ❌ "Top Scorers: 1. Emma S. (450 XP), 2. Liam R. (420 XP)"
   - ✅ "Top Scorers: 1. Student A (450 XP), 2. Student B (420 XP)"
   - Or: Only show leaderboard to teacher

2. **Sharing Progress with Other Parents**
   - ❌ "Your child is in the bottom 25% of the class"
   - ✅ "Your child has completed 15 of 20 challenges"

3. **Displaying Student Work Publicly**
   - ❌ Publishing student-created maps without consent
   - ✅ Only show to teacher, require opt-in for public display

4. **Emailing Student Data**
   - ❌ Sending unencrypted emails with student scores
   - ✅ Send secure links to password-protected dashboard

5. **Storing Data Indefinitely**
   - ❌ Keeping student data forever "just in case"
   - ✅ Delete after retention period expires

6. **Weak Security**
   - ❌ Simple passwords like "password123"
   - ✅ Enforce strong passwords (12+ characters)

7. **No Audit Trail**
   - ❌ No record of who accessed student data
   - ✅ Log every access with timestamp and user

---

## 📊 FERPA COMPLIANCE DASHBOARD

### Required Teacher Dashboard Features:

```javascript
// FERPA-compliant teacher dashboard
const teacherDashboard = {
  // 1. View FERPA agreement status
  ferpaStatus: {
    agreementSigned: true,
    signedDate: '2025-10-15',
    schoolName: 'Alaska Middle School',
    contactEmail: 'principal@alaskaschool.edu'
  },
  
  // 2. Student consent tracking
  studentConsent: [
    { studentId: '001', name: 'Emma', consentObtained: true, date: '2025-09-01' },
    { studentId: '002', name: 'Liam', consentObtained: true, date: '2025-09-01' },
    { studentId: '003', name: 'Sofia', consentObtained: false, date: null } // Cannot use app
  ],
  
  // 3. Data access log (last 30 days)
  accessLog: [
    { date: '2025-10-20', user: 'Teacher Smith', action: 'Viewed class progress', studentCount: 15 },
    { date: '2025-10-19', user: 'Parent Jones', action: 'Exported Emma data', studentCount: 1 }
  ],
  
  // 4. Parent requests
  parentRequests: [
    { type: 'Data Export', student: 'Emma', status: 'Completed', date: '2025-10-19' },
    { type: 'Data Correction', student: 'Liam', status: 'Pending', date: '2025-10-18' }
  ],
  
  // 5. Quick actions
  actions: {
    exportAllData: () => {},
    deleteStudent: (studentId) => {},
    respondToRequest: (requestId) => {}
  }
};
```

---

## ✅ FERPA CERTIFICATION CHECKLIST

Before deploying to schools, verify:

### Legal Compliance
- [ ] School Service Agreement signed
- [ ] Privacy Policy published and linked
- [ ] Teacher Terms of Service accepted
- [ ] Subprocessor agreements obtained

### Technical Security
- [ ] Encryption at rest (AES-256)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Row Level Security (RLS) enabled
- [ ] Audit logging implemented
- [ ] Session management secure

### Parental Rights
- [ ] Data export feature working
- [ ] Data deletion feature working
- [ ] Correction request system implemented
- [ ] Parent dashboard accessible

### Data Minimization
- [ ] Only collecting necessary data
- [ ] No unnecessary PII collected
- [ ] Student names optional/pseudonymous
- [ ] No behavioral tracking for ads

### Retention & Deletion
- [ ] Retention policy documented
- [ ] Automated cleanup scheduled
- [ ] Soft delete with 90-day recovery
- [ ] Permanent deletion confirmed

### Breach Response
- [ ] Incident response plan documented
- [ ] Notification templates prepared
- [ ] Contact list maintained
- [ ] Timeline procedures clear

---

## 📞 SUPPORT & RESOURCES

### FERPA Resources
- **Official Guide:** https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html
- **School Official Exception:** https://studentprivacy.ed.gov/faq/faqs-school-officials
- **EdTech Guidance:** https://studentprivacy.ed.gov/technology

### Compliance Support
- **Privacy Officer Contact:** privacy@yourapp.com
- **Security Issues:** security@yourapp.com
- **FERPA Questions:** ferpa@yourapp.com

### Regular Updates
- Quarterly FERPA compliance review
- Annual security audit
- Ongoing staff training
- Policy updates as regulations change

---

## 🎯 NEXT STEPS

### This Week
1. Review this FERPA guide completely
2. Customize School Service Agreement template
3. Draft Privacy Policy
4. Identify which API calls might send student data

### Next Week
1. Implement FERPA audit logging
2. Add consent tracking to database
3. Build data export feature
4. Create teacher dashboard for FERPA compliance

### Before School Deployment
1. Sign agreements with Supabase and Netlify
2. Have education lawyer review documents
3. Train teachers on FERPA requirements
4. Test all compliance features

---

**You are now ready to build a 100% FERPA-compliant educational application.** 🛡️

**Questions about FERPA compliance? Need help with implementation?** Let me know!
