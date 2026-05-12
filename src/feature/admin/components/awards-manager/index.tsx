import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { createAward, deleteAward, updateAward } from "@/feature/awards/api";
import { Award, AwardMutationPayload } from "@/feature/awards/schema";
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
  awards: Award[];
  isLoading: boolean;
}

interface AwardFormValue {
  title: string;
  organization: string;
  date: string;
  description: string;
  imageUrl: string;
}

const INITIAL_FORM: AwardFormValue = {
  title: "",
  organization: "",
  date: "",
  description: "",
  imageUrl: "",
};

export default function AwardsManager({
  awards,
  isLoading,
  className,
  ...props
}: Props) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [formValue, setFormValue] = useState<AwardFormValue>(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAward(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
  };

  const createMutation = useMutation<
    ApiResponse<Award>,
    Error,
    AwardMutationPayload
  >({
    mutationFn: createAward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["awards"] });
      closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const updateMutation = useMutation<
    ApiResponse<Award>,
    Error,
    { id: string; payload: Partial<AwardMutationPayload> }
  >({
    mutationFn: updateAward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["awards"] });
      closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const deleteMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: deleteAward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["awards"] });
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const openCreateModal = () => {
    setEditingAward(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (award: Award) => {
    setEditingAward(award);
    setFormValue({
      title: award.title,
      organization: award.organization,
      date: award.date.split("T")[0] ?? "",
      description: award.description ?? "",
      imageUrl: award.imageUrl ?? "",
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const canDelete = window.confirm("정말 이 어워드를 삭제하시겠습니까?");

    if (!canDelete) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const payload: AwardMutationPayload = {
      title: formValue.title.trim(),
      organization: formValue.organization.trim(),
      date: formValue.date,
      description: formValue.description.trim() || null,
      imageUrl: formValue.imageUrl.trim() || null,
    };

    if (editingAward) {
      updateMutation.mutate({ id: editingAward.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "수상명",
        render: (award: Award) => <Text weight="medium">{award.title}</Text>,
      },
      {
        key: "organization",
        header: "기관",
        width: 220,
        render: (award: Award) => (
          <Text color="subtle">{award.organization}</Text>
        ),
      },
      {
        key: "date",
        header: "수상일",
        width: 160,
        render: (award: Award) => (
          <Text color="subtle">
            {new Date(award.date).toLocaleDateString("ko-KR")}
          </Text>
        ),
      },
      {
        key: "actions",
        header: "관리",
        width: 180,
        render: (award: Award) => (
          <Flex gap={8}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Pencil size={14} />}
              onClick={() => openEditModal(award)}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 size={14} />}
              onClick={() => handleDelete(award.id)}
              disabled={isPending}
            >
              삭제
            </Button>
          </Flex>
        ),
      },
    ],
    [isPending],
  );

  return (
    <Stack className={componentClassName} gap={16} {...props}>
      <Flex justify="space-between" align="center">
        <Text color="subtle">총 {awards.length}개의 어워드</Text>
        <Button leftIcon={<Plus size={16} />} onClick={openCreateModal}>
          새 어워드
        </Button>
      </Flex>

      <DataGrid
        data={awards}
        keyExtractor={(award) => award.id}
        columns={columns}
        emptyMessage={
          isLoading
            ? "어워드를 불러오는 중입니다."
            : "등록된 어워드가 없습니다."
        }
      />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingAward ? "어워드 수정" : "새 어워드 생성"}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <FormGroup>
              <Label htmlFor="award-title" required>
                수상명
              </Label>
              <Input
                id="award-title"
                value={formValue.title}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                required
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="award-organization" required>
                기관명
              </Label>
              <Input
                id="award-organization"
                value={formValue.organization}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    organization: event.target.value,
                  }))
                }
                required
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="award-date" required>
                수상일
              </Label>
              <Input
                id="award-date"
                type="date"
                value={formValue.date}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
                required
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="award-description">설명</Label>
              <Textarea
                id="award-description"
                value={formValue.description}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="award-image-url">이미지 URL</Label>
              <Input
                id="award-image-url"
                value={formValue.imageUrl}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
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
              <Button variant="ghost" type="button" onClick={closeModal}>
                취소
              </Button>
              <Button type="submit" loading={isPending}>
                저장
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
