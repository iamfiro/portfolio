import {forwardRef, Ref} from "react";

import {Flex} from "@/components/ui";
import { flexDirection, FlexProps } from "@/components/ui/Flex/shared";

const VStack = forwardRef(function VStack(props: FlexProps, ref: Ref<never>) {
	return <Flex ref={ref} direction={flexDirection.column} {...props} children={props.children}/>;
});

export default VStack;