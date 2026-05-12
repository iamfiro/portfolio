import { FormEvent, useState } from "react";

import {
  Button,
  Card,
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
        <Stack gap={20}>
          <Stack gap={8}>
            <Heading as="h1" size="2xl">
              Admin Dashboard
            </Heading>
            <Text color="subtle">
              블로그/프로젝트/어워드 데이터를 관리하는 관리자 페이지입니다.
            </Text>
          </Stack>

          <FormGroup>
            <Label htmlFor="admin-password" required>
              비밀번호
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="관리자 비밀번호를 입력하세요"
              fullWidth
              required
              disabled={disabled}
            />
          </FormGroup>

          {errorMessage ? (
            <Text size="sm" className={s.errorMessage}>
              {errorMessage}
            </Text>
          ) : null}

          <Button type="submit" fullWidth disabled={disabled}>
            로그인
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
