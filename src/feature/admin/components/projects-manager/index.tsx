import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import {
  createProject,
  deleteProject,
  updateProject,
} from "@/feature/projects/api";
import { Project, ProjectMutationPayload } from "@/feature/projects/schema";
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
  projects: Project[];
}

interface ProjectFormValue {
  title: string;
  description: string;
  techStack: string;
  thumbnailUrl: string;
  githubUrl: string;
  deployUrl: string;
  startDate: string;
  endDate: string;
}

const INITIAL_FORM: ProjectFormValue = {
  title: "",
  description: "",
  techStack: "",
  thumbnailUrl: "",
  githubUrl: "",
  deployUrl: "",
  startDate: "",
  endDate: "",
};

export default function ProjectsManager({
  isLoading,
  projects,
  className,
  ...props
}: Props) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState<ProjectFormValue>(INITIAL_FORM);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
  };

  const createMutation = useMutation<
    ApiResponse<Project>,
    Error,
    ProjectMutationPayload
  >({
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const updateMutation = useMutation<
    ApiResponse<Project>,
    Error,
    { id: string; payload: Partial<ProjectMutationPayload> }
  >({
    mutationFn: updateProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const deleteMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const openCreateModal = () => {
    setEditingProject(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setErrorMessage("");
    setFormValue({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      thumbnailUrl: project.thumbnailUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      deployUrl: project.deployUrl ?? "",
      startDate: project.startDate.split("T")[0] ?? "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const canDelete = window.confirm("정말 이 프로젝트를 삭제하시겠습니까?");

    if (!canDelete) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const payload: ProjectMutationPayload = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      techStack: formValue.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      thumbnailUrl: formValue.thumbnailUrl.trim() || null,
      githubUrl: formValue.githubUrl.trim() || null,
      deployUrl: formValue.deployUrl.trim() || null,
      startDate: formValue.startDate,
      endDate: formValue.endDate.trim() || null,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "프로젝트명",
        render: (project: Project) => (
          <Text weight="medium">{project.title}</Text>
        ),
      },
      {
        key: "period",
        header: "기간",
        width: 220,
        render: (project: Project) => {
          const startDate = new Date(project.startDate).toLocaleDateString(
            "ko-KR",
          );
          const endDate = project.endDate
            ? new Date(project.endDate).toLocaleDateString("ko-KR")
            : "진행중";

          return (
            <Text color="subtle">
              {startDate} ~ {endDate}
            </Text>
          );
        },
      },
      {
        key: "techStack",
        header: "기술 스택",
        render: (project: Project) => project.techStack.join(", "),
      },
      {
        key: "actions",
        header: "관리",
        width: 180,
        render: (project: Project) => (
          <Flex gap={8}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Pencil size={14} />}
              onClick={() => openEditModal(project)}
            >
              수정
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 size={14} />}
              onClick={() => handleDelete(project.id)}
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
        <Text color="subtle">총 {projects.length}개의 프로젝트</Text>
        <Button
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={openCreateModal}
        >
          새 프로젝트
        </Button>
      </Flex>

      <DataGrid
        data={projects}
        keyExtractor={(project) => project.id}
        columns={columns}
        emptyMessage={
          isLoading
            ? "프로젝트를 불러오는 중입니다."
            : "등록된 프로젝트가 없습니다."
        }
      />

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingProject ? "프로젝트 수정" : "새 프로젝트 생성"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <FormGroup>
              <Label htmlFor="project-title" required>
                프로젝트명
              </Label>
              <Input
                id="project-title"
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
              <Label htmlFor="project-description" required>
                설명
              </Label>
              <Textarea
                id="project-description"
                value={formValue.description}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                required
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="project-tech-stack" required>
                기술 스택 (쉼표로 구분)
              </Label>
              <Input
                id="project-tech-stack"
                value={formValue.techStack}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    techStack: event.target.value,
                  }))
                }
                required
                fullWidth
              />
            </FormGroup>

            <Stack className={s.formGrid} gap={14}>
              <FormGroup>
                <Label htmlFor="project-start-date" required>
                  시작일
                </Label>
                <Input
                  id="project-start-date"
                  type="date"
                  value={formValue.startDate}
                  onChange={(event) =>
                    setFormValue((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                  required
                  fullWidth
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="project-end-date">종료일</Label>
                <Input
                  id="project-end-date"
                  type="date"
                  value={formValue.endDate}
                  onChange={(event) =>
                    setFormValue((prev) => ({
                      ...prev,
                      endDate: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </FormGroup>
            </Stack>

            <FormGroup>
              <Label htmlFor="project-thumbnail-url">썸네일 URL</Label>
              <Input
                id="project-thumbnail-url"
                value={formValue.thumbnailUrl}
                onChange={(event) =>
                  setFormValue((prev) => ({
                    ...prev,
                    thumbnailUrl: event.target.value,
                  }))
                }
                fullWidth
              />
            </FormGroup>

            <Stack className={s.formGrid} gap={14}>
              <FormGroup>
                <Label htmlFor="project-github-url">GitHub URL</Label>
                <Input
                  id="project-github-url"
                  value={formValue.githubUrl}
                  onChange={(event) =>
                    setFormValue((prev) => ({
                      ...prev,
                      githubUrl: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="project-deploy-url">배포 URL</Label>
                <Input
                  id="project-deploy-url"
                  value={formValue.deployUrl}
                  onChange={(event) =>
                    setFormValue((prev) => ({
                      ...prev,
                      deployUrl: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </FormGroup>
            </Stack>

            {errorMessage ? (
              <Text size="sm" className={s.errorMessage}>
                {errorMessage}
              </Text>
            ) : null}

            <Flex justify="flex-end" gap={8}>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={closeModal}
              >
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
