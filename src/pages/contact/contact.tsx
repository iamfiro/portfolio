import { ContactChannels, ContactForm } from "@/feature/contact/components";
import { LandingPageShell } from "@/feature/landing/components";
import { Box } from "@/shared/components/ui";

import s from "./contact.module.scss";

export default function Contact() {
  return (
    <LandingPageShell
      titleId="contact-title"
      documentTitle="연락하기"
      lines={["협업이나 커피챗 모두", "편하게 연락주세요"]}
    >
      <Box className={s.grid}>
        <ContactChannels />
        <ContactForm />
      </Box>
    </LandingPageShell>
  );
}
