import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { createPost, deletePost, updatePost } from "@/feature/blog/api";
import { Post, PostMutationPayload } from "@/feature/blog/schema";
import { Project } from "@/feature/projects/schema";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DataGrid,
  Flex,
  FormGroup,
  Input,
  Label,
  Modal,
  SearchInput,
  Stack,
  Text,
  Textarea,
} from "@/shared/components/ui";
import { ApiMessageResponse, ApiResponse } from "@/shared/types/api";

import s from "./style.module.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  posts: Post[];
  projects: Project[];
}

interface PostFormValue {
  title: string;
  description: string;
  content: string;
  thumbnailUrl: string;
  date: string;
  categories: string;
  projectIds: string[];
}

const INITIAL_FORM: PostFormValue = {
  title: "",
  description: "",
  content: "",
  thumbnailUrl: "",
  date: "",
  categories: "",
  projectIds: [],
};

export default function BlogManager({
  isLoading,
  posts,
  projects,
  className,
  ...props
}: Props) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formValue, setFormValue] = useState<PostFormValue>(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  const componentClassName = [s.component, className].filter(Boolean).join(" ");
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;

    return posts.filter((post) =>
      [post.title, post.description, post.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [posts, query]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
  };

  const createMutation = useMutation<ApiResponse<Post>, Error, PostMutationPayload>({
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const updateMutation = useMutation<
    ApiResponse<Post>,
    Error,
    { id: string; payload: Partial<PostMutationPayload> }
  >({
    mutationFn: updatePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const deleteMutation = useMutation<ApiMessageResponse, Error, string>({
    mutationFn: deletePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const openCreateModal = () => {
    setEditingPost(null);
    setFormValue(INITIAL_FORM);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    setFormValue({
      title: post.title,
      description: post.description,
      content: post.content ?? "",
      thumbnailUrl: post.thumbnail,
      date: post.date.split("T")[0] ?? "",
      categories: post.tags.join(", "),
      projectIds: post.relatedProjects?.map((project) => project.id) ?? [],
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 이 포스트를 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleProjectChange = (projectId: string, checked: boolean) => {
    setFormValue((previous) => ({
      ...previous,
      projectIds: checked
        ? [...previous.projectIds, projectId]
        : previous.projectIds.filter((id) => id !== projectId),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const payload: PostMutationPayload = {
      title: formValue.title.trim(),
      summary: formValue.description.trim() || null,
      content: formValue.content.trim() || null,
      thumbnailUrl: formValue.thumbnailUrl.trim() || null,
      date: formValue.date,
      categories: formValue.categories
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean),
      projectIds: formValue.projectIds,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, payload });
      return;
    }
    createMutation.mutate(payload);
  };

  return (
    <Stack className={componentClassName} gap={16} {...props}>
      <Stack className={s.filterRow} gap={12}>
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
          placeholder="블로그 포스트 검색"
          fullWidth
        />
        <Button size="sm" leftIcon={<Plus size={16} />} onClick={openCreateModal}>
          새 포스트
        </Button>
      </Stack>

      <DataGrid
        data={filteredPosts}
        keyExtractor={(post) => post.id}
        emptyMessage={
          isLoading ? "포스트를 불러오는 중입니다." : "조회된 포스트가 없습니다."
        }
        columns={[
          {
            key: "title",
            header: "제목",
            render: (post) => <Text weight="medium">{post.title}</Text>,
          },
          {
            key: "date",
            header: "작성일",
            width: 150,
            render: (post) => (
              <Text color="subtle">
                {new Date(post.date).toLocaleDateString("ko-KR")}
              </Text>
            ),
          },
          {
            key: "relations",
            header: "태그 / 프로젝트",
            render: (post) => (
              <Text color="subtle">
                {post.tags.join(", ") || "태그 없음"} · 프로젝트{" "}
                {post.relatedProjects?.length ?? 0}
              </Text>
            ),
          },
          {
            key: "actions",
            header: "관리",
            width: 180,
            render: (post) => (
              <Flex gap={8}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil size={14} />}
                  onClick={() => openEditModal(post)}
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => handleDelete(post.id)}
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
        title={editingPost ? "포스트 수정" : "새 포스트 생성"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap={14}>
            <FormGroup>
              <Label htmlFor="post-title" required>
                제목
              </Label>
              <Input
                id="post-title"
                value={formValue.title}
                onChange={(event) =>
                  setFormValue((previous) => ({ ...previous, title: event.target.value }))
                }
                maxLength={200}
                required
                fullWidth
              />
            </FormGroup>
            <Stack className={s.formGrid} gap={14}>
              <FormGroup>
                <Label htmlFor="post-date" required>
                  작성일
                </Label>
                <Input
                  id="post-date"
                  type="date"
                  value={formValue.date}
                  onChange={(event) =>
                    setFormValue((previous) => ({
                      ...previous,
                      date: event.target.value,
                    }))
                  }
                  required
                  fullWidth
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="post-categories" required>
                  태그 (쉼표 구분)
                </Label>
                <Input
                  id="post-categories"
                  value={formValue.categories}
                  onChange={(event) =>
                    setFormValue((previous) => ({
                      ...previous,
                      categories: event.target.value,
                    }))
                  }
                  required
                  fullWidth
                />
              </FormGroup>
            </Stack>
            <FormGroup>
              <Label htmlFor="post-description">요약</Label>
              <Textarea
                id="post-description"
                value={formValue.description}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                maxLength={2000}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="post-content">본문 (Markdown)</Label>
              <Textarea
                id="post-content"
                value={formValue.content}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    content: event.target.value,
                  }))
                }
                rows={16}
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="post-thumbnail">썸네일 URL</Label>
              <Input
                id="post-thumbnail"
                type="url"
                value={formValue.thumbnailUrl}
                onChange={(event) =>
                  setFormValue((previous) => ({
                    ...previous,
                    thumbnailUrl: event.target.value,
                  }))
                }
                fullWidth
              />
            </FormGroup>
            <FormGroup>
              <Label>연결 프로젝트</Label>
              <CheckboxGroup className={s.relations}>
                {projects.map((project) => (
                  <Checkbox
                    key={project.id}
                    label={project.title}
                    checked={formValue.projectIds.includes(project.id)}
                    onChange={(event) =>
                      handleProjectChange(project.id, event.target.checked)
                    }
                  />
                ))}
              </CheckboxGroup>
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
