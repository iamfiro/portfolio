import { ContactChannels, ContactForm } from "@/feature/contact/components";
import { LandingPageShell } from "@/feature/landing/components";
import { Box } from "@/shared/components/ui";

import s from "./contact.module.scss";

export default function Contact() {
  return (
    <LandingPageShell
      titleId="contact-title"
      documentTitle="연락하기"
      lines={["궁금한 게 있다면", "편하게 말 걸어주세요"]}
    >
      <Box className={s.grid}>
        <ContactChannels />
        <ContactForm />
      </Box>
    </LandingPageShell>
  );
}
