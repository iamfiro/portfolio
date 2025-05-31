import {forwardRef, Ref} from "react";

import Flex from "@/components/ui/Flex";
import { FlexProps } from "@/components/ui/Flex/shared";

const VStack = forwardRef(function VStack(props: FlexProps, ref: Ref<never>) {
	return <Flex ref={ref} direction="column" {...props} children={props.children}/>;
});

export default VStack;