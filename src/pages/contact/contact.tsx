import { motion } from "framer-motion";

import { ContactForm } from "@/feature/contact/components";
import { Header, Spacer, Text } from "@/shared/components/ui";
import { usePageEntrance } from "@/shared/hooks";

import s from "./contact.module.scss";

export default function Contact() {
  const titleEntrance = usePageEntrance("title");
  const subtitleEntrance = usePageEntrance("subtitle");

  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <div className={s.hero}>
          <motion.h1 className={s.title} {...titleEntrance}>
            Contact
          </motion.h1>
          <motion.div {...subtitleEntrance}>
            <Text className={s.subtitle}>
              궁금한 점이나 제안이 있으시면 편하게 연락해주세요.
            </Text>
          </motion.div>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
