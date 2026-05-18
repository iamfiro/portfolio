import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { type FormEvent, useCallback, useState } from "react";

import { Button, Input, Stack, Text, Textarea } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!name.trim() || !email.trim() || !message.trim()) return;

      setIsSubmitting(true);

      try {
        // TODO: API 연동
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, email, message],
  );

  if (isSubmitted) {
    return (
      <motion.div
        className={s.success}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Text size="lg" className={s.successTitle}>
          메시지가 전송되었습니다
        </Text>
        <Text size="md" color="subtle">
          빠른 시일 내에 답변드리겠습니다.
        </Text>
        <Button
          variant="ghost"
          size="md"
          className={s.resetButton}
          onClick={() => setIsSubmitted(false)}
        >
          새 메시지 작성
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
          <label className={s.label} htmlFor="contact-name">
            이름
          </label>
          <Input
            id="contact-name"
            size="lg"
            fullWidth
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="contact-email">
            이메일
          </label>
          <Input
            id="contact-email"
            type="email"
            size="lg"
            fullWidth
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="contact-message">
            메시지
          </label>
          <Textarea
            id="contact-message"
            size="lg"
            fullWidth
            resize="vertical"
            placeholder="전하고 싶은 이야기를 자유롭게 작성해주세요."
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
      </Stack>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isSubmitting}
        rightIcon={<Send size={16} />}
        className={s.submitButton}
      >
        메시지 보내기
      </Button>
    </motion.form>
  );
}
