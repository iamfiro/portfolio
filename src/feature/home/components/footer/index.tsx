import { Component, PersonStanding } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, useCallback, useMemo, useRef, useState } from "react";
import type { Edge, Node, NodeProps } from "reactflow";
import ReactFlow, {
  Handle,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { Card, Flex, Image, Marquee } from "@/shared/components/ui";

import s from "./style.module.scss";

interface FlowCardProps {
  icon?: ReactNode;
  title?: string;
  children?: ReactNode;
}

function FlowCard({ icon, title, children }: FlowCardProps) {
  const clonedIcon = useMemo(
    () =>
      icon
        ? cloneElement(icon as ReactElement, { className: s.cardIcon })
        : null,
    [icon],
  );
  const hasHeader = icon || title;

  return (
    <Flex direction="column" gap={12} className={s.cardContent}>
      {hasHeader && (
        <Flex align="center" gap={4}>
          {clonedIcon}
          {title && <span className={s.cardTitle}>{title}</span>}
        </Flex>
      )}
      {children && <Flex className={s.cardChildren}>{children}</Flex>}
    </Flex>
  );
}

function PersonCard() {
  return (
    <FlowCard icon={<PersonStanding size={16} />} title="Person">
      <ul className={s.personCardList}>
        <li>
          <span>Name</span>
          <span>Cho Sungju</span>
        </li>
        <li>
          <span>Age</span>
          <span>18</span>
        </li>
        <li>
          <span>Current</span>
          <span>Sunrin Internet High School</span>
        </li>
        <li>
          <span>Name</span>
          <span>Cho Sungju</span>
        </li>
      </ul>
    </FlowCard>
  );
}

function IdeaCard() {
  return (
    <img
      src="/images/home/mind_blowing.gif"
      alt="mind_blowing.gif"
      className={s.ideaImage}
    />
  );
}

const stackIcons = [
  { src: "/icon/stack/typescript.svg", alt: "TypeScript" },
  { src: "/icon/stack/storybook.svg", alt: "Storybook" },
  { src: "/icon/stack/redis.svg", alt: "Redis" },
];

function StackCard() {
  return (
    <FlowCard icon={<Component size={16} />} title="Tech Stack">
      <Marquee
        gradientColor="#FFFFFF"
        width={250}
        speed={15}
        gap={16}
        pauseOnHover
        showEdgeGradient={true}
      >
        {stackIcons.map((icon) => (
          <Image
            key={icon.alt}
            src={icon.src}
            alt={icon.alt}
            className={s.stackIcon}
          />
        ))}
      </Marquee>
    </FlowCard>
  );
}

function ProductCard() {
  return (
    <img
      src="/images/home/happy-product.jpg"
      alt="happy_product.jpg"
      className={s.productImage}
    />
  );
}

interface CustomNodeData {
  children: ReactNode;
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

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: "person",
    type: "source",
    position: { x: -370, y: -180 },
    data: { children: <PersonCard /> },
    draggable: true,
  },
  {
    id: "idea",
    type: "source",
    position: { x: 0, y: -250 },
    data: { children: <IdeaCard /> },
    draggable: true,
  },
  {
    id: "stack",
    type: "source",
    position: { x: 400, y: -100 },
    data: { children: <StackCard /> },
    draggable: true,
  },
  {
    id: "product",
    type: "product",
    position: { x: 50, y: 100 },
    data: { children: <ProductCard /> },
    draggable: true,
  },
];

const sourceIds = ["person", "idea", "stack"];

const initialEdges: Edge[] = sourceIds.map((sourceId) => ({
  id: `${sourceId}-product`,
  source: sourceId,
  target: "product",
  type: "default",
  animated: true,
  style: { stroke: "#717171", strokeWidth: 2 },
}));

const proOptions = { hideAttribution: true };

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeExtent, setNodeExtent] = useState<
    [[number, number], [number, number]]
  >([
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
  ]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

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
    <section className={s.container} ref={containerRef}>
      <Flex className={s.showcaseContainer}>
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
    </section>
  );
}
