import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Card, Flex } from "@/shared/components/ui";

import s from "./style.module.scss";

// ============================================
// HeroFlow Types
// ============================================

interface Position2D {
  x: number;
  y: number;
}

interface SourceProps {
  id: string;
  position: Position2D;
  children: ReactNode;
}

interface ProductProps {
  id: string;
  position: Position2D;
  children: ReactNode;
}

// Symbol로 노드 타입 식별
const SOURCE_TYPE = Symbol.for("HeroFlow.Source");
const PRODUCT_TYPE = Symbol.for("HeroFlow.Product");

// ============================================
// Custom Node Components
// ============================================

interface CustomNodeData {
  children: ReactNode;
  nodeType: "source" | "product";
}

function SourceNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <Card variant="outlined" className={s.nodeCard} p={14}>
      {data.children}
      <Handle type="source" position={Position.Bottom} className={s.handle} />
    </Card>
  );
}

function ProductNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <Flex className={s.productNode}>
      {data.children}
      <Handle type="target" position={Position.Top} className={s.handle} />
    </Flex>
  );
}

const nodeTypes = {
  source: SourceNode,
  product: ProductNode,
};

// ============================================
// HeroFlow Compound Components
// ============================================

function Source({ children }: SourceProps) {
  return <>{children}</>;
}
(Source as unknown as { __nodeType: symbol }).__nodeType = SOURCE_TYPE;

function Product({ children }: ProductProps) {
  return <>{children}</>;
}
(Product as unknown as { __nodeType: symbol }).__nodeType = PRODUCT_TYPE;

// ============================================
// HeroFlow Main Component
// ============================================

interface HeroFlowProps {
  children: ReactNode;
  className?: string;
}

function HeroFlowRoot({ children, className }: HeroFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeExtent, setNodeExtent] = useState<
    [[number, number], [number, number]]
  >([
    [-Infinity, -Infinity],
    [Infinity, Infinity],
  ]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node<CustomNodeData>[] = [];
    const edges: Edge[] = [];
    const sourceIds: string[] = [];
    let productId: string | null = null;

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      const element = child as ReactElement<SourceProps | ProductProps>;
      const nodeType = (element.type as unknown as { __nodeType?: symbol })
        ?.__nodeType;

      if (nodeType === SOURCE_TYPE) {
        const props = element.props as SourceProps;
        sourceIds.push(props.id);
        nodes.push({
          id: props.id,
          type: "source",
          position: props.position,
          data: {
            children: props.children,
            nodeType: "source",
          },
          draggable: true,
        });
      } else if (nodeType === PRODUCT_TYPE) {
        const props = element.props as ProductProps;
        productId = props.id;
        nodes.push({
          id: props.id,
          type: "product",
          position: props.position,
          data: {
            children: props.children,
            nodeType: "product",
          },
          draggable: true,
        });
      }
    });

    // Source → Product 자동 edge 생성
    if (productId) {
      sourceIds.forEach((sourceId) => {
        edges.push({
          id: `${sourceId}-${productId}`,
          source: sourceId,
          target: productId!,
          type: "default",
          animated: true,
          style: { stroke: "#717171", strokeWidth: 2 },
        });
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [children]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const containerClassName = [s.flowContainer, className]
    .filter(Boolean)
    .join(" ");

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  const onInit = useCallback(
    (reactFlowInstance: { getViewport: () => { zoom: number } }) => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const { zoom } = reactFlowInstance.getViewport();

      const padding = 100;
      const halfWidth = width / zoom / 2 - padding;
      const halfHeight = height / zoom / 2 - padding;

      setNodeExtent([
        [-halfWidth, -halfHeight],
        [halfWidth, halfHeight],
      ]);
    },
    [],
  );

  return (
    <Flex className={containerClassName}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        panOnScroll={false}
        preventScrolling={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={1}
        maxZoom={1}
        autoPanOnNodeDrag={false}
        nodeExtent={nodeExtent}
      />
    </Flex>
  );
}

// Compound Component 조립
const HeroFlow = Object.assign(HeroFlowRoot, {
  Source,
  Product,
});

export default HeroFlow;
