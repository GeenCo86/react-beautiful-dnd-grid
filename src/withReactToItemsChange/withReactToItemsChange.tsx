import React from "react";
import hash from "object-hash";

type ItemData = object |string | number;

export interface Props {
  items: ItemData[];
}

export const withReactToItemsChange = <P extends Props>(Component: React.ComponentType<P>): React.ComponentType<P> => (
  props: P
) => <Component key={hash(props.items)} {...props} />;
