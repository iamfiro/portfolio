import style from "./RecentProject.module.scss";
import {IoMdArrowUp} from "react-icons/io";
import React from "react";
import Image from "next/image";

const RecentProject = () => {
	return (
		<article className={style.recentProject}>
			<Image src="/project/nodream.png" width={315} height={180} alt="최근 프로젝트 이미지"/>
			<div>
				<span>최근 프로젝트</span>
				<IoMdArrowUp/>
			</div>
		</article>
	)
}

export default RecentProject;