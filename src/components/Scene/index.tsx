import {Canvas} from "@react-three/fiber";
import {Environment} from "@react-three/drei";

const DonutScene = () => {
	return (
		<Canvas>
			<directionalLight intensity={2} position={[0, 2, 3]}/>
			<Environment preset={'city'}/>
		</Canvas>
	)
}

export default DonutScene;
