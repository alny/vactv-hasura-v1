import * as React from "react";

export const Context = (React as any).createContext();

class ContextProvider extends React.Component {
  state = {
    user: {
      id: "",
      name: "",
      image: "",
      nickName: ""
    }
  };

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("user"));

    this.setState(prevState => ({
      user: { ...(prevState as any).user, ...user }
    }));
  }

  setUser = user => {
    this.setState(prevState => ({
      user: { ...(prevState as any).user, ...user }
    }));
  };

  clearUser = () => {
    this.setState({
      user: {
        id: "",
        name: "",
        image: "",
        nickName: ""
      }
    });
  };

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          actions: { setUser: this.setUser, clearUser: this.clearUser }
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default ContextProvider;
