import React from "react";
import { mount, shallow } from "../../enzymeSetUp";
import ErrorComponent from "./ErrorComponent";

describe("ErrorPageComponent ==> UI  ", () => {
  let wrapperMount, wrapperShadow;
  beforeEach(() => {
    wrapperMount = mount(<ErrorComponent />);
    wrapperShadow = shallow(<ErrorComponent />);
  });

  it("MultiListComponent : should render correctly", () => {
    expect(wrapperShadow).toMatchSnapshot();
  });

  it(" ErrorPageComponent:  wraps content in a div with .info class", () => {
    expect(wrapperMount.find(".info").length).toBe(1);
  });

  it(" ErrorPageComponent:  Find Text inside Component", () => {
    expect(
      wrapperShadow
        .text()
        .includes("Sorry something was wrong and we can't load the page")
    ).toBe(true);
  });
});
