import { ComponentType } from "react";
import { omit } from "lodash-es";

// 定义一个泛型接口，用于支持自定义组件类型
interface HeadingProps<
  T extends keyof JSX.IntrinsicElements | ComponentType<unknown>,
> {
  as: T;
  className?: string;
}

const Heading = <
  T extends keyof JSX.IntrinsicElements | ComponentType<unknown>,
>({
  as: Comp,
  ...otherProps
}: HeadingProps<T>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <Comp {...otherProps}></Comp>;
};

Heading.displayName = "Heading";

export const H1 = ({ ...props }) => (
  <Heading as="h1" className="text-4xl" {...omit(props, "node")} />
);
export const H2 = ({ ...props }) => (
  <Heading as="h2" className="text-3xl" {...omit(props, "node")} />
);

export const H3 = ({ ...props }) => (
  <Heading as="h3" className="text-2xl" {...omit(props, "node")} />
);

export const H4 = ({ ...props }) => (
  <Heading as="h4" className="text-xl" {...omit(props, "node")} />
);
