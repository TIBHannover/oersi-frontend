import React from "react";
import { shallow } from "../../enzymeSetUp";
import SearchComponent from "./SearchComponent";
import config from "react-global-configuration";
import dev from "../../config/dev";

describe("SearchComponent ==> Test UI  ", () => {
  let wrapperShadow;
  beforeEach(() => {
    config.set(dev, { freeze: false });
    wrapperShadow = shallow(<SearchComponent />);
  });

  it("SearchComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot();
  });

  it(" SearchComponent:  should  wraps content in a div with .card class", () => {
    expect(wrapperShadow.find(".card").length).toBe(1);
  });
});

describe("SearchComponent  ==> Test Status of Component", () => {
  let wrapperShadow;
  beforeEach(() => {
    config.set(dev, { freeze: false });
    wrapperShadow = shallow(<SearchComponent />);
  });

  it(" SearchComponent:  should be empty state ", () => {
    config.set({}, { freeze: false });
    const localWrapperShadow = shallow(<SearchComponent />);
    expect(localWrapperShadow.state()).toEqual({});
  });

  it("SearchComponent :  should  State must be not empty ", () => {
    expect(wrapperShadow.state()).toBeTruthy();
  });

  it(" SearchComponent:  should  change status  ", () => {
    wrapperShadow.setState({ componentTest: "Test" });
    expect(wrapperShadow.state().componentTest).toEqual("Test");
  });
});
