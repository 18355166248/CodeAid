import { Input } from "antd";
import "./index.scss";

const Footer = () => {
  return (
    <div className="w-full footer fixed bottom-6 left-0 flex justify-center px-6">
      <div className="content bg-white rounded-lg overflow-hidden p-4">
        <Input.TextArea
          className="input-ans-msg"
          placeholder="请输入聊天内容"
          autoSize={{ minRows: 1, maxRows: 5 }}
        />
        <div className="flex justify-between">
          <span></span>
          <div>
            <div className="send-btn">
              <span className="iconfont icon-a-44tubiao-133" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
