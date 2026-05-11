import { motion } from "framer-motion";

import BlogArticleList from "@/feature/blog/components/article-list";
import ErrorBoundary from "@/shared/components/error-boundary";
import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import { Header, Text } from "@/shared/components/ui";

import s from "./blog.module.scss";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Blog() {
  const { pageReady } = usePageTransition();

  return (
    <main className={s.container}>
      <Header />
      <section className={s.page}>
        <motion.div
          className={s.thumbnail}
          initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
          animate={
            pageReady
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : undefined
          }
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        >
          <div>
            <motion.img
              src="/icon/folder.png"
              className={s.thumbnail_icon_lt}
              initial={{ opacity: 0, y: -20, rotate: -40 }}
              animate={
                pageReady ? { opacity: 1, y: 0, rotate: -30 } : undefined
              }
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            />
            <motion.img
              src="/icon/book.png"
              className={s.thumbnail_icon_rt}
              initial={{ opacity: 0, y: -20, rotate: 10 }}
              animate={pageReady ? { opacity: 1, y: 0, rotate: 20 } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            />
          </div>

          <motion.h1
            className={s.title}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={
              pageReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
            }
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
          >
            A space to record my <img src="/icon/air-balloon.png" /> journey,
            <br /> <img src="/icon/pencil.png" />
            learn, and <img src="/icon/pacman.png" /> share
          </motion.h1>

          <div>
            <motion.img
              src="/icon/telescope.png"
              className={s.thumbnail_icon_lb}
              initial={{ opacity: 0, y: 20, rotate: 30 }}
              animate={pageReady ? { opacity: 1, y: 0, rotate: 40 } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            />
            <motion.img
              src="/icon/lab.png"
              className={s.thumbnail_icon_rb}
              initial={{ opacity: 0, y: 20, rotate: -30 }}
              animate={
                pageReady ? { opacity: 1, y: 0, rotate: -20 } : undefined
              }
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            />
          </div>
        </motion.div>

        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Blog page error:", error, errorInfo);
          }}
        >
          <BlogArticleList />
        </ErrorBoundary>

        <Text size="sm" className={s.copyright}>
          ⓒ {new Date().getFullYear()}. Cho Sungju All rights reserved.
        </Text>
      </section>
    </main>
  );
}
