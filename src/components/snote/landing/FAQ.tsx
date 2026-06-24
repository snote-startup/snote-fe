'use client';

import { Reveal } from './Reveal';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        q: 'Tôi có thể tải loại audio nào lên?',
        a: 'Snote được thiết kế cho bản ghi cuộc họp. Người dùng có thể tải các định dạng audio phổ biến, tùy theo backend chấp nhận trong từng môi trường.',
    },
    {
        q: 'Có thể hỏi AI trên transcript không?',
        a: 'Có. Sau khi transcript được tạo, người dùng có thể hỏi về quyết định, câu hỏi còn mở hoặc công việc cần theo dõi trong nội dung cuộc họp.',
    },
    {
        q: 'Snote có hỗ trợ nhiều người nói không?',
        a: 'Transcript hiển thị theo từng segment và mốc thời gian. Thông tin người nói phụ thuộc vào dữ liệu backend trả về.',
    },
    {
        q: 'Phiên bản này có realtime audio không?',
        a: 'Chưa. Phase hiện tại chỉ dùng audio upload. Realtime audio sẽ được làm sau khi backend xác nhận protocol.',
    },
    {
        q: 'Dữ liệu dự án được bảo vệ thế nào?',
        a: 'Các route trong ứng dụng yêu cầu phiên đăng nhập. Dự án và transcript được truy cập qua API có token xác thực.',
    },
];

export function FAQ() {
    return (
        <section
            id="faq"
            className="border-border bg-muted/20 relative z-10 border-y py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:items-start">
                    <Reveal>
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Câu hỏi thường gặp
                        </p>
                        <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Những điều cần biết.
                        </h2>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                            Các câu trả lời phản ánh phạm vi frontend hiện tại.
                        </p>
                    </Reveal>

                    <Reveal delay={80} className="w-full">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2"
                        >
                            {faqs.map((item, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`item-${i}`}
                                    className="border-border bg-card rounded-xl border px-4"
                                >
                                    <AccordionTrigger className="text-foreground py-4 text-left text-sm font-semibold hover:no-underline">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-4 text-sm leading-6">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
