import React from "react";
import { mount, shallow } from "../../enzymeSetUp";
import Configuration from "./Configuration";
import config from "react-global-configuration";
import dev from "../../config/dev";

describe("Configuration ==> Test UI  ", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Configuration />);
  });

  it("Configuration : should render correctly", () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe("SearchComponent  ==> Test Status of Component", () => {
  let componentWraper;
  beforeEach(() => {
    config.set(dev, { freeze: false });
    componentWraper = mount(<Configuration />);
  });

  it("Configuration : should be state {configData:{}, isLoaded=false} first time   ", () => {
    expect(componentWraper.state().isLoaded).toEqual(false);
    expect(componentWraper.state().configData).toEqual({});
  });

  it("Configuration : should be able to change Status   ", () => {
    var newStatus = {
      name: "Production",
      ELASTIC_SEARCH: {
        URL: "http://192.168.98.115/es/",
        CREDENCIAL: "",
        APP_NAME: "oer_data"
      }
    };
    componentWraper.setState(newStatus);
    expect(componentWraper.state().isLoaded).toEqual(false);
    expect(componentWraper.state().configData).toBeTruthy();
  });
});
