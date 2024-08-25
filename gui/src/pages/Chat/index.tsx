import Content from "./comp/Content";
import Footer from "./comp/Footer";
import Header from "./comp/Header";

const Chat = () => {
  return (
    <div className="chat p-4">
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default Chat;
