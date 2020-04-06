import React from "react";
import { mount, shallow } from "../../../setupFiles";
import Configuration from "../../../components/configuration/Configuration";
import config from "react-global-configuration";
import prod from "../../../config/prod";

describe("Configuration ==> Test UI  ", () => {
  let wrapperShallow;
  beforeEach(() => {
    wrapperShallow = shallow(<Configuration />);
  });

  it("Configuration : should render correctly", () => {
    expect(wrapperShallow).toMatchSnapshot();
  });
});

describe("Configuration  ==> Test Status of Component", () => {
  let wrapperMount;
  beforeEach(() => {
    config.set(prod, { freeze: false });
    wrapperMount = mount(<Configuration />);
  });

  it("Configuration : should be state {configData:{}, isLoaded=false} first time   ", () => {
    expect(wrapperMount.state().isLoaded).toEqual(false);
    expect(wrapperMount.state().configData).toEqual({});
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
    wrapperMount.setState(newStatus);
    expect(wrapperMount.state().isLoaded).toEqual(false);
    expect(wrapperMount.state().configData).toBeTruthy();
  });
});
