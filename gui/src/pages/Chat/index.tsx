import Content from "./comp/Content";
import Footer from "./comp/Footer";
import Header from "./comp/Header";

const Chat = () => {
  return (
    <div className="chat min-w-72 py-4">
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default Chat;
