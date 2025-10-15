import s from "./style.module.scss";

interface Props {
  name: string;
  image: string;
}

export default function ProjectCarouselItem(props: Props) {
  const { name, image } = props;

  return (
    <div className={s.item}>
      <img src={image} alt={name} className={s.image} />
    </div>
  );
}
