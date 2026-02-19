import styles from './Branches.module.css';

export default function Branches() {
  const branches = [
    {
      name: '본사(성수)',
      address: '서울 성동구 아차산로17길 49',
      detail: '생각공장데시앙플렉스 1509~1512호',
      phone: '02-423-7110',
    },
    {
      name: '강남',
      address: '서울 강남구 강남대로84길 23',
      phone: '02-567-2395',
    },
    {
      name: '남양주',
      address: '경기 남양주시 다산지금로 202',
      phone: '0507-0464-2178',
    },
    {
      name: '부천',
      address: '경기 부천시 중동 1111',
      phone: '문의 필요',
    },
  ];

  return (
    <section id="contact" className={styles.branches}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>BRANCHES</div>
          <h2 className={styles.headline}>지점 안내</h2>
        </div>

        <div className={styles.grid}>
          {branches.map((branch, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.name}>{branch.name}</div>
              <div className={styles.address}>
                {branch.address}
                {branch.detail && <span className={styles.detail}>{branch.detail}</span>}
              </div>
              <a href={`tel:${branch.phone.replace(/[^0-9]/g, '')}`} className={styles.phone}>
                {branch.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}