import { style } from "@vanilla-extract/css";

import { color, spacing } from "@/styles/token";
import { border } from "@/styles/token/border";
import { radius } from "@/styles/token/radius";

export const linkIcon = style({
	opacity: 0,
	transition: "opacity 0.2s ease-in-out"
})

export const container = style({
	flexDirection: "column",
	":hover": {
		[`& .${linkIcon}`]: {
			opacity: 1
		}
	}
})

export const image = style({
	width: "auto",
	height: 400,
	border: border.default,
	borderRadius: radius.large
})

export const projectName = style({
	color: color.text.secondary
})

export const wrapper = style({
	overflowX: "hidden",

	padding: spacing.large
})