import React from "react";
import { shallow } from "../../../setupFiles";
import config from "react-global-configuration";
import prod from "../../../config/prod";
import ResultComponent from "../../../components/resultComponent/ResultComponent";

describe("ResultComponent ==> Test UI  ", () => {
  let wrapperShadow;
  beforeEach(() => {
    config.set(prod, { freeze: false });
    wrapperShadow = shallow(<ResultComponent />);
  });

  it("ResultComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot();
  });

  it(" ResultComponent:  should  wraps content in a div with .col-md-12 class", () => {
    expect(wrapperShadow.find(".col-md-12").length).toBe(1);
  });
});

describe("ResultComponent  ==> Test Status of Component", () => {
  let wrapperShadow;
  beforeEach(() => {
    config.set(prod, { freeze: false });
    wrapperShadow = shallow(<ResultComponent />);
  });

  it(" ResultComponent:  should be empty state ", () => {
    config.set({}, { freeze: false });
    const localWrapperShadow = shallow(<ResultComponent />);
    expect(localWrapperShadow.state()).toEqual({});
  });

  it("ResultComponent :  should  State must be not empty ", () => {
    expect(wrapperShadow.state()).toBeTruthy();
  });

  it(" ResultComponent:  should  change status  ", () => {
    wrapperShadow.setState({ componentTest: "Test" });
    expect(wrapperShadow.state().componentTest).toEqual("Test");
  });
});
