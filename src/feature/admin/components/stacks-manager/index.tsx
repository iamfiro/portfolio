import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { createStack, deleteStack, updateStack } from "@/feature/stacks/api";
import { StackMutationPayload, TechStack } from "@/feature/stacks/schema";
import {
  Button,
  DataGrid,
  Flex,
  FormGroup,
  Input,
  Label,
  Modal,
  Stack,
  Text,
  Textarea,
} from "@/shared/components/ui";
import { ApiMessageResponse, ApiResponse } from "@/shared/types/api";

import s from "./style.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  stacks: TechStack[];
}

interface StackFormValue {
  name: string;
  imageUrl: string;
  description: string;
  category: string;
}

const INITIAL_FORM: StackFormValue = {
  name: "",
  imageUrl: "",
  description: "",
  category: "",
};

export default function StacksManager({ isLoading, stacks, className, ...props }: Props) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<TechStack | null>(null);
  const [formValue, setFormValue] = useState<StackFormValue>(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStack(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
  };

  const createMutation = useMutation<ApiResponse<TechStack>, Error, StackMutationPayload>(
    {
      mutationFn: createStack,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["stacks"] });
        closeModal();
      },
      onError: (error) => setErrorMessage(error.message),
    },
  );

  const updateMutation = useMutation<
    ApiResponse<TechStack>,
    Error,
    { id: string; payload: Partial<StackMutationPayload> }
  >({
    mutationFn: updateStack,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["stacks"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const deleteMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: deleteStack,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["stacks"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const openCreateModal = () => {
    setEditingStack(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (stack: TechStack) => {
    setEditingStack(stack);
    setFormValue({
      name: stack.name,
      imageUrl: stack.imageUrl ?? "",
      description: stack.description ?? "",
      category: stack.category ?? "",
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("기술 스택을 삭제하면 프로젝트 연결도 해제됩니다. 계속하시겠습니까?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const payload: StackMutationPayload = {
      name: formValue.name.trim(),
      imageUrl: formValue.imageUrl.trim() || null,
      description: formValue.description.trim() || null,
      category: formValue.category.trim() || null,
    };

    if (editingStack) {
      updateMutation.mutate({ id: editingStack.id, payload });
      return;
    }
    createMutation.mutate(payload);
  };

  return (
    <Stack className={componentClassName} gap={16} {...props}>
      <Flex justify="space-between" align="center" className={s.toolbar}>
        <Text color="subtle">총 {stacks.length}개의 기술 스택</Text>
        <Button size="sm" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
          새 기술 스택
        </Button>
      </Flex>

      <DataGrid
        data={stacks}
        keyExtractor={(stack) => stack.id}
        emptyMessage={
          isLoading ? "기술 스택을 불러오는 중입니다." : "등록된 기술 스택이 없습니다."
        }
        columns={[
          {
            key: "name",
            header: "이름",
            render: (stack) => <Text weight="medium">{stack.name}</Text>,
          },
          {
            key: "category",
            header: "카테고리",
            width: 180,
            render: (stack) => <Text color="subtle">{stack.category ?? "미분류"}</Text>,
          },
          {
            key: "projects",
            header: "연결 프로젝트",
            render: (stack) => (
              <Text color="subtle">
                {stack.projects.map((project) => project.title).join(", ") || "미사용"}
              </Text>
            ),
          },
          {
            key: "actions",
            header: "관리",
            width: 180,
            render: (stack) => (
              <Flex gap={8}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil size={14} />}
                  onClick={() => openEditModal(stack)}
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => handleDelete(stack.id)}
                  disabled={isPending}
                >
                  삭제
                </Button>
              </Flex>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingStack ? "기술 스택 수정" : "새 기술 스택 생성"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <FormGroup>
              <Label htmlFor="stack-name" required>
                이름
              </Label>
              <Input
                id="stack-name"
                value={formValue.name}
                onChange={(event) =>
                  setFormValue((previous) => ({ ...previous, name: event.target.value }))
                }
                maxLength={100}
                required
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="stack-category">카테고리</Label>
              <Input
                id="stack-category"
                value={formValue.category}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    category: event.target.value,
                  }))
                }
                maxLength={100}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="stack-description">설명</Label>
              <Textarea
                id="stack-description"
                value={formValue.description}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                maxLength={2000}
                rows={6}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="stack-image-url">이미지 URL</Label>
              <Input
                id="stack-image-url"
                type="url"
                value={formValue.imageUrl}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    imageUrl: event.target.value,
                  }))
                }
                fullWidth
              />
            </FormGroup>
            {errorMessage ? (
              <Text size="sm" className={s.errorMessage}>
                {errorMessage}
              </Text>
            ) : null}
            <Flex justify="flex-end" gap={8}>
              <Button size="sm" variant="ghost" type="button" onClick={closeModal}>
                취소
              </Button>
              <Button size="sm" type="submit" loading={isPending}>
                저장
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
