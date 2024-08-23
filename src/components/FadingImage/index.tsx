import * as THREE from 'three';
import {shaderMaterial, useTexture} from '@react-three/drei';
import {useFrame, extend, ReactThreeFiber} from '@react-three/fiber';
import {useRef, useState} from 'react';

// Define the interface for your custom ShaderMaterial
interface ImageFadeMaterialImpl extends THREE.ShaderMaterial {
	uniforms: {
		effectFactor: { value: number };
		dispFactor: { value: number };
		tex: { value: THREE.Texture | null };
		tex2: { value: THREE.Texture | null };
		disp: { value: THREE.Texture | null };
	};
}

export const ImageFadeMaterial = shaderMaterial(
	{
		effectFactor: 0.2,
		dispFactor: 0,
		tex: null,
		tex2: null,
		disp: null
	},
	` varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
	` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
)

extend({ImageFadeMaterial});

interface FadingImageProps {
	image: string;
	image2: string;
	displacement: string;
	isHovered: boolean;
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			imageFadeMaterial: ReactThreeFiber.Object3DNode<ImageFadeMaterialImpl, typeof ImageFadeMaterial>;
		}
	}
}

const FadingImage = ({image, image2, displacement, isHovered}: FadingImageProps) => {
	const ref = useRef<ImageFadeMaterialImpl>(null);
	const [texture1, texture2, dispTexture] = useTexture([image, image2, displacement]);

	useFrame(() => {
		if (ref.current) {
			ref.current.uniforms.dispFactor.value = THREE.MathUtils.lerp(
				ref.current.uniforms.dispFactor.value,
				isHovered ? 1 : 0,
				0.075
			);
		}
	});

	return (
		<mesh>
			{/* Set planeGeometry args to the desired size */}
			<planeGeometry args={[2.7, 1.7]}/>
			<imageFadeMaterial
				ref={ref}
				tex={texture1}
				tex2={texture2}
				disp={dispTexture}
				toneMapped={true}
			/>
		</mesh>
	);
};

export default FadingImage;
