// GA4 이벤트 카테고리
export enum EventCategory {
  NAVIGATION = "navigation",
  ENGAGEMENT = "engagement",
  CONTENT = "content",
  INTERACTION = "interaction",
  OUTBOUND = "outbound",
  PERFORMANCE = "performance",
}

// 페이지 카테고리
export enum PageCategory {
  HOME = "home",
  PROJECTS = "projects",
  AWARDS = "awards",
  BLOG = "blog",
  BLOG_ARTICLE = "blog_article",
}

// 커스텀 이벤트 이름 (type-safe)
export enum AnalyticsEvent {
  // 페이지 관련
  PAGE_VIEW = "page_view",

  // 스크롤
  SCROLL_DEPTH = "scroll_depth",

  // 체류 시간
  TIME_ON_PAGE = "time_on_page",

  // 섹션 노출
  SECTION_VIEW = "section_view",

  // 클릭 이벤트
  NAVIGATION_CLICK = "navigation_click",
  SOCIAL_LINK_CLICK = "social_link_click",
  PROJECT_CLICK = "project_click",
  BLOG_CARD_CLICK = "blog_card_click",
  CTA_CLICK = "cta_click",
  OUTBOUND_LINK_CLICK = "outbound_link_click",

  // 블로그 관련
  BLOG_SEARCH = "blog_search",
  BLOG_FILTER_TAG = "blog_filter_tag",
  BLOG_SORT = "blog_sort",
  BLOG_READ_PROGRESS = "blog_read_progress",

  // 인터랙션
  CAROUSEL_DRAG = "carousel_drag",
  TECH_STACK_HOVER = "tech_stack_hover",
  AWARD_HOVER = "award_hover",
  CONTACT_BUTTON_CLICK = "contact_button_click",

  // 성능
  PAGE_LOAD_TIME = "page_load_time",
  FIRST_CONTENTFUL_PAINT = "first_contentful_paint",
}

// 이벤트 파라미터 타입 정의
export interface PageViewParams {
  page_path: string;
  page_title: string;
  page_category: PageCategory;
  page_referrer?: string;
}

export interface ScrollDepthParams {
  scroll_percentage: 25 | 50 | 75 | 90 | 100;
  page_path: string;
  page_category: PageCategory;
}

export interface TimeOnPageParams {
  time_seconds: number;
  page_path: string;
  page_category: PageCategory;
  engagement_level: "bounce" | "low" | "medium" | "high" | "deep";
}

export interface SectionViewParams {
  section_name: string;
  section_index: number;
  page_path: string;
  visible_duration_ms?: number;
}

export interface ClickParams {
  element_text: string;
  element_location: string;
  destination_url?: string;
}

export interface NavigationClickParams extends ClickParams {
  navigation_type: "header" | "footer" | "breadcrumb" | "internal_link";
}

export interface SocialLinkClickParams extends ClickParams {
  platform: "github" | "linkedin" | "instagram" | "email";
}

export interface ProjectClickParams {
  project_name: string;
  project_category?: string;
  click_source: "home_featured" | "home_marquee" | "projects_page";
}

export interface BlogCardClickParams {
  article_title: string;
  article_id: string;
  article_tags: string;
  click_source: "home_featured" | "blog_list";
}

export interface BlogSearchParams {
  search_term: string;
  results_count: number;
}

export interface BlogFilterTagParams {
  tag_name: string;
  action: "add" | "remove";
  active_tags: string;
}

export interface BlogSortParams {
  sort_type: "latest" | "oldest";
}

export interface BlogReadProgressParams {
  article_id: string;
  article_title: string;
  progress_percentage: 25 | 50 | 75 | 100;
  time_spent_seconds: number;
}

export interface OutboundLinkClickParams {
  link_url: string;
  link_text: string;
  link_location: string;
}

export interface CarouselDragParams {
  carousel_name: string;
  direction: "left" | "right";
  items_visible: number;
}

export interface TechStackHoverParams {
  technology_name: string;
  technology_category: string;
}

export interface AwardHoverParams {
  award_name: string;
  award_organization: string;
}

export interface PerformanceParams {
  metric_name: string;
  metric_value: number;
  page_path: string;
}

// 이벤트 → 파라미터 매핑 (type-safe dispatch)
export interface AnalyticsEventMap {
  [AnalyticsEvent.PAGE_VIEW]: PageViewParams;
  [AnalyticsEvent.SCROLL_DEPTH]: ScrollDepthParams;
  [AnalyticsEvent.TIME_ON_PAGE]: TimeOnPageParams;
  [AnalyticsEvent.SECTION_VIEW]: SectionViewParams;
  [AnalyticsEvent.NAVIGATION_CLICK]: NavigationClickParams;
  [AnalyticsEvent.SOCIAL_LINK_CLICK]: SocialLinkClickParams;
  [AnalyticsEvent.PROJECT_CLICK]: ProjectClickParams;
  [AnalyticsEvent.BLOG_CARD_CLICK]: BlogCardClickParams;
  [AnalyticsEvent.CTA_CLICK]: ClickParams;
  [AnalyticsEvent.OUTBOUND_LINK_CLICK]: OutboundLinkClickParams;
  [AnalyticsEvent.BLOG_SEARCH]: BlogSearchParams;
  [AnalyticsEvent.BLOG_FILTER_TAG]: BlogFilterTagParams;
  [AnalyticsEvent.BLOG_SORT]: BlogSortParams;
  [AnalyticsEvent.BLOG_READ_PROGRESS]: BlogReadProgressParams;
  [AnalyticsEvent.CAROUSEL_DRAG]: CarouselDragParams;
  [AnalyticsEvent.TECH_STACK_HOVER]: TechStackHoverParams;
  [AnalyticsEvent.AWARD_HOVER]: AwardHoverParams;
  [AnalyticsEvent.CONTACT_BUTTON_CLICK]: ClickParams;
  [AnalyticsEvent.PAGE_LOAD_TIME]: PerformanceParams;
  [AnalyticsEvent.FIRST_CONTENTFUL_PAINT]: PerformanceParams;
}
