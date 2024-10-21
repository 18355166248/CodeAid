import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "AI 驱动的代码补全",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: <>根据您的编码风格提供智能代码建议和自动补全。</>,
  },
  {
    title: "互动式 AI 对话",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: <>与 AI 进行自然语言对话，获取编码技巧、解释和解决方案。</>,
  },
  {
    title: "可定制设置",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: <>根据您的开发偏好和工作流程调整插件的行为。</>,
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
