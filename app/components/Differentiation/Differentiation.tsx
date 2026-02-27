import styles from './Differentiation.module.css';

export default function Differentiation() {
  const points = [
    {
      number: '①',
      title: '예상→검증→재검증',
      subtitle: '삼중 검증 시스템',
    },
    {
      number: '②',
      title: '1:1 전담 세무사',
      subtitle: '담당 전문가제',
    },
    {
      number: '③',
      title: '세무 너머 경영까지',
      subtitle: '원스톱 솔루션',
    },
  ];

  return (
    <section className={styles.diff}>
      <div className={styles.container}>
        <div className={styles.tag}>WHY STARTAX</div>

        <div className={styles.percentWrapper}>
          <span className={styles.percent}>10%</span>
        </div>

        <h2 className={styles.headline}>
          같은 세무사, 다른 결과.<br />
          스타택스만의 차이를 경험하세요.
        </h2>

        <div className={styles.points}>
          {points.map((point, index) => (
            <div key={index} className={styles.point}>
              <div className={styles.pointNumber}>{point.number}</div>
              <div className={styles.pointContent}>
                <div className={styles.pointTitle}>{point.title}</div>
                <div className={styles.pointSubtitle}>{point.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}