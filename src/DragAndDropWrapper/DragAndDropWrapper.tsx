import React, { ReactElement } from "react";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { ListManagerItem } from "./ListManagerItem";
import hash from 'object-hash';

type ItemData = object | string | number;

interface Location {
  id: string;
  index: number;
}

export interface DragAndDropResult {
  source: Location;
  destination: Location;
}

export interface Chunk {
  id: string;
  items: ItemData[];
}

export interface Props {
  className?: string;
  chunks: Chunk[];
  direction: "horizontal" | "vertical";
  render(item: ItemData): ReactElement<{}>;
  onDragEnd(result: DragAndDropResult): void;
  keyExpression?: (item: ItemData) => string;
}

const horizontalStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start"
};

export const DragAndDropWrapper: React.StatelessComponent<Props> = ({
  onDragEnd,
  chunks,
  direction,
  render,
  keyExpression,
  className
}: Props) => {
  return (
    <DragDropContext onDragEnd={mapAndInvoke(onDragEnd)}>
      {chunks.map(({ id: droppableId, items }: Chunk) => (
        <Droppable key={droppableId} droppableId={droppableId} direction={direction}>
          {(provided: DroppableProvided, _: DroppableStateSnapshot) => (
            <div
              ref={provided.innerRef}
              style={direction === "horizontal" ? horizontalStyle : undefined}
              className={className}
              {...provided.droppableProps}
            >
              {items.map((item: ItemData, index: number) => (
                <ListManagerItem key={keyExpression ? keyExpression(item) : hash(item)} item={item} index={index} render={render} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

function mapAndInvoke(onDragEnd: (result: DragAndDropResult) => void) {
  return function({ source, destination }: DropResult): void {
    if (destination !== undefined && destination !== null) {
      const result: DragAndDropResult = {
        source: {
          id: source.droppableId,
          index: source.index
        },
        destination: {
          id: destination.droppableId,
          index: destination.index
        }
      };
      onDragEnd(result);
    }
  };
}
