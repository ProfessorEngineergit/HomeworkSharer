# HomeworkSharer — iOS-ready, research-backed homework sharing and collaboration

HomeworkSharer is a platform for students and teachers to share, discuss, and collaboratively improve homework content for course groups. This repository contains the web-app (backend + frontend) and a starter iOS migration plan. This README has been expanded and grounded in educational research and platform-moderation literature so the design and product decisions are evidence-informed.

Why HomeworkSharer (motivation & research)
- Collaborative learning improves understanding, retention and problem solving when students actively engage with peers and receive formative feedback. Reviews and meta-analyses show consistent benefits of structured collaboration and peer interaction for learning outcomes and engagement (Laal & Ghodsi, 2012; Black & Wiliam, 1998) [1,2].
- Peer assessment and feedback accelerate learning when rubrics and scaffolds are provided; peer review can increase reflection and meta-cognition (Topping, 1998) [3].
- Social learning and scaffolded assistance (Bandura, Vygotsky) support the development of higher-order skills — features such as threaded comments, teacher annotations, and versioning align with these theories (Bandura, 1977; Vygotsky, 1978) [4,5].
- However, shared homework repositories introduce academic integrity risk (contract cheating, unauthorized distribution) and moderation needs. Studies of academic integrity and contract cheating underscore the need for assessment design, detection, and clear policy (Sutherland-Smith; Bretag) [6,7].
- Platform content-moderation research shows trade-offs between automated filtering and human review; successful systems often combine light automation (toxicity/profanity detection, safe-search) with human-in-the-loop moderation and reporting workflows (Gillespie; Jhaver et al.) [8,9].
- Design and UX decisions (mobile-first, progressive disclosure, accessible previews) should follow usability best-practices to reduce friction and cognitive load on learners (Norman; Nielsen Norman Group) [10,11].

Key takeaways applied to HomeworkSharer design
- Support small-group collaboration (class-based spaces) with teacher roles, and a single admin role for appeals/moderation.
- Provide structured workflows for peer review and teacher feedback (rubrics, inline comments, versioning) to increase the pedagogical value of uploads.
- Mitigate academic integrity risks: instrument reporting, logging, and teacher-facing tools; provide guidance in the UI about appropriate use and citation.
- Combine automated checks (file type and size validation, profanity filter, image safe-search) with human review and a transparent appeals process.
- Prioritize privacy and compliance: avoid unnecessary personal data, keep tokens in secure storage (Keychain on iOS), and prepare for GDPR/COPPA considerations in deployment.

Features (current and planned)
- User roles: student, teacher, admin (role-based UI and permissions).
- Class / Group management: join by code or invitation, teacher-managed rosters.
- File uploads: support images, PDF, common document formats; previews and thumbnails; metadata (descriptions, tags).
- Collaboration: comments on files, teacher annotations, version history, simple peer-review workflows.
- Moderation: user reporting, admin review queue, content removal, audit logs, and automated filters.
- Notifications: push notifications for comments, moderator actions, and teacher announcements.
- iOS migration: SwiftUI app scaffold, secure auth (Keychain), direct/S3 presigned uploads, QuickLook previews for documents.

Architecture & recommended tech (concise)
- Backend: keep existing API if robust; use object storage (S3/GCS/MinIO) with short-lived presigned URLs for uploads/downloads.
- Auth: JWT or OAuth2-compatible tokens; refresh token strategy; store tokens securely (Keychain for iOS).
- iOS client: Swift + SwiftUI (iOS 16+ recommended), async/await for networking, QuickLook and PDFKit for previews/annotations.
- Moderation pipeline: server-side automated filters (text & image), reporting queue, admin dashboard (web or admin-only iOS screens).
- Realtime: optional WebSocket or push notifications for comment/live updates; polling acceptable for MVP.

Data model (example)
- User { id, name, email, avatarUrl, role }
- Class { id, title, code, description, teachers[], students[] }
- HomeworkFile { id, classId, uploaderId, fileUrl, thumbnailUrl, mimeType, sizeBytes, description, metadata, createdAt, version }
- Comment { id, fileId, authorId, body, createdAt, resolvedBy, resolvedAt }
- Report { id, fileId, reporterId, reason, status, createdAt, adminId, actionTaken, notes }

Security, privacy, and legal (high level)
- Always use HTTPS and avoid sending sensitive data in URLs.
- Serve uploads via short-lived presigned URLs; validate file types and sizes server-side.
- Store authentication tokens in secure device storage (Keychain on iOS); use refresh tokens to limit exposure.
- Log moderation actions and keep audit trails for disputes.
- Prepare for GDPR and COPPA where applicable: data minimization, clear privacy policy, parental consent flows for minors, and data subject requests.
- Provide copyright & academic integrity guidance in-app and a DMCA / takedown flow for copyright holders.

