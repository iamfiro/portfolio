import * as THREE from 'three';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

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
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
	` varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float dispFactor;
    uniform float effectFactor;

    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);

      // Fine-tuning distorted positions for clarity
      vec2 distortedPosition = uv + dispFactor * (disp.r * effectFactor) * vec2(1.0, 0.5);
      vec2 distortedPosition2 = uv - (1.0 - dispFactor) * (disp.r * effectFactor) * vec2(1.0, 0.5);

      // Sampling textures with adjusted coordinates
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);

      // Mixing textures based on dispFactor
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);

      // Ensuring the output color remains sharp with no transparency
      gl_FragColor = vec4(finalTexture.rgb, 1.0); // Alpha fixed at 1.0 to remove transparency

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
);

extend({ ImageFadeMaterial });

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

const FadingImage = ({ image, image2, displacement, isHovered }: FadingImageProps) => {
	const ref = useRef<ImageFadeMaterialImpl>(null);
	const [texture1, texture2, dispTexture] = useTexture([image, image2, displacement]);
	const [aspect, setAspect] = useState(1);

	useEffect(() => {
		// Calculate the aspect ratio dynamically based on the loaded texture
		if (texture1.image && texture1.image.width && texture1.image.height) {
			setAspect(texture1.image.width / texture1.image.height);
		}
	}, [texture1]);

	// Adjust texture settings to ensure clarity
	texture1.minFilter = THREE.LinearFilter;
	texture1.magFilter = THREE.LinearFilter;
	texture2.minFilter = THREE.LinearFilter;
	texture2.magFilter = THREE.LinearFilter;
	dispTexture.minFilter = THREE.LinearFilter;
	dispTexture.magFilter = THREE.LinearFilter;

	useFrame(() => {
		if (ref.current) {
			ref.current.uniforms.dispFactor.value = THREE.MathUtils.lerp(
				ref.current.uniforms.dispFactor.value,
				isHovered ? 1 : 0,
				0.125
			);
		}
	});

	return (
		<mesh>
			{/* Adjust planeGeometry width dynamically based on the aspect ratio */}
			<planeGeometry args={[aspect * 1.7, 1.7]} />
			<imageFadeMaterial
				ref={ref}
				// @ts-expect-error This error is expected because the property might be undefined
				tex={texture1}
				tex2={texture2}
				disp={dispTexture}
				toneMapped={true}
				transparent={false}  // Ensure transparency is disabled
			/>
		</mesh>
	);
};

export default FadingImage;
