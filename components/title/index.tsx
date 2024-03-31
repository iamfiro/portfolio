import { TitleProps } from "@/types/components"

const Title = ({ size, children, color, style, bold }: TitleProps) => {
    return <span color={color} style={{ ...style, fontSize: size, color, fontWeight: bold ? 'bold' : '' }}>{children}</span>
}

export default Title;