import { Space } from "antd";
export default function HomePage() {
  return (
    <div>
      <h1>find me in</h1>
      <Space>
        <a
          href="https://m.zhipin.com/mpa/html/resume-detail?sid=self&securityId=uU_Wfw_yy9jCn-F1bg8fmriZ4RID737lQLyo7cCX2zVvQg5dFpzU9DDuoH6sFVW7xHB8eVB0xToA9LFk636TBr68SsmsMXxlpETbi4hPAOhBn9hwmU27WTXvdvgCRe8wbiCfBPaERHGU3vQnJl6IJFuVB00sH34qx0Jd2w~~"
          target="_blank"
        >
          <img src="/icons/zhipin.png" alt="BOSS直聘" className="w-12" />
        </a>    <a
          href="https://www.linkedin.com/in/song-penghui"
          target="_blank"
        >
          <img src="/icons/linkedin.jpg" alt="领英" className="w-12" />
        </a>
      </Space>
    </div>
  );
}
