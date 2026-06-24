import { DriveStep } from 'driver.js';

export const dashboardTourSteps: DriveStep[] = [
    {
        element: '[data-tour="sidebar"]',
        popover: {
            title: 'Điều hướng',
            description:
                'Dùng sidebar để mở tổng quan, cuộc họp, công việc, lịch, gói dịch vụ và hồ sơ.',
            side: 'right',
            align: 'start',
        },
    },
    {
        element: '[data-tour="dashboard-header"]',
        popover: {
            title: 'Tổng quan workspace',
            description:
                'Đây là màn hình tổng quan. Danh sách cuộc họp và công việc lấy từ API thật.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="dashboard-recent-work"]',
        popover: {
            title: 'Cuộc họp gần đây',
            description:
                'Các cuộc họp mới nhất xuất hiện tại đây. Mở một cuộc họp để xem transcript và lịch sử chat AI.',
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '[data-tour="dashboard-create-project"]',
        popover: {
            title: 'Tạo cuộc họp',
            description:
                'Bắt đầu bằng cách tạo một dự án cuộc họp. Mỗi dự án chứa audio, transcript, chat và công việc riêng.',
            side: 'left',
            align: 'center',
        },
    },
    {
        element: '[data-tour="theme-toggle"]',
        popover: {
            title: 'Đổi giao diện',
            description: 'Chuyển giữa giao diện sáng, tối hoặc theo hệ thống.',
            side: 'top',
            align: 'end',
        },
    },
];

export const meetingsTourSteps: DriveStep[] = [
    {
        element: '[data-tour="projects-header"]',
        popover: {
            title: 'Workspace cuộc họp',
            description:
                'Dự án cuộc họp là đơn vị chính trong Snote. Danh sách này lấy từ backend.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="create-project-button"]',
        popover: {
            title: 'Tạo cuộc họp',
            description:
                'Tạo dự án trước khi tải audio lên hoặc xem transcript.',
            side: 'bottom',
            align: 'end',
        },
    },
    {
        element: '[data-tour="project-search"]',
        popover: {
            title: 'Tìm kiếm cuộc họp',
            description: 'Lọc cuộc họp theo tiêu đề hoặc mô tả.',
            side: 'bottom',
            align: 'center',
        },
    },
    {
        element: '[data-tour="project-list"]',
        popover: {
            title: 'Danh sách cuộc họp',
            description:
                'Mỗi dòng cho biết metadata và trạng thái audio. Mở một cuộc họp để xem transcript và chat.',
            side: 'top',
            align: 'center',
        },
    },
];

export const projectDetailTourSteps: DriveStep[] = [
    {
        element: '[data-tour="project-detail-header"]',
        popover: {
            title: 'Chi tiết cuộc họp',
            description:
                'Đây là workspace của một cuộc họp, bao gồm transcript, chat AI và công việc.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="project-edit-button"]',
        popover: {
            title: 'Chỉnh sửa thông tin',
            description: 'Cập nhật tiêu đề và mô tả cuộc họp tại đây.',
            side: 'bottom',
            align: 'end',
        },
    },
    {
        element: '[data-tour="project-tabs"]',
        popover: {
            title: 'Các tab workspace',
            description:
                'Chuyển tab để xem tổng quan, transcript, chat AI hoặc công việc.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '[data-tour="upload-blocker-card"]',
        popover: {
            title: 'Trạng thái audio',
            description:
                'Tải audio lên trong tab transcript để backend tạo transcript cho cuộc họp.',
            side: 'left',
            align: 'center',
        },
    },
    {
        element: '[data-tour="project-transcript-tab"]',
        popover: {
            title: 'Transcript theo người nói',
            description:
                'Transcript và mốc thời gian sẽ hiển thị tại đây sau khi xử lý audio.',
            side: 'top',
            align: 'center',
        },
    },
    {
        element: '[data-tour="project-chat-tab"]',
        popover: {
            title: 'Trợ lý AI',
            description: 'Hỏi đáp với AI dựa trên transcript của cuộc họp.',
            side: 'top',
            align: 'center',
        },
    },
    {
        element: '[data-tour="chat-blocker-card"]',
        popover: {
            title: 'Nguồn tham chiếu AI',
            description:
                'Câu trả lời của trợ lý có thể chứa nguồn tham chiếu trỏ về các đoạn transcript.',
            side: 'top',
            align: 'center',
        },
    },
];
