import type { AppLanguage } from './i18n-store';

type Dict = Record<string, Record<AppLanguage, string>>;

export const dictionaries = {
    // ─── Common / Shared ─────────────────────────────────────────────────
    'common.appName': { vi: 'Snote', en: 'Snote' },
    'common.appTagline': {
        vi: 'Workspace cuộc họp với AI',
        en: 'AI meeting workspace',
    },
    'common.loading': { vi: 'Đang tải...', en: 'Loading...' },
    'common.retry': { vi: 'Thử lại', en: 'Retry' },
    'common.cancel': { vi: 'Hủy', en: 'Cancel' },
    'common.save': { vi: 'Lưu', en: 'Save' },
    'common.delete': { vi: 'Xóa', en: 'Delete' },
    'common.edit': { vi: 'Chỉnh sửa', en: 'Edit' },
    'common.open': { vi: 'Mở', en: 'Open' },
    'common.close': { vi: 'Đóng', en: 'Close' },
    'common.search': { vi: 'Tìm kiếm', en: 'Search' },
    'common.backToSnote': { vi: 'Quay lại Snote', en: 'Back to Snote' },
    'common.comingSoon': {
        vi: 'Tính năng này sẽ được mở sau khi backend hoàn thiện.',
        en: 'This feature will be available after backend completion.',
    },
    'common.viewAll': { vi: 'Xem tất cả', en: 'View all' },
    'common.noDescription': { vi: 'Chưa có mô tả', en: 'No description' },
    'common.skip': { vi: 'Bỏ qua', en: 'Skip' },
    'common.start': { vi: 'Bắt đầu', en: 'Start' },

    // ─── Navigation ──────────────────────────────────────────────────────
    'nav.dashboard': { vi: 'Tổng quan', en: 'Dashboard' },
    'nav.meetings': { vi: 'Cuộc họp', en: 'Meetings' },
    'nav.tasks': { vi: 'Công việc', en: 'Tasks' },
    'nav.calendar': { vi: 'Lịch', en: 'Calendar' },
    'nav.billing': { vi: 'Gói dịch vụ', en: 'Billing' },
    'nav.profile': { vi: 'Hồ sơ', en: 'Profile' },
    'nav.admin': { vi: 'Quản trị', en: 'Admin' },
    'nav.quickGuide': { vi: 'Hướng dẫn nhanh', en: 'Quick guide' },
    'nav.logout': { vi: 'Đăng xuất', en: 'Log out' },
    'nav.openMenu': { vi: 'Mở menu', en: 'Open menu' },
    'nav.closeMenu': { vi: 'Đóng menu', en: 'Close menu' },

    // ─── Roles ───────────────────────────────────────────────────────────
    'role.admin': { vi: 'Quản trị', en: 'Admin' },
    'role.pro': { vi: 'Thành viên', en: 'Member' },
    'role.active': { vi: 'Đang hoạt động', en: 'Active' },
    'role.adminAccount': {
        vi: 'Tài khoản quản trị đang hoạt động',
        en: 'Admin account active',
    },
    'role.activeAccount': {
        vi: 'Tài khoản đang hoạt động',
        en: 'Account active',
    },

    // ─── Landing — Navbar ────────────────────────────────────────────────
    'landing.nav.product': { vi: 'Sản phẩm', en: 'Product' },
    'landing.nav.workflow': { vi: 'Quy trình', en: 'Workflow' },
    'landing.nav.references': { vi: 'Nguồn tham chiếu', en: 'References' },
    'landing.nav.pricing': { vi: 'Gói dịch vụ', en: 'Pricing' },
    'landing.nav.login': { vi: 'Đăng nhập', en: 'Log in' },
    'landing.nav.openApp': { vi: 'Mở ứng dụng', en: 'Open app' },

    // ─── Landing — Hero ──────────────────────────────────────────────────
    'hero.badge': {
        vi: 'Workspace cuộc họp với AI',
        en: 'AI meeting workspace',
    },
    'hero.title.line1': {
        vi: 'Ghi âm cuộc họp, tạo transcript',
        en: 'Record meetings, generate transcripts,',
    },
    'hero.title.line2': {
        vi: 'và hỏi AI trong một workspace.',
        en: 'and ask AI in one workspace.',
    },
    'hero.subtitle': {
        vi: 'Snote có thể nhận audio WebM qua WebSocket, lưu lại audio cuộc họp, sau đó tạo transcript, chat theo ngữ cảnh và sinh task từ nội dung đã ghi.',
        en: 'Snote can receive WebM audio through WebSocket, store the meeting audio, then generate transcripts, contextual AI answers, and action items.',
    },
    'hero.cta.primary': {
        vi: 'Bắt đầu ghi âm cuộc họp',
        en: 'Start recording',
    },
    'hero.cta.secondary': {
        vi: 'Xem dự án của tôi',
        en: 'View my projects',
    },

    // ─── Landing — Workflow ──────────────────────────────────────────────
    'workflow.label': { vi: 'Quy trình', en: 'Workflow' },
    'workflow.title': {
        vi: 'Từ ghi âm tới nội dung có thể kiểm chứng trong bốn bước.',
        en: 'From recording to verifiable content in four steps.',
    },
    'workflow.subtitle': {
        vi: 'Quy trình tập trung, rõ nơi ghi âm, xem transcript và kiểm tra nguồn.',
        en: 'A focused workflow — clear where to record, view transcripts, and verify sources.',
    },
    'workflow.step1.title': { vi: 'Ghi âm audio', en: 'Record audio' },
    'workflow.step1.desc': {
        vi: 'Ghi âm cuộc họp trực tiếp qua WebSocket hoặc tải file audio lên dự án.',
        en: 'Record meetings live via WebSocket or upload audio files to a project.',
    },
    'workflow.step2.title': { vi: 'Tạo transcript', en: 'Generate transcript' },
    'workflow.step2.desc': {
        vi: 'Nhận transcript có mốc thời gian và phân đoạn theo người nói.',
        en: 'Get timestamped transcripts segmented by speaker.',
    },
    'workflow.step3.title': {
        vi: 'Hỏi AI theo transcript',
        en: 'Ask AI with transcript context',
    },
    'workflow.step3.desc': {
        vi: 'Hỏi tự nhiên trên transcript về quyết định, điểm nghẽn hoặc việc cần làm.',
        en: 'Ask natural questions about decisions, blockers, or action items from the transcript.',
    },
    'workflow.step4.title': {
        vi: 'Sinh task hành động',
        en: 'Create action items',
    },
    'workflow.step4.desc': {
        vi: 'Tạo danh sách công việc từ nội dung cuộc họp, sắp xếp theo ưu tiên.',
        en: 'Generate task lists from meeting content, sorted by priority.',
    },

    // ─── Landing — Grounded Answers ──────────────────────────────────────
    'grounded.label': { vi: 'Nguồn tham chiếu', en: 'References' },
    'grounded.title': {
        vi: 'AI trả lời kèm căn cứ.',
        en: 'AI answers with evidence.',
    },
    'grounded.subtitle': {
        vi: 'Không chỉ tóm tắt. Mỗi câu trả lời có thể truy về đoạn transcript có mốc thời gian để bạn kiểm chứng.',
        en: 'Not just summaries. Every answer can be traced back to a timestamped transcript segment for verification.',
    },
    'grounded.card1.title': {
        vi: 'Câu trả lời có nguồn',
        en: 'Sourced answers',
    },
    'grounded.card1.desc': {
        vi: 'Mỗi phản hồi AI liên kết về đúng đoạn transcript. Bấm vào nguồn để quay lại lượt nói gốc.',
        en: 'Each AI response links to the exact transcript segment. Click a source to jump to the original utterance.',
    },
    'grounded.card2.title': {
        vi: 'Tìm trong toàn bộ transcript',
        en: 'Search across transcripts',
    },
    'grounded.card2.desc': {
        vi: 'Tìm từ khóa, tên người nói hoặc cụm từ trong toàn bộ cuộc họp.',
        en: 'Find keywords, speaker names, or phrases across the entire meeting.',
    },
    'grounded.card3.title': {
        vi: 'Tải audio gốc',
        en: 'Download original audio',
    },
    'grounded.card3.desc': {
        vi: 'Mở lại bản ghi đầy đủ khi cần kiểm chứng nội dung.',
        en: 'Reopen the full recording when you need to verify content.',
    },
    'grounded.card4.title': {
        vi: 'Review cùng trợ lý AI',
        en: 'Review with AI assistant',
    },
    'grounded.card4.desc': {
        vi: 'Hỏi tiếp tự nhiên trên cùng ngữ cảnh cuộc họp và xem nguồn từ transcript.',
        en: 'Continue asking in the same meeting context and view sources from the transcript.',
    },
    'grounded.exampleLabel': { vi: 'Ví dụ nguồn:', en: 'Example sources:' },

    // ─── Landing — Use Cases ─────────────────────────────────────────────
    'usecases.label': { vi: 'Trường hợp sử dụng', en: 'Use cases' },
    'usecases.title': {
        vi: 'Dành cho những cuộc trò chuyện quan trọng.',
        en: 'For the conversations that matter.',
    },
    'usecases.subtitle': {
        vi: 'Mọi bản ghi cuộc trò chuyện đều có thể tìm kiếm và xem lại.',
        en: 'Every conversation recording is searchable and reviewable.',
    },
    'usecases.case1.label': { vi: 'Lớp học online', en: 'Online classes' },
    'usecases.case1.desc': {
        vi: 'Ghi lại bài giảng và xem lại với AI. Tìm đúng đoạn giảng viên giải thích một khái niệm.',
        en: 'Record lectures and review with AI. Find exactly where the instructor explained a concept.',
    },
    'usecases.case2.label': { vi: 'Họp nhóm', en: 'Team meetings' },
    'usecases.case2.desc': {
        vi: 'Lưu standup, review sprint và planning. Trích xuất quyết định và việc cần làm.',
        en: 'Save standups, sprint reviews, and planning sessions. Extract decisions and action items.',
    },
    'usecases.case3.label': { vi: 'Phỏng vấn', en: 'Interviews' },
    'usecases.case3.desc': {
        vi: 'Chép lời phỏng vấn ứng viên hoặc người dùng. Tìm câu trả lời cụ thể giữa nhiều buổi.',
        en: 'Transcribe candidate or user interviews. Find specific answers across sessions.',
    },
    'usecases.case4.label': { vi: 'Cuộc gọi nghiên cứu', en: 'Research calls' },
    'usecases.case4.desc': {
        vi: 'Theo dõi lượt nói theo chủ đề, nhận diện mẫu lặp và trích xuất quote quan trọng.',
        en: 'Track speech by topic, identify recurring patterns, and extract key quotes.',
    },
    'usecases.case5.label': { vi: 'Ôn tập', en: 'Study review' },
    'usecases.case5.desc': {
        vi: 'Xem lại buổi học đã ghi âm và nhờ AI tóm tắt các chủ đề cụ thể.',
        en: 'Review recorded study sessions and ask AI to summarize specific topics.',
    },

    // ─── Landing — Footer ────────────────────────────────────────────────
    'footer.cta.label': { vi: 'Bắt đầu', en: 'Get started' },
    'footer.cta.title': {
        vi: 'Sẵn sàng xem lại cuộc họp tiếp theo?',
        en: 'Ready to review your next meeting?',
    },
    'footer.cta.subtitle': {
        vi: 'Tạo dự án và tải audio đầu tiên lên. Không cần thẻ thanh toán.',
        en: 'Create a project and upload your first audio. No credit card required.',
    },
    'footer.cta.openApp': { vi: 'Mở ứng dụng', en: 'Open app' },
    'footer.cta.login': { vi: 'Đăng nhập', en: 'Log in' },
    'footer.section.product': { vi: 'Sản phẩm', en: 'Product' },
    'footer.section.workspace': { vi: 'Workspace', en: 'Workspace' },
    'footer.section.account': { vi: 'Tài khoản', en: 'Account' },
    'footer.link.features': { vi: 'Tính năng', en: 'Features' },
    'footer.link.workflow': { vi: 'Quy trình', en: 'Workflow' },
    'footer.link.references': { vi: 'Nguồn tham chiếu', en: 'References' },
    'footer.link.pricing': { vi: 'Gói dịch vụ', en: 'Pricing' },
    'footer.link.dashboard': { vi: 'Tổng quan', en: 'Dashboard' },
    'footer.link.meetings': { vi: 'Cuộc họp', en: 'Meetings' },
    'footer.link.login': { vi: 'Đăng nhập', en: 'Log in' },
    'footer.link.register': { vi: 'Đăng ký', en: 'Sign up' },
    'footer.brand': {
        vi: 'Workspace cuộc họp với AI. Tải audio, xem transcript và nhận câu trả lời có nguồn.',
        en: 'AI meeting workspace. Upload audio, view transcripts, and get sourced answers.',
    },
    'footer.copyright': {
        vi: 'Workspace cuộc họp với AI.',
        en: 'AI meeting workspace.',
    },
    'footer.tagline': {
        vi: 'Xây dựng cho transcript có thể kiểm chứng.',
        en: 'Built for verifiable transcripts.',
    },

    // ─── Auth — Login ────────────────────────────────────────────────────
    'login.title': {
        vi: 'Đăng nhập vào workspace transcript của bạn.',
        en: 'Sign in to your transcript workspace.',
    },
    'login.subtitle': {
        vi: 'Xem lại audio cuộc họp, tìm kiếm transcript theo người nói và hỏi trợ lý AI trong cùng một nơi.',
        en: 'Review meeting audio, search transcripts by speaker, and ask the AI assistant — all in one place.',
    },
    'login.feature1': {
        vi: 'Tải audio lên và quản lý theo từng dự án.',
        en: 'Upload audio and manage by project.',
    },
    'login.feature2': {
        vi: 'Xem transcript có mốc thời gian rõ ràng.',
        en: 'View transcripts with clear timestamps.',
    },
    'login.feature3': {
        vi: 'Hỏi AI về quyết định, rủi ro và việc cần làm.',
        en: 'Ask AI about decisions, risks, and action items.',
    },
    'login.welcome': { vi: 'Chào mừng trở lại', en: 'Welcome back' },
    'login.continueWith': {
        vi: 'Dùng tài khoản Snote để tiếp tục.',
        en: 'Use your Snote account to continue.',
    },
    'login.email': { vi: 'Email', en: 'Email' },
    'login.password': { vi: 'Mật khẩu', en: 'Password' },
    'login.passwordPlaceholder': {
        vi: 'Nhập mật khẩu',
        en: 'Enter password',
    },
    'login.showPassword': { vi: 'Hiện mật khẩu', en: 'Show password' },
    'login.hidePassword': { vi: 'Ẩn mật khẩu', en: 'Hide password' },
    'login.submit': { vi: 'Đăng nhập', en: 'Sign in' },
    'login.submitting': { vi: 'Đang đăng nhập...', en: 'Signing in...' },
    'login.noAccount': {
        vi: 'Chưa có tài khoản?',
        en: "Don't have an account?",
    },
    'login.createAccount': { vi: 'Tạo tài khoản', en: 'Create account' },
    'login.errorGeneric': {
        vi: 'Không thể đăng nhập. Vui lòng kiểm tra thông tin tài khoản.',
        en: 'Could not sign in. Please check your credentials.',
    },
    'login.errorNetwork': {
        vi: 'Trình duyệt không kết nối được tới máy chủ xác thực. Backend có thể cần cho phép origin của frontend này.',
        en: 'The browser could not connect to the auth server. The backend may need to allow this frontend origin.',
    },

    // ─── Auth — Register ─────────────────────────────────────────────────
    'register.title': {
        vi: 'Tạo workspace để xem lại transcript.',
        en: 'Create a workspace to review transcripts.',
    },
    'register.subtitle': {
        vi: 'Bắt đầu với quy trình rõ ràng: tải audio lên, xem transcript theo người nói và hỏi AI trên nội dung cuộc họp.',
        en: 'Start with a clear workflow: upload audio, view speaker-segmented transcripts, and ask AI about meeting content.',
    },
    'register.feature1': {
        vi: 'Một tài khoản cho dự án, audio và transcript.',
        en: 'One account for projects, audio, and transcripts.',
    },
    'register.feature2': {
        vi: 'Giao diện tập trung cho việc theo dõi sau họp.',
        en: 'A focused interface for post-meeting follow-up.',
    },
    'register.feature3': {
        vi: 'Quyền quản trị chỉ hiển thị với tài khoản admin.',
        en: 'Admin features only visible to admin accounts.',
    },
    'register.heading': { vi: 'Tạo tài khoản', en: 'Create account' },
    'register.subheading': {
        vi: 'Nhập thông tin cơ bản để bắt đầu dùng Snote.',
        en: 'Enter basic information to start using Snote.',
    },
    'register.name': { vi: 'Họ và tên', en: 'Full name' },
    'register.namePlaceholder': { vi: 'Tên của bạn', en: 'Your name' },
    'register.passwordPlaceholder': {
        vi: 'Tối thiểu 8 ký tự',
        en: 'At least 8 characters',
    },
    'register.submit': { vi: 'Tạo tài khoản', en: 'Create account' },
    'register.submitting': {
        vi: 'Đang tạo tài khoản...',
        en: 'Creating account...',
    },
    'register.hasAccount': {
        vi: 'Đã có tài khoản?',
        en: 'Already have an account?',
    },
    'register.login': { vi: 'Đăng nhập', en: 'Sign in' },
    'register.errorGeneric': {
        vi: 'Không thể tạo tài khoản. Vui lòng thử lại.',
        en: 'Could not create account. Please try again.',
    },

    // ─── Dashboard ───────────────────────────────────────────────────────
    'dashboard.welcome': {
        vi: 'Chào mừng trở lại,',
        en: 'Welcome back,',
    },
    'dashboard.subtitle': {
        vi: 'Quản lý cuộc họp, transcript và trợ lý AI trong một workspace.',
        en: 'Manage meetings, transcripts, and AI assistant in one workspace.',
    },
    'dashboard.allMeetings': { vi: 'Tất cả cuộc họp', en: 'All meetings' },
    'dashboard.createMeeting': { vi: 'Tạo cuộc họp', en: 'Create meeting' },
    'dashboard.newToSnote': { vi: 'Mới dùng Snote?', en: 'New to Snote?' },
    'dashboard.tourDesc': {
        vi: 'Xem hướng dẫn ngắn để hiểu dự án, transcript và trợ lý AI.',
        en: 'Take a quick tour to learn about projects, transcripts, and the AI assistant.',
    },

    // Dashboard — stream card
    'dashboard.stream.title': {
        vi: 'Ghi âm cuộc họp qua WebSocket',
        en: 'Record a meeting through WebSocket',
    },
    'dashboard.stream.desc': {
        vi: 'Gửi audio WebM lên backend, sau đó tạo transcript và task từ nội dung cuộc họp.',
        en: 'Send WebM audio to the backend, then generate transcripts and action items from the meeting content.',
    },
    'dashboard.stream.button': {
        vi: 'Mở dự án để ghi âm',
        en: 'Open a project to record',
    },
    'dashboard.uploadAudio': { vi: 'Tải audio lên', en: 'Upload audio' },

    // Dashboard — metrics
    'dashboard.metric.meetings': { vi: 'Cuộc họp', en: 'Meetings' },
    'dashboard.metric.meetingsDesc': {
        vi: 'tổng số cuộc họp trong workspace',
        en: 'total meetings in workspace',
    },
    'dashboard.metric.projects': { vi: 'Dự án', en: 'Projects' },
    'dashboard.metric.projectsDesc': {
        vi: 'dự án cuộc họp đã tạo',
        en: 'meeting projects created',
    },
    'dashboard.metric.tasks': { vi: 'Công việc', en: 'Tasks' },
    'dashboard.metric.tasksDesc': {
        vi: 'việc chưa hoàn tất từ transcript',
        en: 'incomplete tasks from transcripts',
    },

    // Dashboard — recent work
    'dashboard.recentMeetings': {
        vi: 'Cuộc họp gần đây',
        en: 'Recent meetings',
    },
    'dashboard.loadError': {
        vi: 'Không tải được cuộc họp gần đây',
        en: 'Could not load recent meetings',
    },
    'dashboard.noMeetings': { vi: 'Chưa có cuộc họp', en: 'No meetings yet' },
    'dashboard.noMeetingsDesc': {
        vi: 'Tạo cuộc họp để tải audio và xem transcript.',
        en: 'Create a meeting to upload audio and view transcripts.',
    },
    'dashboard.hasAudio': { vi: 'Có audio', en: 'Has audio' },
    'dashboard.waitingAudio': { vi: 'Chờ audio', en: 'Waiting for audio' },

    // Dashboard — tasks
    'dashboard.pendingTasks': { vi: 'Công việc cần làm', en: 'Pending tasks' },
    'dashboard.loadTasksError': {
        vi: 'Không tải được công việc',
        en: 'Could not load tasks',
    },
    'dashboard.noTasks': {
        vi: 'Không còn việc cần xử lý',
        en: 'No pending tasks',
    },
    'dashboard.noTasksDesc': {
        vi: 'Hiện chưa có công việc đang mở.',
        en: 'There are no open tasks right now.',
    },

    // Dashboard — getting started
    'dashboard.gettingStarted': {
        vi: 'Bắt đầu sử dụng',
        en: 'Getting started',
    },
    'dashboard.gettingStartedDesc': {
        vi: 'Hoàn tất các bước chính để thiết lập workspace.',
        en: 'Complete the key steps to set up your workspace.',
    },
    'dashboard.step.createMeeting': {
        vi: 'Tạo cuộc họp đầu tiên',
        en: 'Create your first meeting',
    },
    'dashboard.step.uploadAudio': {
        vi: 'Tải audio cuộc họp lên',
        en: 'Upload meeting audio',
    },
    'dashboard.step.viewTranscript': {
        vi: 'Xem lại transcript',
        en: 'Review transcript',
    },
    'dashboard.step.askAI': {
        vi: 'Hỏi trợ lý AI về cuộc họp',
        en: 'Ask AI about the meeting',
    },

    // ─── Meetings List ───────────────────────────────────────────────────
    'meetings.title': { vi: 'Cuộc họp', en: 'Meetings' },
    'meetings.subtitle': {
        vi: 'Mỗi dự án tương ứng với một cuộc họp và transcript.',
        en: 'Each project corresponds to a meeting and transcript.',
    },
    'meetings.create': { vi: 'Tạo cuộc họp', en: 'Create meeting' },
    'meetings.searchPlaceholder': {
        vi: 'Tìm theo tiêu đề hoặc mô tả...',
        en: 'Search by title or description...',
    },
    'meetings.loadError': {
        vi: 'Không tải được danh sách cuộc họp',
        en: 'Could not load meetings list',
    },
    'meetings.noMatch': {
        vi: 'Không tìm thấy cuộc họp phù hợp',
        en: 'No matching meetings found',
    },
    'meetings.noMeetings': { vi: 'Chưa có cuộc họp', en: 'No meetings yet' },
    'meetings.noMatchDesc': {
        vi: 'Thử đổi từ khóa tìm kiếm.',
        en: 'Try a different search term.',
    },
    'meetings.noMeetingsDesc': {
        vi: 'Tạo cuộc họp để tải audio và xem transcript.',
        en: 'Create a meeting to upload audio and view transcripts.',
    },
    'meetings.hasAudio': { vi: 'Đã có audio', en: 'Has audio' },
    'meetings.waitingAudio': { vi: 'Chờ audio', en: 'Waiting for audio' },
    'meetings.showing': { vi: 'Đang hiển thị', en: 'Showing' },
    'meetings.of': { vi: '/', en: 'of' },
    'meetings.meetingsLabel': { vi: 'cuộc họp', en: 'meetings' },

    // Meetings — create dialog
    'meetings.dialog.title': { vi: 'Tạo cuộc họp', en: 'Create meeting' },
    'meetings.dialog.desc': {
        vi: 'Tạo dự án cho cuộc họp. Sau đó tải audio để tạo transcript và dùng trợ lý AI để phân tích nội dung.',
        en: 'Create a project for a meeting. Then upload audio to generate transcripts and use AI to analyze content.',
    },
    'meetings.dialog.titleLabel': { vi: 'Tiêu đề', en: 'Title' },
    'meetings.dialog.titlePlaceholder': {
        vi: 'Ví dụ: Họp sales - Kế hoạch Q2',
        en: 'E.g.: Sales meeting - Q2 plan',
    },
    'meetings.dialog.descLabel': { vi: 'Mô tả', en: 'Description' },
    'meetings.dialog.descPlaceholder': {
        vi: 'Ghi chú ngắn về cuộc họp...',
        en: 'Brief notes about the meeting...',
    },
    'meetings.dialog.titleRequired': {
        vi: 'Vui lòng nhập tiêu đề cuộc họp.',
        en: 'Please enter a meeting title.',
    },
    'meetings.dialog.success': {
        vi: 'Đã tạo cuộc họp.',
        en: 'Meeting created.',
    },
    'meetings.dialog.error': {
        vi: 'Không thể tạo cuộc họp.',
        en: 'Could not create meeting.',
    },

    // ─── Meeting Detail ──────────────────────────────────────────────────
    'detail.upload.title': {
        vi: 'Tải audio lên để tạo transcript',
        en: 'Upload audio to generate transcript',
    },
    'detail.upload.subtitle': {
        vi: 'Transcript sẽ xuất hiện tại đây sau khi xử lý.',
        en: 'Transcript will appear here after processing.',
    },
    'detail.upload.dragDrop': {
        vi: 'Kéo thả audio vào đây hoặc',
        en: 'Drag and drop audio here or',
    },
    'detail.upload.selectFile': { vi: 'chọn tệp', en: 'select file' },
    'detail.upload.formats': {
        vi: 'Hỗ trợ MP3, WAV, M4A, WebM, OGG',
        en: 'Supports MP3, WAV, M4A, WebM, OGG',
    },
    'detail.upload.uploading': { vi: 'Đang tải lên...', en: 'Uploading...' },
    'detail.upload.createTranscript': {
        vi: 'Tạo transcript',
        en: 'Generate transcript',
    },

    // ─── Tasks ───────────────────────────────────────────────────────────
    'tasks.title': { vi: 'Bảng công việc', en: 'Task board' },
    'tasks.subtitle': {
        vi: 'Theo dõi các task được tạo từ transcript của từng cuộc họp.',
        en: 'Track action items generated from each meeting transcript.',
    },
    'tasks.openMeetings': {
        vi: 'Mở danh sách cuộc họp',
        en: 'Open meetings list',
    },
    'tasks.loadError': {
        vi: 'Không tải được công việc',
        en: 'Could not load tasks',
    },
    'tasks.searchPlaceholder': {
        vi: 'Tìm theo nội dung công việc hoặc tên cuộc họp...',
        en: 'Search by task content or meeting name...',
    },
    'tasks.filter.all': { vi: 'Tất cả', en: 'All' },
    'tasks.filter.todo': { vi: 'Cần làm', en: 'To do' },
    'tasks.filter.inProgress': { vi: 'Đang làm', en: 'In progress' },
    'tasks.filter.done': { vi: 'Hoàn tất', en: 'Done' },
    'tasks.filter.lowPriority': { vi: 'Ưu tiên thấp', en: 'Low priority' },
    'tasks.filter.medPriority': { vi: 'Ưu tiên vừa', en: 'Medium priority' },
    'tasks.filter.highPriority': { vi: 'Ưu tiên cao', en: 'High priority' },
    'tasks.status.todo': { vi: 'Cần làm', en: 'To do' },
    'tasks.status.inProgress': { vi: 'Đang làm', en: 'In progress' },
    'tasks.status.done': { vi: 'Hoàn tất', en: 'Done' },
    'tasks.priority.low': { vi: 'Thấp', en: 'Low' },
    'tasks.priority.medium': { vi: 'Vừa', en: 'Medium' },
    'tasks.priority.high': { vi: 'Cao', en: 'High' },
    'tasks.noTasks': { vi: 'Chưa có công việc nào', en: 'No tasks yet' },
    'tasks.noTasksDesc': {
        vi: 'Mở một cuộc họp đã có transcript rồi dùng nút tạo công việc để sinh danh sách việc cần làm.',
        en: 'Open a meeting with a transcript and use the create tasks button to generate a to-do list.',
    },
    'tasks.selectMeeting': { vi: 'Chọn cuộc họp', en: 'Select meeting' },
    'tasks.noMatch': {
        vi: 'Không tìm thấy công việc phù hợp',
        en: 'No matching tasks found',
    },
    'tasks.noMatchDesc': {
        vi: 'Thử đổi từ khóa tìm kiếm hoặc bộ lọc.',
        en: 'Try a different search term or filter.',
    },
    'tasks.editTask': { vi: 'Chỉnh sửa', en: 'Edit' },
    'tasks.openMeeting': { vi: 'Mở cuộc họp', en: 'Open meeting' },
    'tasks.deleteTask': { vi: 'Xóa công việc', en: 'Delete task' },
    'tasks.editDialog.title': {
        vi: 'Chỉnh sửa công việc',
        en: 'Edit task',
    },
    'tasks.editDialog.desc': {
        vi: 'Cập nhật nội dung công việc đã tạo từ transcript.',
        en: 'Update the content of a task created from transcript.',
    },
    'tasks.editDialog.placeholder': {
        vi: 'Nội dung công việc...',
        en: 'Task content...',
    },
    'tasks.editDialog.save': { vi: 'Lưu thay đổi', en: 'Save changes' },
    'tasks.deleteDialog.title': {
        vi: 'Xoá task này?',
        en: 'Delete this task?',
    },
    'tasks.deleteDialog.desc': {
        vi: 'Task sẽ bị xoá khỏi danh sách công việc. Hành động này không thể hoàn tác.',
        en: 'This task will be removed from your action items. This action cannot be undone.',
    },
    'tasks.deleteDialog.confirm': { vi: 'Xoá task', en: 'Delete task' },
    'tasks.deleteDialog.cancel': { vi: 'Huỷ', en: 'Cancel' },

    // Kanban-specific empty states
    'tasks.kanban.emptyColumn': {
        vi: 'Chưa có task nào ở trạng thái này.',
        en: 'No tasks in this stage yet.',
    },
    'tasks.kanban.emptyBoard': {
        vi: 'Chưa có task nào. Hãy mở một cuộc họp có transcript để tạo task.',
        en: 'No tasks yet. Open a meeting with a transcript to generate action items.',
    },
    'tasks.kanban.actionOpen': { vi: 'Mở cuộc họp', en: 'Open meeting' },
    'tasks.kanban.actionEdit': { vi: 'Sửa', en: 'Edit' },
    'tasks.kanban.actionMenu': { vi: 'Menu (...)', en: 'More menu (...)' },
    'tasks.failedProjects': {
        vi: 'Một số dự án chưa tải được công việc.',
        en: 'Some projects could not load tasks.',
    },
    'tasks.failedProjectsDesc': {
        vi: 'Đã bỏ qua {count} dự án trong lần tải này. Bạn có thể thử tải lại sau.',
        en: 'Skipped {count} projects in this load. You can try reloading later.',
    },

    // ─── Profile ─────────────────────────────────────────────────────────
    'profile.title': { vi: 'Hồ sơ', en: 'Profile' },
    'profile.subtitle': {
        vi: 'Xem thông tin tài khoản và các thiết lập cá nhân.',
        en: 'View account information and personal settings.',
    },
    'profile.accountActive': {
        vi: 'Tài khoản đang hoạt động',
        en: 'Account active',
    },
    'profile.tab.account': { vi: 'Tài khoản', en: 'Account' },
    'profile.tab.security': { vi: 'Bảo mật', en: 'Security' },
    'profile.tab.notifications': { vi: 'Thông báo', en: 'Notifications' },
    'profile.accountInfo': { vi: 'Thông tin tài khoản', en: 'Account info' },
    'profile.name': { vi: 'Họ và tên', en: 'Full name' },
    'profile.saveChanges': { vi: 'Lưu thay đổi', en: 'Save changes' },
    'profile.dangerZone': { vi: 'Khu vực nguy hiểm', en: 'Danger zone' },
    'profile.deleteAccountDesc': {
        vi: 'Xóa tài khoản cần backend cung cấp API để đảm bảo dữ liệu được xử lý đúng.',
        en: 'Account deletion requires a backend API to ensure data is handled properly.',
    },
    'profile.deleteAccount': { vi: 'Xóa tài khoản', en: 'Delete account' },
    'profile.changePassword': { vi: 'Đổi mật khẩu', en: 'Change password' },
    'profile.currentPassword': {
        vi: 'Mật khẩu hiện tại',
        en: 'Current password',
    },
    'profile.newPassword': { vi: 'Mật khẩu mới', en: 'New password' },
    'profile.minChars': {
        vi: 'Tối thiểu 8 ký tự.',
        en: 'Minimum 8 characters.',
    },
    'profile.confirmPassword': {
        vi: 'Xác nhận mật khẩu mới',
        en: 'Confirm new password',
    },
    'profile.updatePassword': {
        vi: 'Cập nhật mật khẩu',
        en: 'Update password',
    },
    'profile.twoFactor': { vi: 'Xác thực hai lớp', en: 'Two-factor auth' },
    'profile.twoFactorDesc': {
        vi: 'Tăng cường bảo mật cho tài khoản của bạn.',
        en: 'Enhance security for your account.',
    },
    'profile.enable2FA': { vi: 'Bật 2FA', en: 'Enable 2FA' },
    'profile.notifTitle': {
        vi: 'Tùy chọn thông báo',
        en: 'Notification settings',
    },
    'profile.notif.email': { vi: 'Thông báo email', en: 'Email notifications' },
    'profile.notif.emailDesc': {
        vi: 'Nhận cập nhật liên quan đến tài khoản.',
        en: 'Receive account-related updates.',
    },
    'profile.notif.calendar': {
        vi: 'Nhắc lịch cuộc họp',
        en: 'Meeting reminders',
    },
    'profile.notif.calendarDesc': {
        vi: 'Nhận nhắc nhở cho sự kiện sắp tới.',
        en: 'Get reminders for upcoming events.',
    },
    'profile.notif.tasks': {
        vi: 'Thông báo công việc',
        en: 'Task notifications',
    },
    'profile.notif.tasksDesc': {
        vi: 'Nhận cập nhật khi công việc thay đổi.',
        en: 'Get updates when tasks change.',
    },
    'profile.notif.weekly': { vi: 'Tổng hợp hằng tuần', en: 'Weekly digest' },
    'profile.notif.weeklyDesc': {
        vi: 'Nhận tóm tắt các cuộc họp và công việc.',
        en: 'Receive a summary of meetings and tasks.',
    },
    'profile.saveNotif': { vi: 'Lưu tùy chọn', en: 'Save preferences' },

    // ─── Calendar ────────────────────────────────────────────────────────
    'calendar.title': { vi: 'Lịch', en: 'Calendar' },
    'calendar.desc': {
        vi: 'Tính năng lịch sẽ được mở sau khi backend cung cấp API sự kiện. Hiện tại Snote không hiển thị dữ liệu lịch giả.',
        en: 'The calendar feature will be available after the backend provides an events API. Snote does not display placeholder calendar data.',
    },
    'calendar.openMeetings': {
        vi: 'Mở danh sách cuộc họp',
        en: 'Open meetings list',
    },

    // ─── Audio Stream Panel ──────────────────────────────────────────────
    'stream.title': { vi: 'Ghi âm cuộc họp', en: 'Meeting recording' },
    'stream.beta': { vi: 'Beta', en: 'Beta' },
    'stream.subtitle': {
        vi: 'Gửi audio WebM lên Snote để lưu lại sau khi dừng ghi.',
        en: 'Send WebM audio to Snote and store it after recording stops.',
    },
    'stream.warning': {
        vi: 'Audio sẽ được lưu sau khi bạn dừng ghi. Đây chưa phải dịch realtime.',
        en: 'Audio is saved after recording stops. This is not realtime translation yet.',
    },
    'stream.wsError': {
        vi: 'Không thể kết nối luồng ghi âm. Vui lòng thử lại sau.',
        en: 'Could not connect to the recording stream. Please try again later.',
    },
    'stream.processing': {
        vi: 'Backend đang xử lý audio, quá trình này có thể mất khoảng 1 phút...',
        en: 'The backend is processing the audio. This may take about a minute...',
    },
    'stream.testConnect': { vi: 'Test kết nối WS', en: 'Test WS connect' },
    'stream.streamFile': { vi: 'Stream file .webm', en: 'Stream .webm file' },
    'stream.startCapture': {
        vi: 'Bắt đầu ghi tab + mic',
        en: 'Start recording tab + mic',
    },
    'stream.stopCapture': { vi: 'Dừng ghi', en: 'Stop recording' },
    'stream.audioSaved': { vi: 'Audio đã được lưu', en: 'Audio saved' },
    'stream.openAudio': { vi: 'Mở audio', en: 'Open audio' },
    'stream.status.idle': { vi: 'Chưa chạy', en: 'Idle' },
    'stream.status.connecting': { vi: 'Đang kết nối', en: 'Connecting' },
    'stream.status.connected': { vi: 'Đã kết nối', en: 'Connected' },
    'stream.status.capturing': {
        vi: 'Đang xin quyền ghi',
        en: 'Requesting capture',
    },
    'stream.status.streaming': { vi: 'Đang gửi audio', en: 'Streaming' },
    'stream.status.stopping': { vi: 'Đang dừng', en: 'Stopping' },
    'stream.status.closed': { vi: 'Đã đóng', en: 'Closed' },
    'stream.status.error': { vi: 'Lỗi', en: 'Error' },

    // ─── Errors ──────────────────────────────────────────────────────────
    'error.default': { vi: 'Đã xảy ra lỗi', en: 'An error occurred' },
    'error.title': { vi: 'Đã xảy ra lỗi', en: 'An error occurred' },
    'error.backText': { vi: 'Quay lại', en: 'Go back' },
    'error.defaultDesc': {
        vi: 'Rất tiếc, đã có lỗi không xác định xảy ra.',
        en: 'Sorry, an unknown error occurred.',
    },
    'error.loadScreen': {
        vi: 'Không thể tải màn hình này. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
        en: 'Could not load this screen. Please try again or contact support.',
    },
    'error.backToDashboard': {
        vi: 'Quay lại tổng quan',
        en: 'Back to dashboard',
    },

    // ─── Meeting Detail - Upload ─────────────────────────────────────────
    'meeting.upload.title': { vi: 'Tải audio lên', en: 'Upload audio' },
    'meeting.upload.subtitle': {
        vi: 'Audio sẽ được dùng để tạo transcript.',
        en: 'Audio will be used to generate transcript.',
    },
    'meeting.upload.errorInvalidFile': {
        vi: 'File không hợp lệ. Vui lòng chọn file audio.',
        en: 'Invalid file. Please select an audio file.',
    },
    'meeting.upload.errorGeneric': {
        vi: 'Có lỗi xảy ra khi tải lên.',
        en: 'An error occurred during upload.',
    },
    'meeting.upload.success': {
        vi: 'Tải audio thành công.',
        en: 'Audio uploaded successfully.',
    },
    'meeting.upload.dragDrop': {
        vi: 'Kéo thả file vào đây hoặc',
        en: 'Drag and drop file here or',
    },
    'meeting.upload.browse': { vi: 'chọn từ thiết bị', en: 'browse files' },
    'meeting.upload.formats': {
        vi: 'Hỗ trợ: MP3, WAV, M4A, WebM, OGG',
        en: 'Supports: MP3, WAV, M4A, WebM, OGG',
    },
    'meeting.upload.uploading': { vi: 'Đang tải lên...', en: 'Uploading...' },
    'meeting.upload.button': { vi: 'Tải lên dự án', en: 'Upload to project' },

    // ─── Meeting Detail - Transcript ──────────────────────────────────────
    'meeting.transcript.title': { vi: 'Transcript', en: 'Transcript' },
    'meeting.transcript.segments': {
        vi: '{count} đoạn',
        en: '{count} segments',
    },
    'meeting.transcript.search': {
        vi: 'Tìm trong transcript...',
        en: 'Search transcript...',
    },
    'meeting.transcript.loading': {
        vi: 'Đang tải transcript...',
        en: 'Loading transcript...',
    },
    'meeting.transcript.error': {
        vi: 'Không tải được transcript.',
        en: 'Failed to load transcript.',
    },
    'meeting.transcript.generating': {
        vi: 'Đang tạo transcript',
        en: 'Generating transcript',
    },
    'meeting.transcript.generatingDesc': {
        vi: 'Vui lòng đợi vài phút trong khi hệ thống xử lý audio.',
        en: 'Please wait a few minutes while the system processes the audio.',
    },
    'meeting.transcript.processing': {
        vi: 'Đang xử lý nội dung',
        en: 'Processing content',
    },
    'meeting.transcript.processingDesc': {
        vi: 'Quá trình có thể mất thời gian lâu hơn bình thường.',
        en: 'The process might take longer than usual.',
    },
    'meeting.transcript.checkAgain': { vi: 'Kiểm tra lại', en: 'Check again' },
    'meeting.transcript.empty': {
        vi: 'Chưa có transcript',
        en: 'No transcript yet',
    },
    'meeting.transcript.emptyDesc': {
        vi: 'Transcript sẽ hiển thị tại đây sau khi xử lý.',
        en: 'Transcript will appear here after processing.',
    },
    'meeting.transcript.noMatch': {
        vi: 'Không tìm thấy kết quả phù hợp.',
        en: 'No matching results found.',
    },
    'meeting.transcript.unknownSpeaker': {
        vi: 'Người nói chưa rõ',
        en: 'Unknown speaker',
    },
    'meeting.transcript.referenced': {
        vi: 'Được tham chiếu',
        en: 'Referenced',
    },

    // ─── Meeting Detail - Chat ───────────────────────────────────────────
    'meeting.chat.title': { vi: 'Trợ lý AI', en: 'AI Assistant' },
    'meeting.chat.empty': { vi: 'Chưa có tin nhắn', en: 'No messages yet' },
    'meeting.chat.emptyDescReady': {
        vi: 'Bắt đầu chat về cuộc họp này bên dưới.',
        en: 'Start chatting about this meeting below.',
    },
    'meeting.chat.emptyDescNotReady': {
        vi: 'Cần có transcript để chat.',
        en: 'Transcript is required to chat.',
    },
    'meeting.chat.you': { vi: 'Bạn', en: 'You' },
    'meeting.chat.assistant': { vi: 'AI', en: 'AI' },
    'meeting.chat.thinking': { vi: 'Đang suy nghĩ', en: 'Thinking' },
    'meeting.chat.source': { vi: 'Nguồn', en: 'Source' },
    'meeting.chat.sourceNotFound': {
        vi: 'Không tìm thấy nguồn.',
        en: 'Source not found.',
    },
    'meeting.chat.jumpToSource': {
        vi: 'Chuyển tới đoạn {ref}',
        en: 'Jump to segment {ref}',
    },
    'meeting.chat.errorSend': {
        vi: 'Lỗi khi gửi tin nhắn.',
        en: 'Error sending message.',
    },
    'meeting.chat.stopped': { vi: 'Đã dừng chat.', en: 'Chat stopped.' },
    'meeting.chat.waitNotice': {
        vi: 'Chờ transcript để chat.',
        en: 'Wait for transcript to chat.',
    },
    'meeting.chat.inputPlaceholder': {
        vi: 'Hỏi về cuộc họp (Ctrl+Enter để gửi)...',
        en: 'Ask about the meeting (Ctrl+Enter to send)...',
    },
    'meeting.chat.inputDisabled': {
        vi: 'Tải audio lên trước.',
        en: 'Upload audio first.',
    },

    // ─── Meeting Detail - General ─────────────────────────────────────────
    'meeting.errorNotFound': {
        vi: 'Không tìm thấy cuộc họp',
        en: 'Meeting not found',
    },
    'meeting.errorLoad': {
        vi: 'Không tải được cuộc họp',
        en: 'Failed to load meeting',
    },
    'meeting.backToList': { vi: 'Quay lại danh sách', en: 'Back to list' },
    'meeting.copyIdSuccess': { vi: 'Đã copy ID', en: 'ID copied' },
    'meeting.copyId': { vi: 'Copy ID dự án', en: 'Copy project ID' },
    'meetings.errorTitleRequired': {
        vi: 'Vui lòng nhập tiêu đề.',
        en: 'Please enter a title.',
    },
    'meeting.editSuccess': {
        vi: 'Cập nhật thành công.',
        en: 'Updated successfully.',
    },
    'meeting.editError': { vi: 'Lỗi cập nhật.', en: 'Update failed.' },
    'meeting.downloadAudio': { vi: 'Tải audio', en: 'Download audio' },

    // ─── Meeting Detail - Tabs ────────────────────────────────────────────
    'meeting.tabs.overview': { vi: 'Tổng quan', en: 'Overview' },
    'meeting.tabs.transcript': { vi: 'Transcript', en: 'Transcript' },
    'meeting.tabs.chat': { vi: 'Chat', en: 'Chat' },
    'meeting.tabs.tasks': { vi: 'Công việc', en: 'Tasks' },

    // ─── Meeting Detail - Overview ────────────────────────────────────────
    'meeting.overview.title': { vi: 'Thông tin chung', en: 'General info' },
    'meeting.overview.id': { vi: 'ID Dự án', en: 'Project ID' },
    'meeting.overview.audioStatus': {
        vi: 'Trạng thái audio',
        en: 'Audio status',
    },
    'meeting.overview.audioUploaded': { vi: 'Đã tải lên', en: 'Uploaded' },
    'meeting.overview.audioPending': {
        vi: 'Chưa tải lên',
        en: 'Pending upload',
    },
    'meeting.overview.segmentsCount': {
        vi: 'Số đoạn transcript',
        en: 'Transcript segments',
    },

    // ─── Meeting Detail - Edit Dialog ─────────────────────────────────────
    'meeting.editDialog.title': {
        vi: 'Chỉnh sửa cuộc họp',
        en: 'Edit meeting',
    },
    'meeting.editDialog.desc': {
        vi: 'Sửa tiêu đề và mô tả.',
        en: 'Edit title and description.',
    },
    'meeting.editDialog.save': { vi: 'Lưu thay đổi', en: 'Save changes' },

    // ─── Loading State ───────────────────────────────────────────────────
    'loading.workspace': {
        vi: 'Đang chuẩn bị workspace',
        en: 'Preparing workspace',
    },
    'loading.session': {
        vi: 'Đang kiểm tra phiên...',
        en: 'Checking session...',
    },

    // ─── Project Tasks Panel ─────────────────────────────────────────────
    'projectTasks.loading': {
        vi: 'Đang tải công việc...',
        en: 'Loading tasks...',
    },
    'projectTasks.emptyTitle': { vi: 'Chưa có công việc', en: 'No tasks yet' },
    'projectTasks.emptyDescReady': {
        vi: 'Nhấn nút tạo công việc để AI tự động trích xuất việc cần làm từ nội dung cuộc họp.',
        en: 'Click generate tasks to let AI extract action items from the meeting.',
    },
    'projectTasks.emptyDescNotReady': {
        vi: 'Cần có transcript để tạo danh sách công việc tự động.',
        en: 'Transcript is needed to automatically generate tasks.',
    },
    'projectTasks.generating': { vi: 'Đang tạo...', en: 'Generating...' },
    'projectTasks.generateBtn': {
        vi: 'Tạo danh sách công việc',
        en: 'Generate tasks',
    },
    'projectTasks.action': { vi: 'Hành động', en: 'Action' },
    'projectTasks.changeStatus': { vi: 'Đổi trạng thái', en: 'Change status' },
    'projectTasks.changePriority': {
        vi: 'Đổi mức ưu tiên',
        en: 'Change priority',
    },
    'projectTasks.regenerate': {
        vi: 'Tạo lại danh sách',
        en: 'Regenerate tasks',
    },
    'projectTasks.generateTimeout': {
        vi: 'Quá thời gian tạo công việc. Vui lòng kiểm tra lại sau.',
        en: 'Generating tasks timed out. Please check again later.',
    },
    'billing.title': {
        vi: 'Gói dịch vụ',
        en: 'Billing Plans',
    },
    'billing.subtitle': {
        vi: 'Xem trạng thái tài khoản, hạn mức dự án và nâng cấp gói dịch vụ.',
        en: 'View account status, project limits, and upgrade your plan.',
    },
    'billing.statusActive': {
        vi: 'Tài khoản đang hoạt động',
        en: 'Active Account',
    },
    'billing.statusDesc': {
        vi: 'Hạn mức tạo dự án của bạn được quản lý dựa trên gói tài khoản.',
        en: 'Your project creation limit is managed based on your account plan.',
    },
    'billing.projectsUsage': {
        vi: 'Dự án đã tạo: {used} / {limit} dự án',
        en: 'Projects created: {used} / {limit} projects',
    },
    'billing.planFree': {
        vi: 'Gói Miễn phí (Free)',
        en: 'Free Plan',
    },
    'billing.planPremium': {
        vi: 'Gói Cao cấp (Premium)',
        en: 'Premium Plan',
    },
    'billing.upgradeBtn': {
        vi: 'Nâng cấp Premium',
        en: 'Upgrade to Premium',
    },
    'billing.upgradeDesc': {
        vi: 'Nâng cấp lên gói Premium để tăng hạn mức tạo dự án lên 20 dự án chỉ với 70.000đ.',
        en: 'Upgrade to Premium plan to increase project limit to 20 projects for only 70,000 VND.',
    },
    'billing.planPremiumActiveDesc': {
        vi: 'Cảm ơn bạn đã nâng cấp gói Premium! Tài khoản của bạn hiện có hạn mức tạo tối đa 20 dự án.',
        en: 'Thank you for upgrading to Premium! Your account now has a maximum limit of 20 projects.',
    },
    'billing.updatePayment': {
        vi: 'Cập nhật thanh toán',
        en: 'Update payment',
    },
    'billing.downloadInvoice': {
        vi: 'Tải hóa đơn',
        en: 'Download invoices',
    },
    'billing.loading': {
        vi: 'Đang tải thông tin hạn mức...',
        en: 'Loading quota information...',
    },
    'billing.generatingUrl': {
        vi: 'Đang tạo liên kết thanh toán...',
        en: 'Generating payment link...',
    },
    'payment.success.title': {
        vi: 'Thanh toán thành công',
        en: 'Payment Successful',
    },
    'payment.success.desc': {
        vi: 'Giao dịch nâng cấp hạn mức dự án của bạn đã được xử lý thành công.',
        en: 'Your project limit upgrade transaction has been processed successfully.',
    },
    'payment.success.back': {
        vi: 'Quay lại gói dịch vụ',
        en: 'Back to Billing Plans',
    },
    'payment.success.updating': {
        vi: 'Đang cập nhật gói Premium...',
        en: 'Updating your Premium plan...',
    },
    'payment.success.upgradedDesc': {
        vi: 'Tài khoản của bạn đã được nâng cấp lên Premium. Bạn hiện có thể tạo tối đa 20 project.',
        en: 'Your account has been upgraded to Premium. You can now create up to 20 projects.',
    },
    'payment.success.pending': {
        vi: 'Thanh toán đã hoàn tất, hệ thống đang cập nhật quota...',
        en: 'Payment completed. We are updating your quota...',
    },
    'payment.success.timeoutDesc': {
        vi: 'Thanh toán đã được ghi nhận nhưng quota chưa cập nhật. Vui lòng thử tải lại sau ít phút.',
        en: 'Payment was received, but your quota has not been updated yet. Please refresh again in a few minutes.',
    },
    'payment.success.retryBtn': {
        vi: 'Kiểm tra lại quota',
        en: 'Check quota again',
    },
} as const satisfies Dict;

export type TranslationKey = keyof typeof dictionaries;
