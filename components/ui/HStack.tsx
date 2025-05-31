import {forwardRef, Ref} from "react";

import {Flex} from "@/components/ui";
import { FlexProps } from "@/components/ui/Flex/shared";

const HStack = forwardRef(function VStack(props: FlexProps, ref: Ref<never>) {
	return <Flex ref={ref} direction="row" {...props} children={props.children}/>;
});

export default HStack;