import { Select } from "antd";
import { ChatModelsEnum } from "../../../../constant/chat.const";
import { useChatStore } from "../../index.store";

const Header = () => {
  const { model } = useChatStore();
  return (
    <div className="header text-center">
      <div className="mb-2 text-gray-400 text-sm">欢迎使用 CodeAid</div>
      <Select className="w-56" value={model}>
        {Object.values(ChatModelsEnum).map((item) => (
          <Select.Option val={item.value} key={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default Header;
