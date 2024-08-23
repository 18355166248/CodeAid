import { Select } from "antd";

const Header = () => {
  return (
    <div className="header text-center">
      <div className="mb-2 text-gray-400 text-sm">欢迎使用 CodeAid</div>
      <Select className="w-56">
        <Select.Option val="1" key={1}>
          1
        </Select.Option>
      </Select>
    </div>
  );
};

export default Header;
