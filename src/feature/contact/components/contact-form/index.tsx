import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { type FormEvent, useCallback, useState } from "react";

import { Button, Input, Label, Stack, Text, Textarea } from "@/shared/components/ui";
import { LINK } from "@/shared/constants";

import s from "./style.module.scss";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isMailAppOpened, setIsMailAppOpened] = useState(false);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!name.trim() || !email.trim() || !message.trim()) return;

      const subject = encodeURIComponent(`[Portfolio] ${name.trim()}님의 문의`);
      const body = encodeURIComponent(
        `이름: ${name.trim()}\n회신 이메일: ${email.trim()}\n\n${message.trim()}`,
      );

      window.location.href = `mailto:${LINK.email}?subject=${subject}&body=${body}`;
      setIsMailAppOpened(true);
    },
    [email, message, name],
  );

  if (isMailAppOpened) {
    return (
      <motion.div
        className={s.success}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        aria-live="polite"
      >
        <Text size="lg" className={s.successTitle}>
          메일 앱을 열었습니다
        </Text>
        <Text size="md" color="subtle">
          메일 앱에서 내용을 확인한 뒤 전송을 완료해주세요.
        </Text>
        <Button
          variant="ghost"
          size="md"
          className={s.resetButton}
          onClick={() => setIsMailAppOpened(false)}
        >
          내용 수정하기
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      className={s.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
    >
      <Stack className={s.fields}>
        <div className={s.field}>
          <Label className={s.label} htmlFor="contact-name">
            이름
          </Label>
          <Input
            id="contact-name"
            size="lg"
            fullWidth
            autoComplete="name"
            placeholder="홍길동"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className={s.field}>
          <Label className={s.label} htmlFor="contact-email">
            이메일
          </Label>
          <Input
            id="contact-email"
            type="email"
            size="lg"
            fullWidth
            autoComplete="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={s.field}>
          <Label className={s.label} htmlFor="contact-message">
            메시지
          </Label>
          <Textarea
            id="contact-message"
            size="lg"
            fullWidth
            resize="vertical"
            placeholder="전하고 싶은 이야기를 자유롭게 작성해주세요."
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </div>
      </Stack>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        rightIcon={<Send size={16} aria-hidden="true" />}
        className={s.submitButton}
      >
        메일 앱 열기
      </Button>
    </motion.form>
  );
}
