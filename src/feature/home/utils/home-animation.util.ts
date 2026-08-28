const HOME_ANIMATION_EASE = [0.16, 1, 0.3, 1] as const;

const HOME_ANIMATION_HIDDEN = {
  opacity: 0,
  y: 16,
} as const;

const HOME_ANIMATION_VISIBLE = {
  opacity: 1,
  y: 0,
} as const;

function getHomeAnimationTransition(index = 0, duration = 0.46) {
  return {
    delay: index * 0.08,
    duration,
    ease: HOME_ANIMATION_EASE,
  };
}

export {
  getHomeAnimationTransition,
  HOME_ANIMATION_HIDDEN,
  HOME_ANIMATION_VISIBLE,
};