Moderation strategy (evidence-informed)
- Prevent misuse with layered controls:
  - Client-side enforcement (file type/size checks, upload rate limits).
  - Automated server-side scanning: profanity filters for text, safe-search or vision APIs for images, hash-based duplicate detection.
  - Human-in-the-loop moderation: admin review queue for reported items, transparent actions, ability to restore or permanently remove content.
  - Reporting UX: easy-to-use report button with categorical reasons and optional evidence.
- Rationale: platform moderation research emphasizes that hybrid human+machine pipelines balance scale and contextual judgment (Gillespie; Jhaver et al.) [8,9].

Design and UX principles (research-aligned)
- Make collaboration visible: clear activity feeds and version history to support reflection and social learning (Bandura; Vygotsky).
- Reduce friction at upload: single action, clear progress with resumable uploads for large files.
- Clarify permissions and ownership: show who can view/download/share a file and provide an explicit “citation / allowed reuse” policy link.
- Accessibility: use dynamic type, VoiceOver labels, and sufficient color contrast.

Quickstart (developer)
1. Clone the repo:
   git clone https://github.com/ProfessorEngineergit/HomeworkSharer.git
2. Inspect backend API and config at /server (or equivalent). Confirm storage settings (local vs S3).
3. Configure environment variables for object storage, auth secret, and moderation API keys (if used).
4. Run the server and frontend locally for testing.
5. For iOS migration: start a SwiftUI app, wire the API endpoints, implement secure token storage in Keychain, and integrate presigned uploads or multipart endpoints.

iOS migration notes (practical)
- Implement auth first: login, refresh, secure storage.
- File upload flow: request presigned upload URL from API -> upload directly to object storage -> notify server when upload completes (server validates and records metadata).
- For previews: use QuickLook for docs and PDFKit for inline annotation by teachers.
- For collaboration: implement comments + push notifications; add teacher-only annotation features.
- Start with a TestFlight beta for class-based pilot testing and iterate based on teacher feedback.

Roadmap (MVP → v1)
- MVP: auth, classes, uploads, previews, comments, basic reporting, admin removal.
- v1: teacher annotations, peer-review workflow and rubrics, advanced moderation queue with analytics, push notifications, TestFlight pilot.
- v2+: offline support, resumable uploads, plagiarism/cheating detection signals, integrations with LMS (LTI), per-class analytics dashboards.

How to contribute
- Read CONTRIBUTING.md (if present) or file an issue describing your change.
- For UI or iOS contributions, open a feature branch and include screenshots and a short user-flow description in the PR.
- Add tests for new backend endpoints and API contract changes.

References (selected, seminal and practical)
1. Laal, M., & Ghodsi, S. M. (2012). Benefits of collaborative learning. Procedia — Social and Behavioral Sciences, 31, 486–490.  
2. Black, P., & Wiliam, D. (1998). Assessment and classroom learning. Assessment in Education: Principles, Policy & Practice, 5(1), 7–74.  
3. Topping, K. (1998). Peer assessment between students in colleges and universities. Review of Educational Research, 68(3), 249–276.  
4. Bandura, A. (1977). Social Learning Theory. Prentice Hall.  
5. Vygotsky, L. S. (1978). Mind in Society: The Development of Higher Psychological Processes. Harvard University Press.  
6. Sutherland-Smith, W. (2008). Plagiarism, the Internet and Student Learning: Improving Academic Integrity. Routledge.  
7. Bretag, T. (multiple works). Research on contract cheating and academic integrity — see the International Journal for Educational Integrity and Bretag et al. for systematic reviews.  
8. Gillespie, T. (2018). Custodians of the Internet: Platforms, Content Moderation, and the Hidden Decisions That Shape Social Media. Yale University Press.  
9. Jhaver, S., Birman, I., Gilbert, E., & Bruckman, A. (2019). Human–machine collaboration in content moderation: The case of Reddit automoderator. Proceedings of the ACM on Human-Computer Interaction, 3(CSCW), 1–25.  
10. Norman, D. A. (2013). The Design of Everyday Things (Revised and Expanded Edition). Basic Books.  
11. Nielsen Norman Group. Usability and mobile design guidance (articles). See https://www.nngroup.com/articles/ for practical heuristics.

Legal & Compliance resources
- GDPR overview: https://gdpr.eu/  
- COPPA (US children's privacy law): https://www.ftc.gov/tips-advice/business-center/privacy-and-security/children%27s-privacy

License
- (Select and state a license in LICENSE.md — MIT recommended for most open-source educational tools unless you require restrictions.)

Contact & next steps
- If you'd like, I can:
  - Produce an iOS-specific README and a SwiftUI starter that wires to your exact backend APIs (auth, file endpoints).
  - Audit the repository to map endpoints, storage configuration, and authentication so we can draft a migration PR.
  - Draft admin moderation UI screens and an OpenAPI spec for the backend to ensure smooth iOS integration.

Please tell me which you'd like me to do next and I will begin with a repo audit to produce concrete API mappings and a staged migration plan.
