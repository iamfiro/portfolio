import { useQuery } from "@tanstack/react-query";

import { ProjectList } from "@/feature/projects/components";
import { getProjects } from "@/feature/projects/data";
import type { ProjectsResponse } from "@/feature/projects/schema";
import PageTitle from "@/shared/components/page-title";
import { Header, Spacer } from "@/shared/components/ui";

import s from "./projects.module.scss";

export default function Projects() {
  const { data } = useQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <main className={s.container}>
      <Header />
      <Spacer size={48} />
      <section className={s.page}>
        <PageTitle title="프로젝트" count={data?.data.length} />
        <ProjectList />
      </section>
    </main>
  );
}
