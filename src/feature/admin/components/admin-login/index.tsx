import { LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

import {
  Badge,
  Button,
  Card,
  Flex,
  FormGroup,
  Heading,
  Input,
  Label,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  errorMessage?: string;
  disabled?: boolean;
  onLogin: (password: string) => void;
}

export default function AdminLogin({
  errorMessage,
  disabled = false,
  onLogin,
  className,
  ...props
}: Props) {
  const [password, setPassword] = useState("");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(password);
  };

  return (
    <Card className={componentClassName} {...props}>
      <form onSubmit={handleSubmit}>
        <Stack gap={24}>
          <Flex justify="space-between" align="center">
            <Flex className={s.loginIcon} align="center" justify="center">
              <LockKeyhole size={20} />
            </Flex>
            <Badge variant="success" size="sm" dot>
              Secure access
            </Badge>
          </Flex>

          <Stack gap={8}>
            <Heading as="h1" size="2xl">
              관리자 로그인
            </Heading>
            <Text color="subtle">
              포트폴리오 콘텐츠와 연결 관계를 안전하게 관리합니다.
            </Text>
          </Stack>

          <FormGroup>
            <Label htmlFor="admin-password" required>
              관리자 비밀번호
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              fullWidth
              required
              disabled={disabled}
            />
          </FormGroup>

          {errorMessage ? (
            <Text size="sm" className={s.errorMessage} role="alert">
              {errorMessage}
            </Text>
          ) : null}

          <Button
            type="submit"
            fullWidth
            disabled={disabled}
            leftIcon={<ShieldCheck size={16} />}
          >
            {disabled ? "확인 중" : "대시보드 열기"}
          </Button>

          <Text size="xs" color="subtle" align="center">
            인증 세션은 보안 쿠키로 보호됩니다.
          </Text>
        </Stack>
      </form>
    </Card>
  );
}
