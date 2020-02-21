import ToastComponent from "./ToastComponent";
import React from "react";
import { shallow, mount } from "../../enzymeSetUp";

const toastMessage = {
  title: "Toast Title",
  message: "This is a tost message test"
};

describe("ToastComponent ==> Test UI  ", () => {
  let wrapperShadow;
  beforeEach(() => {
    wrapperShadow = shallow(<ToastComponent {...toastMessage} />);
  });

  it("ToastComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot();
  });
});

describe("ToastComponent  ==> Test Props of Component", () => {
  let wrapperMount;
  beforeEach(() => {
    wrapperMount = mount(<ToastComponent {...toastMessage} />);
  });

  it(" ToastComponent:  should be not empty props ", () => {
    expect(wrapperMount.props()).toBeTruthy();
  });

  it("ToastComponent :  should be props same as Object ", () => {
    expect(wrapperMount.props()).toMatchObject(toastMessage);
  });

  it("ToastComponent :  should be able to add other props ", () => {
    wrapperMount.setProps({ name: "ToastName Test" });
    expect(wrapperMount.prop("name")).toEqual("ToastName Test");
  });
});
