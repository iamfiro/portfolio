import stack from '@/public/stack/_stack.json';
import s from './style.module.scss';
import { StackGroup } from './StackGroup';

const Stack = () => {
    return (
        <section>
            <h1 className={s.title}>사용하는 기술</h1>
            {stack.map((item, index) => (
                <StackGroup 
                    key={index}
                    name={item.name}
                    stacks={item.stack}
                />
            ))}
        </section>
    );
};

export default Stack;