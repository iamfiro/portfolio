export interface Award {
	title: string;
	year: number;
	image?: string;
}

const AwardList: Award[] = [
	{
		title: '27회 AppJam 미래산업 최우수상',
		year: 2024
	},
	{
		title: '2024 선린톤 생활분야 금상',
		year: 2024
	},
	{
		title: '선린인고 2024 천하제일 코딩대회 은상',
		year: 2024
	}
]

export default AwardList;
