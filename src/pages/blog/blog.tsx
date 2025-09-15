import BlogArticleList from "@/feature/blog/components/article-list";
import ErrorBoundary from "@/shared/components/error-boundary";
import { BaseLayout } from "@/shared/components/layouts";
import { Typo } from "@/shared/components/ui";

import s from "./blog.module.scss";

export default function Blog() {
  return (
    <BaseLayout>
      <div aria-label="spacer" />
      <div className={s.thumbnail}>
        <div>
          <img src="/icon/folder.png" className={s.thumbnail_icon_lt} />
          <img src="/icon/book.png" className={s.thumbnail_icon_rt} />
        </div>

        <h1 className={s.title}>
          A space to record my <img src="/icon/air-balloon.png" /> journey,
          <br /> <img src="/icon/pencil.png" />
          learn, and <img src="/icon/pacman.png" /> share
        </h1>

        <div>
          <img src="/icon/telescope.png" className={s.thumbnail_icon_lb} />
          <img src="/icon/lab.png" className={s.thumbnail_icon_rb} />
        </div>
      </div>

      <ErrorBoundary
        onError={(error, errorInfo) => {
          console.error("Blog page error:", error, errorInfo);
        }}
      >
        <BlogArticleList />
      </ErrorBoundary>

      <Typo.Subtext className={s.copyright}>
        ⓒ {new Date().getFullYear()}. Cho Sungju All rights reserved.
      </Typo.Subtext>
    </BaseLayout>
  );
}
